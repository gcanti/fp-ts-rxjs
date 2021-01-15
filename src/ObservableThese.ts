/**
 * @since 0.6.12
 */
import * as TH from 'fp-ts/lib/These'
import * as R from './Observable'
import * as TT from 'fp-ts/lib/TaskThese'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2C } from 'fp-ts/lib/Monad'
import { Observable } from 'rxjs'
import { Task } from 'fp-ts/lib/Task'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { getTheseM } from 'fp-ts/lib/TheseT'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { Functor2 } from 'fp-ts/lib/Functor'
import { Apply1 } from 'fp-ts/lib/Apply'
import { Applicative2, Applicative2C } from 'fp-ts/lib/Applicative'

const T = getTheseM(R.observable)

/**
 * @since 0.6.12
 */
export const URI = 'ObservableThese'

/**
 * @since 0.6.12
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: ObservableThese<E, A>
  }
}

/**
 * @since 0.6.12
 */
export interface ObservableThese<E, A> extends Observable<TH.These<E, A>> {}

/**
 * @since 0.6.12
 */
export const left: <E = never, A = never>(e: E) => ObservableThese<E, A> = T.left

/**
 * @since 0.6.12
 */
export const both: <E = never, A = never>(e: E, a: A) => ObservableThese<E, A> = T.both

/**
 * @since 0.6.12
 */
export const right: <E = never, A = never>(a: A) => ObservableThese<E, A> = T.right

/**
 * @since 0.6.12
 */
export const of: Applicative2<URI>['of'] = right

/**
 * @since 0.6.12
 */
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableThese<E, A> = T.rightM

/**
 * @since 0.6.12
 */
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableThese<E, A> = T.leftM

/**
 * @since 0.6.12
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableThese<E, A> = R.fromIO

/**
 * @since 0.6.12
 */
export function rightIO<E, A>(ma: IO<A>): ObservableThese<E, A> {
  return rightObservable(R.fromIO(ma))
}

/**
 * @since 0.6.12
 */
export function leftIO<E, A>(me: IO<E>): ObservableThese<E, A> {
  return leftObservable(R.fromIO(me))
}

/**
 * @since 0.6.12
 */
export function fromTaskThese<E, A>(t: TT.TaskThese<E, A>): ObservableThese<E, A> {
  return R.fromTask(t)
}

/**
 * @since 0.6.12
 */
export function toTaskThese<E, A>(o: ObservableThese<E, A>): TT.TaskThese<E, A> {
  return () => o.toPromise()
}

/**
 * @since 0.6.12
 */
export function fromTask<E, A>(ma: Task<A>): ObservableThese<E, A> {
  return rightObservable(R.fromTask(ma))
}

/**
 * @since 0.6.12
 */
export function fold<E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>,
  onBoth: (e: E, a: A) => Observable<B>
): (ma: ObservableThese<E, A>) => Observable<B> {
  return ma => T.fold(ma, onLeft, onRight, onBoth)
}

/**
 * @since 0.6.12
 */
export const swap: <E, A>(ma: ObservableThese<E, A>) => ObservableThese<A, E> = T.swap

/**
 * @category instances
 * @since 0.6.12
 */
export function getApplicative<E>(A: Apply1<R.URI>, SE: Semigroup<E>): Applicative2C<URI, E> {
  const AV = TH.getMonad(SE)
  const ap = <A>(fga: Observable<TH.These<E, A>>) => <B>(
    fgab: Observable<TH.These<E, (a: A) => B>>
  ): Observable<TH.These<E, B>> =>
    A.ap(
      A.map(fgab, h => (ga: TH.These<E, A>) => AV.ap(h, ga)),
      fga
    )
  return {
    URI,
    _E: undefined as any,
    map: T.map,
    ap: (fab, fa) => pipe(fab, ap(fa)),
    of
  }
}

/**
 * @category instances
 * @since 0.6.12
 */
export function getMonad<E>(SE: Semigroup<E>): Monad2C<URI, E> {
  const A = getApplicative(R.observable, SE)
  return {
    URI,
    _E: undefined as any,
    map: T.map,
    ap: A.ap,
    of,
    chain: (ma, f) =>
      pipe(
        ma,
        R.chain(
          TH.fold(left, f, (e1, a) =>
            pipe(
              f(a),
              R.map(
                TH.fold(
                  e2 => TH.left(SE.concat(e1, e2)),
                  b => TH.both(e1, b),
                  (e2, b) => TH.both(SE.concat(e1, e2), b)
                )
              )
            )
          )
        )
      )
  }
}

/**
 * @since 0.6.12
 */
export const Functor: Functor2<URI> = {
  URI,
  map: T.map
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: T.bimap,
  mapLeft: T.mapLeft
}

/**
 * @category instances
 * @since 0.6.12
 */
export const observableThese: Functor2<URI> & Bifunctor2<URI> = {
  URI,
  map: T.map,
  bimap: T.bimap,
  mapLeft: T.mapLeft
}

const { map, bimap, mapLeft } = pipeable(observableThese)

export {
  /**
   * @since 0.6.12
   */
  bimap,
  /**
   * @since 0.6.12
   */
  map,
  /**
   * @since 0.6.12
   */
  mapLeft
}
