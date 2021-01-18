/**
 * @since 0.6.12
 */
import { Applicative2, Applicative2C } from 'fp-ts/lib/Applicative'
import { Apply1 } from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { flow } from 'fp-ts/lib/function'
import { Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2C } from 'fp-ts/lib/Monad'
import { MonadIO2 } from 'fp-ts/lib/MonadIO'
import { MonadTask2 } from 'fp-ts/lib/MonadTask'
import { pipe } from 'fp-ts/lib/pipeable'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import * as TT from 'fp-ts/lib/TaskThese'
import * as TH from 'fp-ts/lib/These'
import { defer, merge, Observable, OperatorFunction, Subject } from 'rxjs'
import { finalize, withLatestFrom } from 'rxjs/operators'
import * as R from './Observable'

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
export const left: <E = never, A = never>(e: E) => ObservableThese<E, A> =
  /*#__PURE__*/
  flow(TH.left, R.of)

/**
 * @category constructors
 * @since 0.6.12
 */
export const both: <E = never, A = never>(e: E, a: A) => ObservableThese<E, A> =
  /*#__PURE__*/
  flow(TH.both, R.of)

/**
 * @category constructors
 * @since 0.6.12
 */
export const right: <E = never, A = never>(a: A) => ObservableThese<E, A> =
  /*#__PURE__*/
  flow(TH.right, R.of)

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableThese<E, A> =
  /*#__PURE__*/
  R.map(TH.right)

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableThese<E, A> =
  /*#__PURE__*/
  R.map(TH.left)

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableThese<E, A> = R.fromIO

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightIO: <E = never, A = never>(ma: IO<A>) => ObservableThese<E, A> =
  /*#__PURE__*/
  flow(R.fromIO, rightObservable)

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftIO: <E = never, A = never>(me: IO<E>) => ObservableThese<E, A> =
  /*#__PURE__*/
  flow(R.fromIO, leftObservable)

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromTaskThese: <E, A>(t: TT.TaskThese<E, A>) => ObservableThese<E, A> = R.fromTask

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromIO: MonadIO2<URI>['fromIO'] = rightIO

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromTask: MonadTask2<URI>['fromTask'] =
  /*#__PURE__*/
  flow(R.fromTask, rightObservable)

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category destructors
 * @since 0.6.12
 */
export const fold: <E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>,
  onBoth: (e: E, a: A) => Observable<B>
) => (ma: ObservableThese<E, A>) => Observable<B> =
  /*#__PURE__*/
  flow(TH.fold, R.chain)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.6.12
 */
export const swap: <E, A>(ma: ObservableThese<E, A>) => ObservableThese<A, E> =
  /*#__PURE__*/
  R.map(TH.swap)

/**
 * Lifts an OperatorFunction into an ObservableThese context
 * Allows e.g. filter to be used on on ObservableThese
 *
 * @category combinators
 * @since 0.6.12
 */
export function liftOperator<E, A, B>(
  f: OperatorFunction<A, B>
): (obs: ObservableThese<E, A>) => ObservableThese<E, B> {
  return obs => {
    const subj = new Subject<TH.These<E, A>>()
    return merge(
      pipe(
        merge(
          pipe(subj, R.filter(TH.isLeft)),
          pipe(
            subj,
            R.filter(TH.isRight),
            R.map(({ right }) => right),
            f,
            R.map(TH.right)
          ),
          pipe(
            subj,
            R.filter(TH.isBoth),
            a =>
              pipe(
                a,
                R.map(({ right }) => right),
                f,
                withLatestFrom(
                  pipe(
                    a,
                    R.map(({ left }) => left)
                  )
                )
              ),
            R.map(([b, e]) => TH.both(e, b))
          )
        )
      ),
      defer(() => {
        obs.pipe(finalize(() => subj.complete())).subscribe(subj)
      })
    )
  }
}

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
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableThese<E, A>) => ObservableThese<E, B> = f =>
  R.map(TH.map(f))

/**
 * @category Bifunctor
 * @since 0.6.12
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableThese<E, A>) => ObservableThese<G, B> = (f, g) => R.map(TH.bimap(f, g))

/**
 * @category Bifunctor
 * @since 0.6.12
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableThese<E, A>) => ObservableThese<G, A> = f =>
  R.map(TH.mapLeft(f))

/**
 * @category Applicative
 * @since 0.6.12
 */
export const of: Applicative2<URI>['of'] = right

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const map_: Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const bimap_: Bifunctor2<URI>['bimap'] = (fea, f, g) => pipe(fea, bimap(f, g))
/* istanbul ignore next */
const mapLeft_: Bifunctor2<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))

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
export const getApplicative = <E>(A: Apply1<R.URI>, S: Semigroup<E>): Applicative2C<URI, E> => {
  const AV = TH.getMonad(S)
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
    map: map_,
    ap: (fab, fa) => pipe(fab, ap(fa)),
    of
  }
}

/**
 * @category instances
 * @since 0.6.12
 */
export const getMonad = <E>(S: Semigroup<E>): Monad2C<URI, E> => {
  const A = getApplicative(R.Apply, S)
  return {
    URI,
    _E: undefined as any,
    map: map_,
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
                  e2 => TH.left(S.concat(e1, e2)),
                  b => TH.both(e1, b),
                  (e2, b) => TH.both(S.concat(e1, e2), b)
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
  map: map_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: bimap_,
  mapLeft: mapLeft_
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const toTaskThese = <E, A>(o: ObservableThese<E, A>): TT.TaskThese<E, A> => () => o.toPromise()
