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
import { getReaderM } from 'fp-ts/lib/ReaderT'
import { MonadObservable3 } from './MonadObservable'
import * as OBE from './ObservableEither'

const M = getReaderM(OBE.Monad)

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.10
 */
export interface ReaderObservableEither<R, E, A> {
  (r: R): OBE.ObservableEither<E, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.10
 */
export const ask: <R, E>() => ReaderObservableEither<R, E, R> = M.ask

/**
 * @category constructors
 * @since 0.6.10
 */
export const asks: <R, E, A>(f: (r: R) => A) => ReaderObservableEither<R, E, A> = M.asks

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservableEither: <R, E, A>(ma: OBE.ObservableEither<E, A>) => ReaderObservableEither<R, E, A> =
  M.fromM

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromReader: <R, E, A>(ma: R.Reader<R, A>) => ReaderObservableEither<R, E, A> = M.fromReader

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromIO: MonadIO3<URI>['fromIO'] = ma => () => OBE.rightIO(ma)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromTask: MonadTask3<URI>['fromTask'] = ma => () => OBE.fromTask(ma)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservable: MonadObservable3<URI>['fromObservable'] = ma => () => OBE.rightObservable(ma)

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

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @category MonadThrow
 * @since 0.6.10
 */
export const throwError: MonadThrow3<URI>['throwError'] = e => () => OBE.left(e)

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.10
 */
export const map: <A, B>(
  f: (a: A) => B
) => <R, E>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = f => fa => M.map(fa, f)

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.10
 */
export const ap: <R, E, A>(
  fa: ReaderObservableEither<R, E, A>
) => <B>(fab: ReaderObservableEither<R, E, (a: A) => B>) => ReaderObservableEither<R, E, B> = fa => fab => M.ap(fab, fa)

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
export const of: Applicative3<URI>['of'] = M.of

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, B> = (f, g) => fea => r =>
  OBE.bimap(f, g)(fea(r))

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, A> = f => fea => r =>
  OBE.mapLeft(f)(fea(r))

/**
 * @category Monad
 * @since 0.6.10
 */
export const chain: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = f => ma => M.chain(ma, f)

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
  map: M.map
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Apply: Apply3<URI> = {
  URI,
  ap: M.ap,
  map: M.map
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Applicative: Applicative3<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Monad: Monad3<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of,
  chain: M.chain
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
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
  fromIO
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadTask: MonadTask3<URI> = {
  URI,
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable3<URI> = {
  URI,
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
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
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
  throwError
}

/**
 * @category instances
 * @since 0.6.10
 * @deprecated
 */
export const readerObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of,
  chain: M.chain,
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
