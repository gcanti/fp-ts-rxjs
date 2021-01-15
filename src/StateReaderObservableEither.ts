/**
 * @since 0.6.10
 */
import { Applicative4 } from 'fp-ts/lib/Applicative'
import { Apply4 } from 'fp-ts/lib/Apply'
import { Bifunctor4 } from 'fp-ts/lib/Bifunctor'
import * as E from 'fp-ts/lib/Either'
import { Predicate, Refinement, flow, identity } from 'fp-ts/lib/function'
import { Functor4 } from 'fp-ts/lib/Functor'
import * as IO from 'fp-ts/lib/IO'
import { Monad4 } from 'fp-ts/lib/Monad'
import { MonadIO4 } from 'fp-ts/lib/MonadIO'
import { MonadTask4 } from 'fp-ts/lib/MonadTask'
import { MonadThrow4 } from 'fp-ts/lib/MonadThrow'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { getStateM } from 'fp-ts/lib/StateT'
import * as T from 'fp-ts/lib/Task'
import { Observable } from 'rxjs'
import { MonadObservable4 } from './MonadObservable'
import * as OB from './Observable'
import * as ROBE from './ReaderObservableEither'

/**
 * @since 0.6.10
 */
export const URI = 'StateReaderObservableEither'

/**
 * @since 0.6.10
 */
export type URI = typeof URI

/**
 * @since 0.6.10
 */
export interface StateReaderObservableEither<S, R, E, A> {
  (s: S): ROBE.ReaderObservableEither<R, E, [A, S]>
}

declare module 'fp-ts/lib/HKT' {
  export interface URItoKind4<S, R, E, A> {
    readonly [URI]: StateReaderObservableEither<S, R, E, A>
  }
}

const M = getStateM(ROBE.Monad)

/**
 * @since 0.6.10
 */

/**
 * @since 0.6.10
 */
export function evaluate<S>(
  s: S
): <R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => ROBE.ReaderObservableEither<R, E, A> {
  return fa => M.evalState(fa, s)
}

/**
 * @since 0.6.10
 */
export function execute<S>(
  s: S
): <R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => ROBE.ReaderObservableEither<R, E, S> {
  return fa => M.execState(fa, s)
}

/**
 * @since 0.6.10
 */
export const fromReaderObservableEither: <S, R, E, A>(
  ma: ROBE.ReaderObservableEither<R, E, A>
) => StateReaderObservableEither<S, R, E, A> = M.fromM

/**
 * @since 0.6.10
 */
export const get: <R, E, S>() => StateReaderObservableEither<S, R, E, S> = M.get

/**
 * @since 0.6.10
 */
export const gets: <S, R, E, A>(f: (s: S) => A) => StateReaderObservableEither<S, R, E, A> = M.gets

/**
 * @since 0.6.10
 */
export const modify: <R, E, S>(f: (s: S) => S) => StateReaderObservableEither<S, R, E, void> = M.modify

/**
 * @since 0.6.10
 */
export const put: <R, E, S>(s: S) => StateReaderObservableEither<S, R, E, void> = M.put

/**
 * @since 0.6.10
 */
export const right: <S, R, E = never, A = never>(a: A) => StateReaderObservableEither<S, R, E, A> = M.of

/**
 * @since 0.6.10
 */
export const left: <S, R, E = never, A = never>(e: E) => StateReaderObservableEither<S, R, E, A> = throwError

/**
 * @since 0.6.10
 */
export function throwError<S, R, E, A>(e: E): StateReaderObservableEither<S, R, E, A> {
  return () => ROBE.throwError(e)
}

/**
 * @since 0.6.10
 */
export function fromIO<S, R, E, A>(io: IO.IO<A>): StateReaderObservableEither<S, R, E, A> {
  return fromObservable(OB.fromIO(io))
}

/**
 * @since 0.6.10
 */
export function fromTask<S, R, E, A>(task: T.Task<A>): StateReaderObservableEither<S, R, E, A> {
  return fromObservable(OB.fromTask(task))
}

/**
 * @since 0.6.10
 */
export function fromObservable<S, R, E, A>(observable: Observable<A>): StateReaderObservableEither<S, R, E, A> {
  return s => () =>
    pipe(
      observable,
      OB.map(a => E.right([a, s]))
    )
}

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.10
 */
export const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B> = f => fa =>
  M.map(fa, f)

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
) => StateReaderObservableEither<S, R, E, B> = fa => fab => M.ap(fab, fa)

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
  pipe(M.map(fea, g), mapLeft(f))

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, A> = f => fea =>
  flow(fea, ROBE.mapLeft(f))

/**
 * @category Monad
 * @since 0.6.10
 */
export const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B> = f => ma =>
  M.chain(ma, f)

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
export const of: Applicative4<URI>['of'] = M.of

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const bimap_: Bifunctor4<URI>['bimap'] = (fea, f, g) => pipe(fea, bimap(f, g))
/* istanbul ignore next */
const mapLeft_: Bifunctor4<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))

/**
 * @since 0.6.12
 */
export const Functor: Functor4<URI> = {
  URI,
  map: M.map
}

/**
 * @since 0.6.12
 */
export const Apply: Apply4<URI> = {
  URI,
  ap: M.ap,
  map: M.map
}

/**
 * @since 0.6.12
 */
export const Applicative: Applicative4<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of
}

/**
 * @since 0.6.12
 */
export const Monad: Monad4<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of,
  chain: M.chain
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
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
  fromIO
}

/**
 * @since 0.6.12
 */
export const MonadTask: MonadTask4<URI> = {
  URI,
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
  fromIO,
  fromTask
}

/**
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable4<URI> = {
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
 * @since 0.6.12
 */
export const MonadThrow: MonadThrow4<URI> = {
  URI,
  map: M.map,
  of,
  ap: M.ap,
  chain: M.chain,
  throwError
}

/**
 * @since 0.6.10
 * @deprecated
 */
export const stateReaderObservableEither: MonadObservable4<URI> & Bifunctor4<URI> & MonadThrow4<URI> = {
  URI,
  ap: M.ap,
  chain: M.chain,
  map: M.map,
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
export function bindTo<K extends string>(
  name: K
): <S, R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, { [P in K]: A }> {
  return fa =>
    pipe(
      fa,
      map(value => ({ [name]: value } as any))
    )
}

/**
 * @since 0.6.11
 */
export function bind<K extends string, S, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
): (
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
  return chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )
}

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
