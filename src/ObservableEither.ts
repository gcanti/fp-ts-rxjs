/**
 * @since 0.6.8
 */
import { Alt2 } from 'fp-ts/lib/Alt'
import { Applicative2 } from 'fp-ts/lib/Applicative'
import { Apply2 } from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import * as E from 'fp-ts/lib/Either'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2 } from 'fp-ts/lib/Monad'
import { MonadIO2 } from 'fp-ts/lib/MonadIO'
import { MonadTask2 } from 'fp-ts/lib/MonadTask'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { Observable } from 'rxjs'
import { MonadObservable2 } from './MonadObservable'
import * as R from './Observable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.8
 */
export interface ObservableEither<E, A> extends Observable<E.Either<E, A>> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.8
 */
export const left: <E = never, A = never>(e: E) => ObservableEither<E, A> =
  /*#__PURE__*/
  flow(E.left, R.of)

/**
 * @category constructors
 * @since 0.6.8
 */
export const right: <E = never, A = never>(a: A) => ObservableEither<E, A> =
  /*#__PURE__*/
  flow(E.right, R.of)

/**
 * @category constructors
 * @since 0.6.8
 */
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableEither<E, A> =
  /*#__PURE__*/
  R.map(E.right)

/**
 * @category constructors
 * @since 0.6.8
 */
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableEither<E, A> =
  /*#__PURE__*/
  R.map(E.left)

/**
 * @category constructors
 * @since 0.6.8
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableEither<E, A> = R.fromIO

/**
 * @category constructors
 * @since 0.6.8
 */
export const rightIO: <E = never, A = never>(ma: IO<A>) => ObservableEither<E, A> =
  /*#__PURE__*/
  flow(R.fromIO, rightObservable)

/**
 * @category constructors
 * @since 0.6.8
 */
export const leftIO: <E = never, A = never>(me: IO<E>) => ObservableEither<E, A> =
  /*#__PURE__*/
  flow(R.fromIO, leftObservable)

/**
 * @category constructors
 * @since 0.6.8
 */
export const fromTaskEither: <E, A>(t: TE.TaskEither<E, A>) => ObservableEither<E, A> = R.fromTask

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromIO: MonadIO2<URI>['fromIO'] = rightIO

/**
 * @category constructors
 * @since 0.6.8
 */
export const fromTask: MonadTask2<URI>['fromTask'] =
  /*#__PURE__*/
  flow(R.fromTask, rightObservable)

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromObservable: MonadObservable2<URI>['fromObservable'] = rightObservable

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category destructors
 * @since 0.6.8
 */
export const fold: <E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>
) => (ma: ObservableEither<E, A>) => Observable<B> =
  /*#__PURE__*/
  flow(E.fold, R.chain)

/**
 * @category destructors
 * @since 0.6.8
 */
export const getOrElse = <E, A>(onLeft: (e: E) => Observable<A>) => (ma: ObservableEither<E, A>): Observable<A> =>
  pipe(ma, R.chain(E.fold(onLeft, R.of)))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.6.8
 */
export const orElse: <E, A, M>(
  onLeft: (e: E) => ObservableEither<M, A>
) => (ma: ObservableEither<E, A>) => ObservableEither<M, A> = f => R.chain(E.fold(f, right))

/**
 * @category combinators
 * @since 0.6.8
 */
export const swap: <E, A>(ma: ObservableEither<E, A>) => ObservableEither<A, E> =
  /*#__PURE__*/
  R.map(E.swap)

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.8
 */
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableEither<E, A>) => ObservableEither<E, B> = f =>
  R.map(E.map(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.0
 */
export const ap = <E, A>(
  fa: ObservableEither<E, A>
): (<B>(fab: ObservableEither<E, (a: A) => B>) => ObservableEither<E, B>) =>
  flow(
    R.map(gab => (ga: E.Either<E, A>) => E.ap(ga)(gab)),
    R.ap(fa)
  )

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.8
 */
export const apFirst: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, A> = fb =>
  flow(
    map(a => () => a),
    ap(fb)
  )

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.8
 */
export const apSecond = <E, B>(
  fb: ObservableEither<E, B>
): (<A>(fa: ObservableEither<E, A>) => ObservableEither<E, B>) =>
  flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 0.6.8
 */
export const alt = <E, A>(
  that: () => ObservableEither<E, A>
): ((fa: ObservableEither<E, A>) => ObservableEither<E, A>) => R.chain(E.fold(that, right))

/**
 * @category Bifunctor
 * @since 0.6.8
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableEither<E, A>) => ObservableEither<G, B> =
  /*#__PURE__*/
  flow(E.bimap, R.map)

/**
 * @category Bifunctor
 * @since 0.6.8
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableEither<E, A>) => ObservableEither<G, A> = f =>
  R.map(E.mapLeft(f))

/**
 * @category Monad
 * @since 0.6.8
 */
export const chain = <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
): ((ma: ObservableEither<E, A>) => ObservableEither<E, B>) => R.chain(E.fold(left, f))

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.0
 */
export const flatten: <E, A>(mma: ObservableEither<E, ObservableEither<E, A>>) => ObservableEither<E, A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.8
 */
export const chainFirst: <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => a)
    )
  )

/**
 * @since 0.6.12
 */
export const of: Applicative2<URI>['of'] = right

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (
    ma: ObservableEither<E, A>
  ) => ObservableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: ObservableEither<E, A>) => ObservableEither<E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): ((ma: ObservableEither<E, A>) => ObservableEither<E, A>) =>
  chain(a => (predicate(a) ? of(a) : throwError(onFalse(a))))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromEither: <E, A>(ma: E.Either<E, A>) => ObservableEither<E, A> = ma =>
  ma._tag === 'Left' ? throwError(ma.left) : of(ma.right)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromOption = <E>(onNone: () => E) => <A>(ma: Option<A>): ObservableEither<E, A> =>
  ma._tag === 'None' ? throwError(onNone()) : of(ma.value)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => ObservableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => ObservableEither<E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => (a: A): ObservableEither<E, A> =>
  predicate(a) ? of(a) : throwError(onFalse(a))

/**
 * @category MonadThrow
 * @since 0.6.12
 */
export const throwError: MonadThrow2<URI>['throwError'] = left

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const map_: Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const ap_: Apply2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const chain_: Monad2<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const bimap_: Bifunctor2<URI>['bimap'] = (fea, f, g) => pipe(fea, bimap(f, g))
/* istanbul ignore next */
const mapLeft_: Bifunctor2<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))
/* istanbul ignore next */
const alt_: Alt2<URI>['alt'] = (fx, fy) => pipe(fx, alt(fy))

/**
 * @category instances
 * @since 0.6.8
 */
export const URI = 'ObservableEither'

/**
 * @category instances
 * @since 0.6.8
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: ObservableEither<E, A>
  }
}

/**
 * @category instances
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
export const Apply: Apply2<URI> = {
  URI,
  map: map_,
  ap: ap_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Monad: Monad2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_
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

/**
 * @category instances
 * @since 0.6.12
 */
export const Alt: Alt2<URI> = {
  URI,
  map: map_,
  alt: alt_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadIO: MonadIO2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadTask: MonadTask2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO,
  fromTask,
  fromObservable
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadThrow: MonadThrow2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  throwError
}

/**
 * @category instances
 * @deprecated
 * @since 0.6.8
 */
export const observableEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadObservable2<URI> & MonadThrow2<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  bimap: bimap_,
  mapLeft: mapLeft_,
  alt: alt_,
  fromIO: rightIO,
  fromTask,
  fromObservable: rightObservable,
  throwError: left
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: ObservableEither<never, {}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
export const bindTo = <K extends string, E, A>(
  name: K
): ((fa: ObservableEither<E, A>) => ObservableEither<E, { [P in K]: A }>) =>
  map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.11
 */
export const bind = <K extends string, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E, B>
): ((fa: ObservableEither<E, A>) => ObservableEither<E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )

/**
 * @since 0.6.12
 */
export const bindW: <K extends string, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E2, B>
) => <E1>(
  fa: ObservableEither<E1, A>
) => ObservableEither<E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any

/**
 * @since 0.6.8
 */
export const toTaskEither = <E, A>(o: ObservableEither<E, A>): TE.TaskEither<E, A> => () => o.toPromise()
