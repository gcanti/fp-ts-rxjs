/**
 * @since 0.6.10
 */
import { Applicative3 } from 'fp-ts/lib/Applicative'
import { Apply3 } from 'fp-ts/lib/Apply'
import { Bifunctor3 } from 'fp-ts/lib/Bifunctor'
import { Either } from 'fp-ts/lib/Either'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { Functor3 } from 'fp-ts/lib/Functor'
import { Monad3 } from 'fp-ts/lib/Monad'
import { MonadIO3 } from 'fp-ts/lib/MonadIO'
import { MonadTask3 } from 'fp-ts/lib/MonadTask'
import { MonadThrow3 } from 'fp-ts/lib/MonadThrow'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Reader'
import { OperatorFunction } from 'rxjs'
import { MonadObservable3 } from './MonadObservable'
import * as OE from './ObservableEither'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.10
 */
export interface ReaderObservableEither<R, E, A> {
  (r: R): OE.ObservableEither<E, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservableEither: <R, E, A>(ma: OE.ObservableEither<E, A>) => ReaderObservableEither<R, E, A> = R.of

/**
 * @category constructors
 * @since 2.0.0
 */
export const right: <R, E = never, A = never>(a: A) => ReaderObservableEither<R, E, A> =
  /*#__PURE__*/
  flow(OE.right, fromObservableEither)

/**
 * @category constructors
 * @since 2.0.0
 */
export const left: <R, E = never, A = never>(e: E) => ReaderObservableEither<R, E, A> =
  /*#__PURE__*/
  flow(OE.left, fromObservableEither)

/**
 * @category constructors
 * @since 0.6.10
 */
export const ask: <R, E>() => ReaderObservableEither<R, E, R> = () => OE.right

/**
 * @category constructors
 * @since 0.6.10
 */
export const asks: <R, E, A>(f: (r: R) => A) => ReaderObservableEither<R, E, A> = f => flow(OE.right, OE.map(f))

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromReader: <R, E, A>(ma: R.Reader<R, A>) => ReaderObservableEither<R, E, A> = ma => flow(ma, OE.right)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromIO: MonadIO3<URI>['fromIO'] = ma => () => OE.rightIO(ma)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromTask: MonadTask3<URI>['fromTask'] = ma => () => OE.fromTask(ma)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservable: MonadObservable3<URI>['fromObservable'] = ma => () => OE.rightObservable(ma)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.6.10
 */
export const local: <R2, R1>(
  f: (d: R2) => R1
) => <E, A>(ma: ReaderObservableEither<R1, E, A>) => ReaderObservableEither<R2, E, A> = R.local

/**
 * Lifts an OperatorFunction into a ReaderObservableEither context
 * Allows e.g. filter to be used on on ReaderObservableEither
 *
 * @category combinators
 * @since 0.6.12
 */
export function liftOperator<R, E, A, B>(
  f: OperatorFunction<A, B>
): (obs: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> {
  return obs => r => OE.liftOperator<E, A, B>(f)(obs(r))
}

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @category MonadThrow
 * @since 0.6.10
 */
export const throwError: MonadThrow3<URI>['throwError'] = e => () => OE.left(e)

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.10
 */
export const map: <A, B>(
  f: (a: A) => B
) => <R, E>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = f => fa => flow(fa, OE.map(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.10
 */
export const ap: <R, E, A>(
  fa: ReaderObservableEither<R, E, A>
) => <B>(fab: ReaderObservableEither<R, E, (a: A) => B>) => ReaderObservableEither<R, E, B> = fa => fab => r =>
  pipe(fab(r), OE.ap(fa(r)))

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const apFirst: <R, E, B>(
  fb: ReaderObservableEither<R, E, B>
) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = fb =>
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
 * @since 0.6.10
 */
export const apSecond = <R, E, B>(
  fb: ReaderObservableEither<R, E, B>
): (<A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>) =>
  flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * @category Applicative
 * @since 0.6.10
 */
export const of: Applicative3<URI>['of'] = right

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, B> = (f, g) => fea => r =>
  OE.bimap(f, g)(fea(r))

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, A> = f => fea => r =>
  OE.mapLeft(f)(fea(r))

/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 0.6.12
 */
export const chainW = <A, R2, E2, B>(f: (a: A) => ReaderObservableEither<R2, E2, B>) => <R1, E1>(
  ma: ReaderObservableEither<R1, E1, A>
): ReaderObservableEither<R1 & R2, E1 | E2, B> => r =>
  pipe(
    ma(r),
    OE.chainW(a => f(a)(r))
  )

/**
 * @category Monad
 * @since 0.6.10
 */
export const chain: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = chainW

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const flatten: <R, E, A>(
  mma: ReaderObservableEither<R, E, ReaderObservableEither<R, E, A>>
) => ReaderObservableEither<R, E, A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const chainFirst: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => a)
    )
  )

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderObservableEither<R, E, A>
  ) => ReaderObservableEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(
    ma: ReaderObservableEither<R, E, A>
  ) => ReaderObservableEither<R, E, A>
} = <E, A>(
  predicate: Predicate<A>,
  onFalse: (a: A) => E
): (<R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>) =>
  chain(a => (predicate(a) ? of(a) : throwError(onFalse(a))))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromEither: <R, E, A>(ma: Either<E, A>) => ReaderObservableEither<R, E, A> = ma =>
  ma._tag === 'Left' ? throwError(ma.left) : of(ma.right)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromOption = <E>(onNone: () => E) => <R, A>(ma: Option<A>): ReaderObservableEither<R, E, A> =>
  ma._tag === 'None' ? throwError(onNone()) : of(ma.value)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => <R>(a: A): ReaderObservableEither<R, E, A> =>
  predicate(a) ? of(a) : throwError(onFalse(a))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const map_: Functor3<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const ap_: Apply3<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad3<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const bimap_: Bifunctor3<URI>['bimap'] = (fea, f, g) => pipe(fea, bimap(f, g))
/* istanbul ignore next */
const mapLeft_: Bifunctor3<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))

/**
 * @category instances
 * @since 0.6.10
 */
export const URI = 'ReaderObservableEither'

/**
 * @category instances
 * @since 0.6.10
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  export interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderObservableEither<R, E, A>
  }
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Functor: Functor3<URI> = {
  URI,
  map: map_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Apply: Apply3<URI> = {
  URI,
  map: map_,
  ap: ap_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Applicative: Applicative3<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Monad: Monad3<URI> = {
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
export const Bifunctor: Bifunctor3<URI> = {
  URI,
  bimap: bimap_,
  mapLeft: mapLeft_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadIO: MonadIO3<URI> = {
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
export const MonadTask: MonadTask3<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable3<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  fromIO,
  fromObservable,
  fromTask
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadThrow: MonadThrow3<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  throwError
}

/**
 * @category instances
 * @since 0.6.10
 * @deprecated
 */
export const readerObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = {
  URI,
  ap: ap_,
  map: map_,
  of,
  chain: chain_,
  fromIO,
  fromObservable,
  fromTask,
  throwError,
  bimap: bimap_,
  mapLeft: mapLeft_
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: ReaderObservableEither<unknown, never, {}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
export const bindTo = <K extends string, R, E, A>(
  name: K
): ((fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }>) =>
  map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.11
 */
export const bind = <K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
): ((
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )

/**
 * @since 0.6.12
 */
export const bindW: <K extends string, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderObservableEither<R1, E1, A>
) => ReaderObservableEither<R1 & R2, E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any
