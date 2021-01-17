/**
 * @since 0.6.10
 */
import { Applicative4 } from 'fp-ts/lib/Applicative'
import { Apply4 } from 'fp-ts/lib/Apply'
import { Bifunctor4 } from 'fp-ts/lib/Bifunctor'
import * as E from 'fp-ts/lib/Either'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { Functor4 } from 'fp-ts/lib/Functor'
import { Monad4 } from 'fp-ts/lib/Monad'
import { MonadIO4 } from 'fp-ts/lib/MonadIO'
import { MonadTask4 } from 'fp-ts/lib/MonadTask'
import { MonadThrow4 } from 'fp-ts/lib/MonadThrow'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { MonadObservable4 } from './MonadObservable'
import * as OB from './Observable'
import * as ROE from './ReaderObservableEither'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.10
 */
export interface StateReaderObservableEither<S, R, E, A> {
  (s: S): ROE.ReaderObservableEither<R, E, [A, S]>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromReaderObservableEither: <S, R, E, A>(
  ma: ROE.ReaderObservableEither<R, E, A>
) => StateReaderObservableEither<S, R, E, A> = fa => s =>
  pipe(
    fa,
    ROE.map(a => [a, s])
  )

/**
 * @category constructors
 * @since 0.6.10
 */
export const get: <R, E, S>() => StateReaderObservableEither<S, R, E, S> = () => s => ROE.right([s, s])

/**
 * @category constructors
 * @since 0.6.10
 */
export const gets: <S, R, E, A>(f: (s: S) => A) => StateReaderObservableEither<S, R, E, A> = f => s =>
  ROE.right([f(s), s])

/**
 * @category constructors
 * @since 0.6.10
 */
export const modify: <R, E, S>(f: (s: S) => S) => StateReaderObservableEither<S, R, E, void> = f => s =>
  ROE.right([undefined, f(s)])

/**
 * @category constructors
 * @since 0.6.10
 */
export const put: <R, E, S>(s: S) => StateReaderObservableEither<S, R, E, void> = s => () => ROE.right([undefined, s])

/**
 * @category constructors
 * @since 0.6.10
 */
export const right: <S, R, E = never, A = never>(a: A) => StateReaderObservableEither<S, R, E, A> = a => s =>
  ROE.right([a, s])

/**
 * @category constructors
 * @since 0.6.10
 */
export const left: <S, R, E = never, A = never>(e: E) => StateReaderObservableEither<S, R, E, A> = e => () =>
  ROE.left(e)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromIO: MonadIO4<URI>['fromIO'] = ma => fromObservable(OB.fromIO(ma))

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromTask: MonadTask4<URI>['fromTask'] = ma => fromObservable(OB.fromTask(ma))

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservable: MonadObservable4<URI>['fromObservable'] = ma => s => () =>
  pipe(
    ma,
    OB.map(a => E.right([a, s]))
  )

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

const map_: Functor4<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const ap_: Apply4<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad4<URI>['chain'] = (ma, f) => pipe(ma, chain(f))

/**
 * @category MonadThrow
 * @since 0.6.10
 */
export const throwError: MonadThrow4<URI>['throwError'] = left

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.10
 */
export const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, B> = f => fa => s1 =>
  pipe(
    fa(s1),
    ROE.map(([a, s2]) => [f(a), s2])
  )

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.10
 */
export const ap: <S, R, E, A>(
  fa: StateReaderObservableEither<S, R, E, A>
) => <B>(
  fab: StateReaderObservableEither<S, R, E, (a: A) => B>
) => StateReaderObservableEither<S, R, E, B> = fa => fab => s1 =>
  pipe(
    fab(s1),
    ROE.chain(([f, s2]) =>
      pipe(
        fa(s2),
        ROE.map(([a, s3]) => [f(a), s3])
      )
    )
  )

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const apFirst: <S, R, E, B>(
  fb: StateReaderObservableEither<S, R, E, B>
) => <A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A> = fb =>
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
export const apSecond = <S, R, E, B>(
  fb: StateReaderObservableEither<S, R, E, B>
): (<A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>) =>
  flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <S, R>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, B> = (f, g) => fea =>
  pipe(map_(fea, g), mapLeft(f))

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, A> = f => fea =>
  flow(fea, ROE.mapLeft(f))


/**
 * @category Monad
 * @since 0.6.10
 */
export const chainW = <S, R, E2, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E2, B>
) => <E1>(ma: StateReaderObservableEither<S, R, E1, A>): StateReaderObservableEither<S, R, E1 | E2, B> => s1 =>
  pipe(
    ma(s1),
    ROE.chain<R, E1 | E2, [A, S], [B, S]>(([a, s2]) => f(a)(s2))
  )

/**
 * @category Monad
 * @since 0.6.10
 */
export const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B> = f => chainW(f)

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const flatten: <S, R, E, A>(
  mma: StateReaderObservableEither<S, R, E, StateReaderObservableEither<S, R, E, A>>
) => StateReaderObservableEither<S, R, E, A> =
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
export const chainFirst: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A> = f =>
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
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderObservableEither<S, R, E, A>
  ) => StateReaderObservableEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderObservableEither<S, R, E, A>
  ) => StateReaderObservableEither<S, R, E, A>
} = <E, A>(
  predicate: Predicate<A>,
  onFalse: (a: A) => E
): (<S, R>(ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>) =>
  chain(a => (predicate(a) ? of(a) : throwError(onFalse(a))))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromEither: <S, R, E, A>(ma: E.Either<E, A>) => StateReaderObservableEither<S, R, E, A> = ma =>
  ma._tag === 'Left' ? throwError(ma.left) : of(ma.right)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromOption = <E>(onNone: () => E) => <S, R, A>(ma: Option<A>): StateReaderObservableEither<S, R, E, A> =>
  ma._tag === 'None' ? throwError(onNone()) : of(ma.value)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    a: A
  ) => StateReaderObservableEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderObservableEither<S, R, E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => <S, R>(a: A): StateReaderObservableEither<S, R, E, A> =>
  predicate(a) ? of(a) : throwError(onFalse(a))

/**
 * @since 0.6.12
 */
export const of: Applicative4<URI>['of'] = right

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const bimap_: Bifunctor4<URI>['bimap'] = (fea, f, g) => pipe(fea, bimap(f, g))
/* istanbul ignore next */
const mapLeft_: Bifunctor4<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))

/**
 * @since 0.6.10
 */
export const URI = 'StateReaderObservableEither'

/**
 * @since 0.6.10
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  export interface URItoKind4<S, R, E, A> {
    readonly [URI]: StateReaderObservableEither<S, R, E, A>
  }
}

/**
 * @since 0.6.12
 */
export const Functor: Functor4<URI> = {
  URI,
  map: map_
}

/**
 * @since 0.6.12
 */
export const Apply: Apply4<URI> = {
  URI,
  map: map_,
  ap: ap_
}

/**
 * @since 0.6.12
 */
export const Applicative: Applicative4<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of
}

/**
 * @since 0.6.12
 */
export const Monad: Monad4<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_
}

/**
 * @since 0.6.12
 */
export const Bifunctor: Bifunctor4<URI> = {
  URI,
  bimap: bimap_,
  mapLeft: mapLeft_
}

/**
 * @since 0.6.12
 */
export const MonadIO: MonadIO4<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  fromIO
}

/**
 * @since 0.6.12
 */
export const MonadTask: MonadTask4<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  fromIO,
  fromTask
}

/**
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable4<URI> = {
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
 * @since 0.6.12
 */
export const MonadThrow: MonadThrow4<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  throwError
}

/**
 * @since 0.6.10
 * @deprecated
 */
export const stateReaderObservableEither: MonadObservable4<URI> & Bifunctor4<URI> & MonadThrow4<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  map: map_,
  of,
  mapLeft: mapLeft_,
  bimap: bimap_,
  throwError,
  fromIO,
  fromObservable,
  fromTask
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.11
 */
export const bindTo = <K extends string>(name: K) => <S, R, E, A>(
  fa: StateReaderObservableEither<S, R, E, A>
): StateReaderObservableEither<S, R, E, { [P in K]: A }> =>
  pipe(
    fa,
    map(value => ({ [name]: value } as any))
  )

/**
 * @since 0.6.11
 */
export const bind = <K extends string, S, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
): ((
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )

/**
 * @since 0.6.12
 */
export const bindW: <K extends string, S, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderObservableEither<S, R1, E1, A>
) => StateReaderObservableEither<
  S,
  R1 & R2,
  E1 | E2,
  { [P in keyof A | K]: P extends keyof A ? A[P] : B }
> = bind as any

/**
 * @since 0.6.10
 */
export const evaluate = <S>(s: S) => <R, E, A>(
  ma: StateReaderObservableEither<S, R, E, A>
): ROE.ReaderObservableEither<R, E, A> =>
  pipe(
    ma(s),
    ROE.map(([a]) => a)
  )

/**
 * @since 0.6.10
 */
export const execute = <S>(s: S) => <R, E, A>(
  ma: StateReaderObservableEither<S, R, E, A>
): ROE.ReaderObservableEither<R, E, S> =>
  pipe(
    ma(s),
    ROE.map(([_, s]) => s)
  )
