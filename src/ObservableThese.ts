/**
 * @since 0.6.12
 */
import { Applicative2, Applicative2C } from 'fp-ts/lib/Applicative'
import { Apply1 } from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2C } from 'fp-ts/lib/Monad'
import { pipe } from 'fp-ts/lib/pipeable'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { Task } from 'fp-ts/lib/Task'
import * as TT from 'fp-ts/lib/TaskThese'
import * as TH from 'fp-ts/lib/These'
import { getTheseM } from 'fp-ts/lib/TheseT'
import { Observable } from 'rxjs'
import * as R from './Observable'

const T = getTheseM(R.Monad)

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.12
 */
export interface ObservableThese<E, A> extends Observable<TH.These<E, A>> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.12
 */
export const left: <E = never, A = never>(e: E) => ObservableThese<E, A> = T.left

/**
 * @category constructors
 * @since 0.6.12
 */
export const both: <E = never, A = never>(e: E, a: A) => ObservableThese<E, A> = T.both

/**
 * @category constructors
 * @since 0.6.12
 */
export const right: <E = never, A = never>(a: A) => ObservableThese<E, A> = T.right

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableThese<E, A> = T.rightM

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableThese<E, A> = T.leftM

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableThese<E, A> = R.fromIO

/**
 * @category constructors
 * @since 0.6.12
 */
export function rightIO<E, A>(ma: IO<A>): ObservableThese<E, A> {
  return rightObservable(R.fromIO(ma))
}

/**
 * @category constructors
 * @since 0.6.12
 */
export function leftIO<E, A>(me: IO<E>): ObservableThese<E, A> {
  return leftObservable(R.fromIO(me))
}

/**
 * @category constructors
 * @since 0.6.12
 */
export function fromTaskThese<E, A>(t: TT.TaskThese<E, A>): ObservableThese<E, A> {
  return R.fromTask(t)
}

/**
 * @category constructors
 * @since 0.6.12
 */
export function fromTask<E, A>(ma: Task<A>): ObservableThese<E, A> {
  return rightObservable(R.fromTask(ma))
}

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category destructors
 * @since 0.6.12
 */
export function fold<E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>,
  onBoth: (e: E, a: A) => Observable<B>
): (ma: ObservableThese<E, A>) => Observable<B> {
  return ma => T.fold(ma, onLeft, onRight, onBoth)
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.6.12
 */
export const swap: <E, A>(ma: ObservableThese<E, A>) => ObservableThese<A, E> = T.swap

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.12
 */
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableThese<E, A>) => ObservableThese<E, B> = f => fa =>
  T.map(fa, f)

/**
 * @category Bifunctor
 * @since 0.6.12
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableThese<E, A>) => ObservableThese<G, B> = (f, g) => fa => T.bimap(fa, f, g)

/**
 * @category Bifunctor
 * @since 0.6.12
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableThese<E, A>) => ObservableThese<G, A> = f => fa =>
  T.mapLeft(fa, f)

/**
 * @category Applicative
 * @since 0.6.12
 */
export const of: Applicative2<URI>['of'] = right

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

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
  const A = getApplicative(R.Apply, SE)
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

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export function toTaskThese<E, A>(o: ObservableThese<E, A>): TT.TaskThese<E, A> {
  return () => o.toPromise()
}
