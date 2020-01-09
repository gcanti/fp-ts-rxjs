/**
 * @since 0.6.0
 */
import { Alternative1 } from 'fp-ts/lib/Alternative'
import * as E from 'fp-ts/lib/Either'
import { Filterable1 } from 'fp-ts/lib/Filterable'
import { identity, Predicate } from 'fp-ts/lib/function'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { combineLatest, EMPTY, merge, Observable, of } from 'rxjs'
import { map as rxMap, mergeMap } from 'rxjs/operators'

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
 * @since 0.6.0
 */
export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> = {
  URI,
  map: (fa, f) => fa.pipe(rxMap(f)),
  of,
  ap: (fab, fa) => combineLatest([fab, fa]).pipe(rxMap(([f, a]) => f(a))),
  chain: (fa, f) => fa.pipe(mergeMap(f)),
  zero: () => EMPTY,
  alt: (fx, f) => merge(fx, f()),
  compact: fa => observable.filterMap(fa, identity),
  separate: fa => observable.partitionMap(fa, identity),
  partitionMap: (fa, f) => ({
    left: observable.filterMap(fa, a =>
      pipe(
        f(a),
        E.fold(O.some, () => O.none)
      )
    ),
    right: observable.filterMap(fa, a =>
      pipe(
        f(a),
        E.fold(() => O.none, O.some)
      )
    )
  }),
  partition: <A>(fa: Observable<A>, p: Predicate<A>) => observable.partitionMap(fa, E.fromPredicate(p, identity)),
  filterMap: <A, B>(fa: Observable<A>, f: (a: A) => O.Option<B>) =>
    fa.pipe(
      mergeMap(a =>
        pipe(
          f(a),
          // tslint:disable-next-line: deprecation
          O.fold<B, Observable<B>>(() => EMPTY, of)
        )
      )
    ),
  filter: <A>(fa: Observable<A>, p: Predicate<A>) => observable.filterMap(fa, O.fromPredicate(p))
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
