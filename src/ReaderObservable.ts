/**
 * @since 0.6.6
 */
import { Observable } from 'rxjs'
import { getReaderM } from 'fp-ts/lib/ReaderT'
import * as R from './Observable'
import { pipeable } from 'fp-ts/lib/pipeable'
import { IO } from 'fp-ts/lib/IO'
import { Monad2 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import { getMonoid as getReaderMonoid, Reader } from 'fp-ts/lib/Reader'
import { Task } from 'fp-ts/lib/Task'
import { MonadObservable2 } from './MonadObservable'
import { Option } from 'fp-ts/lib/Option'

const T = getReaderM(R.observable)

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    ReaderObservable: ReaderObservable<E, A>
  }
}

/**
 * @since 0.6.6
 */
export const URI = 'ReaderObservable'

/**
 * @since 0.6.6
 */
export type URI = typeof URI

/**
 * @since 0.6.6
 */
export interface ReaderObservable<R, A> {
  (r: R): Observable<A>
}

/**
 * @since 0.6.6
 */
export function run<R, A>(ma: ReaderObservable<R, A>, r: R): Promise<A> {
  return ma(r).toPromise()
}

/**
 * @since 0.6.6
 */
export const fromObservable: <R, A>(ma: Observable<A>) => ReaderObservable<R, A> = T.fromM

/**
 * @since 0.6.6
 */
export const fromReader: <R, A = never>(ma: Reader<R, A>) => ReaderObservable<R, A> = T.fromReader

/**
 * @since 0.6.6
 */
export function fromOption<R, A>(o: Option<A>): ReaderObservable<R, A> {
  return fromObservable(R.fromOption(o))
}

/**
 * @since 0.6.6
 */
export function fromIO<R, A>(ma: IO<A>): ReaderObservable<R, A> {
  return fromObservable(R.fromIO(ma))
}

/**
 * @since 0.6.6
 */
export function fromTask<R, A>(ma: Task<A>): ReaderObservable<R, A> {
  return fromObservable(R.fromTask(ma))
}

/**
 * @since 0.6.6
 */
export const of: <R, A>(a: A) => ReaderObservable<R, A> = T.of

/**
 * @since 0.6.6
 */
export function getMonoid<R, A>(): Monoid<ReaderObservable<R, A>> {
  return getReaderMonoid(R.getMonoid())
}

/**
 * @since 0.6.6
 */
export const ask: <R>() => ReaderObservable<R, R> = T.ask

/**
 * @since 0.6.6
 */
export const asks: <R, A = never>(f: (r: R) => A) => ReaderObservable<R, A> = T.asks

/**
 * @since 0.6.6
 */
export function local<Q, R>(f: (f: Q) => R): <A>(ma: ReaderObservable<R, A>) => ReaderObservable<Q, A> {
  return ma => T.local(ma, f)
}

/**
 * @since 2.4.0
 */
export function fromIOK<A extends Array<unknown>, B>(f: (...a: A) => IO<B>): <R>(...a: A) => ReaderObservable<R, B> {
  return (...a) => fromIO(f(...a))
}

/**
 * @since 2.4.0
 */
export function chainIOK<A, B>(f: (a: A) => IO<B>): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> {
  return chain<any, A, B>(fromIOK(f))
}

/**
 * @since 2.4.0
 */
export function fromObservableK<A extends Array<unknown>, B>(
  f: (...a: A) => Observable<B>
): <R>(...a: A) => ReaderObservable<R, B> {
  return (...a) => fromObservable(f(...a))
}

/**
 * @since 2.4.0
 */
export function chainTaskK<A, B>(
  f: (a: A) => Observable<B>
): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> {
  return chain<any, A, B>(fromObservableK(f))
}

/**
 * @since 0.6.6
 */

export const readerObservable: Monad2<URI> & MonadObservable2<URI> = {
  URI,
  map: T.map,
  of,
  ap: T.ap,
  chain: T.chain,
  fromIO,
  fromTask,
  fromObservable
}

const { ap, apFirst, apSecond, chain, chainFirst, flatten, map } = pipeable(readerObservable)

export {
  /**
   * @since 0.6.6
   */
  ap,
  /**
   * @since 0.6.6
   */
  apFirst,
  /**
   * @since 0.6.6
   */
  apSecond,
  /**
   * @since 0.6.6
   */
  chain,
  /**
   * @since 0.6.6
   */
  chainFirst,
  /**
   * @since 0.6.6
   */
  flatten,
  /**
   * @since 0.6.6
   */
  map
}
