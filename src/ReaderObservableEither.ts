/**
 * @since 0.6.10
 */
import * as IO from 'fp-ts/lib/IO'
import * as R from 'fp-ts/lib/Reader'
import * as T from 'fp-ts/lib/Task'
import { Applicative3 } from 'fp-ts/lib/Applicative'
import { Apply3 } from 'fp-ts/lib/Apply'
import { Bifunctor3 } from 'fp-ts/lib/Bifunctor'
import { Functor3 } from 'fp-ts/lib/Functor'
import { Monad3 } from 'fp-ts/lib/Monad'
import { MonadThrow3 } from 'fp-ts/lib/MonadThrow'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { getReaderM } from 'fp-ts/lib/ReaderT'
import { Observable } from 'rxjs'
import { MonadObservable3 } from './MonadObservable'
import * as OBE from './ObservableEither'
import { MonadIO3 } from 'fp-ts/lib/MonadIO'
import { MonadTask3 } from 'fp-ts/lib/MonadTask'

/**
 * @since 0.6.10
 */
export const URI = 'ReaderObservableEither'

/**
 * @since 0.6.10
 */
export type URI = typeof URI

/**
 * @since 0.6.10
 */
export interface ReaderObservableEither<R, E, A> {
  (r: R): OBE.ObservableEither<E, A>
}

declare module 'fp-ts/lib/HKT' {
  export interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderObservableEither<R, E, A>
  }
}

const M = getReaderM(OBE.Monad)

/**
 * @since 0.6.10
 */
export function ask<R, E>(): ReaderObservableEither<R, E, R> {
  return M.ask<R, E>()
}

/**
 * @since 0.6.10
 */
export function asks<R, E, A>(f: (r: R) => A): ReaderObservableEither<R, E, A> {
  return M.asks<R, E, A>(f)
}

/**
 * @since 0.6.10
 */
export function fromObservableEither<R, E, A>(ma: OBE.ObservableEither<E, A>): ReaderObservableEither<R, E, A> {
  return M.fromM(ma)
}

/**
 * @since 0.6.10
 */
export function fromReader<R, E, A>(ma: R.Reader<R, A>): ReaderObservableEither<R, E, A> {
  return M.fromReader(ma)
}

/**
 * @since 0.6.10
 */
export function local<R, Q>(
  f: (d: Q) => R
): <E, A>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<Q, E, A> {
  return ma => M.local(ma, f)
}

/**
 * @since 0.6.10
 */
export function of<R, E, A>(a: A): ReaderObservableEither<R, E, A> {
  return M.of(a)
}

/**
 * @since 0.6.10
 */
export function fromIO<R, E, A>(a: IO.IO<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.rightIO(a)
}

/**
 * @since 0.6.10
 */
export function fromTask<R, E, A>(a: T.Task<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.fromTask(a)
}

/**
 * @since 0.6.10
 */
export function fromObservable<R, E, A>(a: Observable<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.rightObservable(a)
}

/**
 * @since 0.6.10
 */
export function throwError<R, E, A>(e: E): ReaderObservableEither<R, E, A> {
  return () => OBE.left<E, A>(e)
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const bimap_: Bifunctor3<URI>['bimap'] = (fea, f, g) => r => OBE.bimap(f, g)(fea(r))
const mapLeft_: Bifunctor3<URI>['mapLeft'] = (fea, f) => r => OBE.mapLeft(f)(fea(r))

/**
 * @since 0.6.12
 */
export const Functor: Functor3<URI> = {
  URI,
  map: M.map
}

/**
 * @since 0.6.12
 */
export const Apply: Apply3<URI> = {
  URI,
  ap: M.ap,
  map: M.map
}

/**
 * @since 0.6.12
 */
export const Applicative: Applicative3<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of
}

/**
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
 * @since 0.6.12
 */
export const Bifunctor: Bifunctor3<URI> = {
  URI,
  bimap: bimap_,
  mapLeft: mapLeft_
}

/**
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
  // tslint:disable-next-line: deprecation
} = pipeable(readerObservableEither)

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
 * @since 0.6.12
 */
export const Do: ReaderObservableEither<unknown, never, {}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
export function bindTo<K extends string, R, E, A>(
  name: K
): (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }> {
  return map(a => ({ [name]: a } as { [P in K]: A }))
}

/**
 * @since 0.6.11
 */
export function bind<K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
): (
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
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
export const bindW: <K extends string, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderObservableEither<R1, E1, A>
) => ReaderObservableEither<R1 & R2, E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any
