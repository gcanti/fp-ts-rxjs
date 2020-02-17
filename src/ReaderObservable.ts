/**
 * @since 0.6.6
 */
import { Observable } from 'rxjs'
import { getReaderM } from 'fp-ts/lib/ReaderT'
import * as R from './Observable'
import { pipeable, pipe } from 'fp-ts/lib/pipeable'
import { IO } from 'fp-ts/lib/IO'
import { Monad2 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import { getMonoid as getReaderMonoid, Reader } from 'fp-ts/lib/Reader'
import { Task } from 'fp-ts/lib/Task'
import { MonadObservable2 } from './MonadObservable'
import { ReaderTask } from 'fp-ts/lib/ReaderTask'
import { Alternative2 } from 'fp-ts/lib/Alternative'
import { Filterable2 } from 'fp-ts/lib/Filterable'
import { identity, Predicate } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'

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
export function fromOption<R, A>(o: O.Option<A>): ReaderObservable<R, A> {
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
export function toReaderTask<R, A>(ma: ReaderObservable<R, A>): ReaderTask<R, A> {
  return r => () => run(ma, r)
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
 * @since 0.6.6
 */
export function fromIOK<A extends Array<unknown>, B>(f: (...a: A) => IO<B>): <R>(...a: A) => ReaderObservable<R, B> {
  return (...a) => fromIO(f(...a))
}

/**
 * @since 0.6.6
 */
export function chainIOK<A, B>(f: (a: A) => IO<B>): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> {
  return chain<any, A, B>(fromIOK(f))
}

/**
 * @since 0.6.6
 */
export function fromObservableK<A extends Array<unknown>, B>(
  f: (...a: A) => Observable<B>
): <R>(...a: A) => ReaderObservable<R, B> {
  return (...a) => fromObservable(f(...a))
}

/**
 * @since 0.6.6
 */
export function chainTaskK<A, B>(
  f: (a: A) => Observable<B>
): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> {
  return chain<any, A, B>(fromObservableK(f))
}

/**
 * @since 0.6.6
 */

export const readerObservable: Monad2<URI> & Alternative2<URI> & Filterable2<URI> & MonadObservable2<URI> = {
  URI,
  map: T.map,
  of,
  ap: T.ap,
  chain: T.chain,
  zero: () => R.observable.zero,
  alt: (fx, f) => r => R.observable.alt(fx(r), () => f()(r)),
  compact: fa => readerObservable.filterMap(fa, identity),
  separate: fa => readerObservable.partitionMap(fa, identity),
  partitionMap: (fa, f) => ({
    left: readerObservable.filterMap(fa, a =>
      pipe(
        f(a),
        E.fold(O.some, () => O.none)
      )
    ),
    right: readerObservable.filterMap(fa, a =>
      pipe(
        f(a),
        E.fold(() => O.none, O.some)
      )
    )
  }),
  partition: <R, A>(fa: ReaderObservable<R, A>, p: Predicate<A>) =>
    readerObservable.partitionMap(fa, E.fromPredicate(p, identity)),
  filterMap: (fa, f) => r => R.observable.filterMap(fa(r), f),
  filter: <R, A>(fa: ReaderObservable<R, A>, p: Predicate<A>) => readerObservable.filterMap(fa, O.fromPredicate(p)),
  fromIO,
  fromTask,
  fromObservable
}

const {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  flatten,
  map,
  alt,
  compact,
  filter,
  filterMap,
  partition,
  partitionMap,
  separate
} = pipeable(readerObservable)

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
  map,
  /**
   * @since 0.6.7
   */
  alt,
  /**
   * @since 0.6.7
   */
  compact,
  /**
   * @since 0.6.7
   */
  filter,
  /**
   * @since 0.6.7
   */
  filterMap,
  /**
   * @since 0.6.7
   */
  partition,
  /**
   * @since 0.6.7
   */
  partitionMap,
  /**
   * @since 0.6.7
   */
  separate
}
