/**
 * @since 0.6.0
 */
import { Alt1 } from 'fp-ts/lib/Alt'
import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Applicative1 } from 'fp-ts/lib/Applicative'
import { Apply1 } from 'fp-ts/lib/Apply'
import { Compactable1 } from 'fp-ts/lib/Compactable'
import * as E from 'fp-ts/lib/Either'
import { Filterable1 } from 'fp-ts/lib/Filterable'
import { identity, Predicate } from 'fp-ts/lib/function'
import { Functor1 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { Task } from 'fp-ts/lib/Task'
import { combineLatest, defer, EMPTY, merge, Observable, of as rxOf } from 'rxjs'
import { map as rxMap, mergeMap } from 'rxjs/operators'
import { MonadObservable1 } from './MonadObservable'
import { MonadIO1 } from 'fp-ts/lib/MonadIO'
import { MonadTask1 } from 'fp-ts/lib/MonadTask'

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    Observable: Observable<A>
  }
}

/**
 * @since 0.6.0
 */
export const URI = 'Observable'

/**
 * @since 0.6.0
 */
export type URI = typeof URI

/**
 * @since 0.6.0
 */
export function getMonoid<A = never>(): Monoid<Observable<A>> {
  return {
    concat: (x, y) => merge(x, y),
    empty: EMPTY
  }
}

/**
 * @since 0.6.6
 */
// tslint:disable-next-line: deprecation
export const of: Applicative1<URI>['of'] = rxOf

/**
 * @since 0.6.5
 */
export function fromOption<A>(o: O.Option<A>): Observable<A> {
  return O.isNone(o) ? EMPTY : of(o.value)
}

/**
 * @since 0.6.5
 */
export function fromIO<A>(io: IO<A>): Observable<A> {
  return defer(() => rxOf(io()))
}

/**
 * @since 0.6.5
 */
export function fromTask<A>(t: Task<A>): Observable<A> {
  return defer(t)
}

/**
 * @since 0.6.5
 */
export function toTask<A>(o: Observable<A>): Task<A> {
  return () => o.toPromise()
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const map_: Functor1<URI>['map'] = (fa, f) => fa.pipe(rxMap(f))
const ap_: Apply1<URI>['ap'] = (fab, fa) => combineLatest([fab, fa]).pipe(rxMap(([f, a]) => f(a)))
const chain_: Monad1<URI>['chain'] = (fa, f) => fa.pipe(mergeMap(f))
const alt_: Alt1<URI>['alt'] = (fx, f) => merge(fx, f())
const compact_: Compactable1<URI>['compact'] = fa => filterMap_(fa, identity)
const separate_: Compactable1<URI>['separate'] = fa => partitionMap_(fa, identity)
const filter_: Filterable1<URI>['filter'] = <A>(fa: Observable<A>, p: Predicate<A>) =>
  filterMap_(fa, O.fromPredicate(p))
const filterMap_: Filterable1<URI>['filterMap'] = <A, B>(fa: Observable<A>, f: (a: A) => O.Option<B>) =>
  fa.pipe(
    mergeMap(a =>
      pipe(
        f(a),
        // tslint:disable-next-line: deprecation
        O.fold<B, Observable<B>>(() => EMPTY, of)
      )
    )
  )
const partition_: Filterable1<URI>['partition'] = <A>(fa: Observable<A>, p: Predicate<A>) =>
  partitionMap_(fa, E.fromPredicate(p, identity))
const partitionMap_: Filterable1<URI>['partitionMap'] = (fa, f) => ({
  left: filterMap_(fa, a => O.fromEither(E.swap(f(a)))),
  right: filterMap_(fa, a => O.fromEither(f(a)))
})

/**
 * @since 0.6.12
 */
export const zero: Alternative1<URI>['zero'] = () => EMPTY

/**
 * @since 0.6.12
 */
export const Functor: Functor1<URI> = {
  URI,
  map: map_
}

/**
 * @since 0.6.12
 */
export const Apply: Apply1<URI> = {
  URI,
  map: map_,
  ap: ap_
}

/**
 * @since 0.6.12
 */
export const Applicative: Applicative1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of
}

/**
 * @since 0.6.12
 */
export const Monad: Monad1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_
}

/**
 * @since 0.6.12
 */
export const Alt: Alt1<URI> = {
  URI,
  map: map_,
  alt: alt_
}

/**
 * @since 0.6.12
 */
export const Alternative: Alternative1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  alt: alt_,
  zero
}

/**
 * @since 0.6.12
 */
export const Compactable: Compactable1<URI> = {
  URI,
  compact: compact_,
  separate: separate_
}

/**
 * @since 0.6.12
 */
export const Filterable: Filterable1<URI> = {
  URI,
  compact: compact_,
  separate: separate_,
  map: map_,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_
}

/**
 * @since 0.6.12
 */
export const MonadIO: MonadIO1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO
}

/**
 * @since 0.6.12
 */
export const MonadTask: MonadTask1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO,
  fromTask
}

/**
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO,
  fromTask,
  fromObservable: identity
}

/**
 * @since 0.6.0
 * @deprecated
 */
export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> & MonadObservable1<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  zero,
  alt: alt_,
  compact: compact_,
  separate: separate_,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_,
  fromIO,
  fromTask,
  fromObservable: identity
}

const {
  alt,
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  compact,
  filter,
  filterMap,
  flatten,
  map,
  partition,
  partitionMap,
  separate
  // tslint:disable-next-line: deprecation
} = pipeable(observable)

export {
  /**
   * @since 0.6.0
   */
  alt,
  /**
   * @since 0.6.0
   */
  ap,
  /**
   * @since 0.6.0
   */
  apFirst,
  /**
   * @since 0.6.0
   */
  apSecond,
  /**
   * @since 0.6.0
   */
  chain,
  /**
   * @since 0.6.0
   */
  chainFirst,
  /**
   * @since 0.6.0
   */
  compact,
  /**
   * @since 0.6.0
   */
  filter,
  /**
   * @since 0.6.0
   */
  filterMap,
  /**
   * @since 0.6.0
   */
  flatten,
  /**
   * @since 0.6.0
   */
  map,
  /**
   * @since 0.6.0
   */
  partition,
  /**
   * @since 0.6.0
   */
  partitionMap,
  /**
   * @since 0.6.0
   */
  separate
}

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: Observable<{}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
export function bindTo<K extends string, A>(name: K): (fa: Observable<A>) => Observable<{ [P in K]: A }> {
  return map(a => ({ [name]: a } as { [P in K]: A }))
}

/**
 * @since 0.6.11
 */
export function bind<K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => Observable<B>
): (fa: Observable<A>) => Observable<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
  return chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )
}
