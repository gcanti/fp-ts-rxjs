import * as OBE from './ObservableEither'
import { io as IO, reader as R, task as T } from 'fp-ts'
import { MonadObservable3 } from './MonadObservable'
import { MonadThrow3 } from 'fp-ts/lib/MonadThrow'
import { Bifunctor3 } from 'fp-ts/lib/Bifunctor'
import { getReaderM } from 'fp-ts/lib/ReaderT'
import { pipeable } from 'fp-ts/lib/pipeable'
import { Observable } from 'rxjs'

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

const M = getReaderM(OBE.observableEither)

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
export function alt<R, E, A>(
  that: () => ReaderObservableEither<R, E, A>
): (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> {
  return fa => r => OBE.alt(() => that()(r))(fa(r))
}

/**
 * @since 0.6.10
 */
export function fromIO<R, E, A>(a: IO.IO<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.observableEither.fromIO(a)
}

/**
 * @since 0.6.10
 */
export function fromTask<R, E, A>(a: T.Task<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.observableEither.fromTask(a)
}

/**
 * @since 0.6.10
 */
export function fromObservable<R, E, A>(a: Observable<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.observableEither.fromObservable(a)
}

/**
 * @since 0.6.10
 */
export function throwError<R, E, A>(e: E): ReaderObservableEither<R, E, A> {
  return () => OBE.left<E, A>(e)
}

/**
 * @since 0.6.10
 */
export const ReaderObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of: M.of,
  chain: M.chain,
  fromIO,
  fromObservable,
  fromTask,
  throwError,
  bimap: (fea, f, g) => r => OBE.bimap(f, g)(fea(r)),
  mapLeft: (fea, f) => r => OBE.mapLeft(f)(fea(r))
}

export const {
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
} = pipeable(ReaderObservableEither)
