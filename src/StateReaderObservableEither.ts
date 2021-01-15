/**
 * @since 0.6.10
 */
import { either as E, io as IO, task as T } from 'fp-ts'
import { Bifunctor4 } from 'fp-ts/lib/Bifunctor'
import { MonadThrow4 } from 'fp-ts/lib/MonadThrow'
import { pipeable, pipe } from 'fp-ts/lib/pipeable'
import { getStateM } from 'fp-ts/lib/StateT'
import { Observable } from 'rxjs'
import { MonadObservable4 } from './MonadObservable'
import * as OB from './Observable'
import * as ROBE from './ReaderObservableEither'
import { Applicative4 } from 'fp-ts/lib/Applicative'

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

const M = getStateM(ROBE.readerObservableEither)

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

/**
 * @since 0.6.12
 */
export const of: Applicative4<URI>['of'] = M.of

/**
 * @since 0.6.10
 */
export const stateReaderObservableEither: MonadObservable4<URI> & Bifunctor4<URI> & MonadThrow4<URI> = {
  URI,
  ap: M.ap,
  chain: M.chain,
  map: M.map,
  of,
  mapLeft: (fa, f) => s => pipe(fa(s), ROBE.mapLeft(f)),
  bimap: (fea, f, g) => stateReaderObservableEither.mapLeft(M.map(fea, g), f),
  throwError,
  fromIO,
  fromObservable,
  fromTask
}

/**
 * @since 0.6.10
 */
const {
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  filterOrElse,
  flatten,
  fromEither,
  fromOption,
  fromPredicate,
  map,
  mapLeft
} = pipeable(stateReaderObservableEither)

export {
  /**
   * @since 0.6.10
   */
  ap,
  /**
   * @since 0.6.10
   */
  apFirst,
  /**
   * @since 0.6.10
   */
  apSecond,
  /**
   * @since 0.6.10
   */
  bimap,
  /**
   * @since 0.6.10
   */
  chain,
  /**
   * @since 0.6.10
   */
  chainFirst,
  /**
   * @since 0.6.10
   */
  filterOrElse,
  /**
   * @since 0.6.10
   */
  flatten,
  /**
   * @since 0.6.10
   */
  fromEither,
  /**
   * @since 0.6.10
   */
  fromOption,
  /**
   * @since 0.6.10
   */
  fromPredicate,
  /**
   * @since 0.6.10
   */
  map,
  /**
   * @since 0.6.10
   */
  mapLeft
}

// -------------------------------------------------------------------------------------
// do notation
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
