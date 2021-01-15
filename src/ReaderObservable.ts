/**
 * @since 0.6.6
 */
import { Alt2 } from 'fp-ts/lib/Alt'
import { Alternative2 } from 'fp-ts/lib/Alternative'
import { Applicative2 } from 'fp-ts/lib/Applicative'
import { Apply2 } from 'fp-ts/lib/Apply'
import { Compactable2 } from 'fp-ts/lib/Compactable'
import * as E from 'fp-ts/lib/Either'
import { Filterable2 } from 'fp-ts/lib/Filterable'
import { identity, Predicate } from 'fp-ts/lib/function'
import { Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { Monad2 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { getMonoid as getReaderMonoid, Reader } from 'fp-ts/lib/Reader'
import { getReaderM } from 'fp-ts/lib/ReaderT'
import { ReaderTask } from 'fp-ts/lib/ReaderTask'
import { Task } from 'fp-ts/lib/Task'
import { Observable } from 'rxjs'
import { MonadObservable2 } from './MonadObservable'
import * as R from './Observable'
import { MonadIO2 } from 'fp-ts/lib/MonadIO'
import { MonadTask2 } from 'fp-ts/lib/MonadTask'

const T = getReaderM(R.Monad)

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
 * @since 0.6.9
 */
export function fromReaderTask<R, A>(ma: ReaderTask<R, A>): ReaderObservable<R, A> {
  return r => R.fromTask(ma(r))
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
 * @since 0.6.12
 */
export const zero: Alternative2<URI>['zero'] = () => R.Alternative.zero

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const alt_: Alt2<URI>['alt'] = (fx, f) => r => R.Alt.alt(fx(r), () => f()(r))
const compact_: Compactable2<URI>['compact'] = fa => filterMap_(fa, identity)
const separate_: Compactable2<URI>['separate'] = fa => partitionMap_(fa, identity)
const filter_: Filterable2<URI>['filter'] = <R, A>(fa: ReaderObservable<R, A>, p: Predicate<A>) =>
  filterMap_(fa, O.fromPredicate(p))
const filterMap_: Filterable2<URI>['filterMap'] = (fa, f) => r => R.Filterable.filterMap(fa(r), f)
const partition_: Filterable2<URI>['partition'] = <R, A>(fa: ReaderObservable<R, A>, p: Predicate<A>) =>
  partitionMap_(fa, E.fromPredicate(p, identity))
const partitionMap_: Filterable2<URI>['partitionMap'] = (fa, f) => ({
  left: filterMap_(fa, a => O.fromEither(E.swap(f(a)))),
  right: filterMap_(fa, a => O.fromEither(f(a)))
})

/**
 * @since 0.6.12
 */
export const Functor: Functor2<URI> = {
  URI,
  map: T.map
}

/**
 * @since 0.6.12
 */
export const Apply: Apply2<URI> = {
  URI,
  map: T.map,
  ap: T.ap
}

/**
 * @since 0.6.12
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of
}

/**
 * @since 0.6.12
 */
export const Monad: Monad2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of,
  chain: T.chain
}

/**
 * @since 0.6.12
 */
export const Alt: Alt2<URI> = {
  URI,
  map: T.map,
  alt: alt_
}

/**
 * @since 0.6.12
 */
export const Alternative: Alternative2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of,
  alt: alt_,
  zero
}

/**
 * @since 0.6.12
 */
export const Compactable: Compactable2<URI> = {
  URI,
  compact: compact_,
  separate: separate_
}

/**
 * @since 0.6.12
 */
export const Filterable: Filterable2<URI> = {
  URI,
  compact: compact_,
  separate: separate_,
  map: T.map,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_
}

/**
 * @since 0.6.12
 */
export const MonadIO: MonadIO2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of,
  chain: T.chain,
  fromIO
}

/**
 * @since 0.6.12
 */
export const MonadTask: MonadTask2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of,
  chain: T.chain,
  fromIO,
  fromTask
}

/**
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of,
  chain: T.chain,
  fromIO,
  fromTask,
  fromObservable
}

/**
 * @since 0.6.6
 * @deprecated
 */
export const readerObservable: Monad2<URI> & Alternative2<URI> & Filterable2<URI> & MonadObservable2<URI> = {
  URI,
  map: T.map,
  of,
  ap: T.ap,
  chain: T.chain,
  zero,
  alt: alt_,
  compact: compact_,
  separate: separate_,
  partitionMap: partitionMap_,
  partition: partition_,
  filterMap: filterMap_,
  filter: filter_,
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
  // tslint:disable-next-line: deprecation
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

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: ReaderObservable<unknown, {}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
export function bindTo<K extends string, R, A>(
  name: K
): (fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in K]: A }> {
  return map(a => ({ [name]: a } as { [P in K]: A }))
}

/**
 * @since 0.6.11
 */
export function bind<K extends string, R, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservable<R, B>
): (fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
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
export const bindW: <K extends string, R2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservable<R2, B>
) => <R1>(
  fa: ReaderObservable<R1, A>
) => ReaderObservable<R1 & R2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any
