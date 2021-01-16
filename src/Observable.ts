/**
 * @since 0.6.0
 */
import { Alt1 } from 'fp-ts/lib/Alt'
import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Applicative1 } from 'fp-ts/lib/Applicative'
import { Apply1 } from 'fp-ts/lib/Apply'
import { Compactable1, Separated } from 'fp-ts/lib/Compactable'
import * as E from 'fp-ts/lib/Either'
import { Filterable1 } from 'fp-ts/lib/Filterable'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { Functor1 } from 'fp-ts/lib/Functor'
import { Monad1 } from 'fp-ts/lib/Monad'
import { MonadIO1 } from 'fp-ts/lib/MonadIO'
import { MonadTask1 } from 'fp-ts/lib/MonadTask'
import { Monoid } from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Task } from 'fp-ts/lib/Task'
import { combineLatest, defer, EMPTY, merge, Observable, of as rxOf } from 'rxjs'
import { map as rxMap, mergeMap } from 'rxjs/operators'
import { MonadObservable1 } from './MonadObservable'

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.5
 */
export const fromOption = <A>(o: O.Option<A>): Observable<A> => (O.isNone(o) ? EMPTY : of(o.value))

/**
 * @category constructors
 * @since 0.6.5
 */
export const fromIO: MonadIO1<URI>['fromIO'] = ma => defer(() => rxOf(ma()))

/**
 * @category constructors
 * @since 0.6.5
 */
export const fromTask: MonadTask1<URI>['fromTask'] = defer

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Observable<A>) => Observable<B> = f => fa => fa.pipe(rxMap(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.0
 */
export const ap: <A>(fa: Observable<A>) => <B>(fab: Observable<(a: A) => B>) => Observable<B> = fa => fab =>
  combineLatest([fab, fa]).pipe(rxMap(([f, a]) => f(a)))

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.0
 */
export const apFirst: <B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<A> = fb =>
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
 * @since 0.6.0
 */
export const apSecond = <B>(fb: Observable<B>): (<A>(fa: Observable<A>) => Observable<B>) =>
  flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * @category Applicative
 * @since 0.6.6
 */
// tslint:disable-next-line: deprecation
export const of: Applicative1<URI>['of'] = rxOf

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 0.6.0
 */
export const chain: <A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<B> = f => ma =>
  ma.pipe(mergeMap(f))

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.0
 */
export const flatten: <A>(mma: Observable<Observable<A>>) => Observable<A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.0
 */
export const chainFirst: <A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => a)
    )
  )

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 0.6.0
 */
export const alt: <A>(that: () => Observable<A>) => (fa: Observable<A>) => Observable<A> = that => fa =>
  merge(fa, that())

/**
 * @category Filterable
 * @since 0.6.0
 */
export const filterMap = <A, B>(f: (a: A) => O.Option<B>) => (fa: Observable<A>): Observable<B> =>
  fa.pipe(
    mergeMap(a =>
      pipe(
        f(a),
        // tslint:disable-next-line: deprecation
        O.fold<B, Observable<B>>(() => EMPTY, of)
      )
    )
  )

/**
 * @category Compactable
 * @since 0.6.0
 */
export const compact: <A>(fa: Observable<O.Option<A>>) => Observable<A> =
  /*#__PURE__*/
  filterMap(identity)

/**
 * @category Filterable
 * @since 0.6.0
 */
export const partitionMap: <A, B, C>(
  f: (a: A) => E.Either<B, C>
) => (fa: Observable<A>) => Separated<Observable<B>, Observable<C>> = f => fa => ({
  left: pipe(
    fa,
    filterMap(a => O.fromEither(E.swap(f(a))))
  ),
  right: pipe(
    fa,
    filterMap(a => O.fromEither(f(a)))
  )
})

/**
 * @category Compactable
 * @since 0.6.0
 */
export const separate: <A, B>(fa: Observable<E.Either<A, B>>) => Separated<Observable<A>, Observable<B>> =
  /*#__PURE__*/
  partitionMap(identity)

/**
 * @category Filterable
 * @since 0.6.0
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Observable<A>) => Observable<B>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Observable<A>
} = <A>(p: Predicate<A>) => (fa: Observable<A>) => pipe(fa, filterMap(O.fromPredicate(p)))

/**
 * @category Filterable
 * @since 0.6.0
 */
export const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Observable<A>) => Separated<Observable<A>, Observable<B>>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Separated<Observable<A>, Observable<A>>
} = <A>(p: Predicate<A>) => (fa: Observable<A>) => pipe(fa, partitionMap(E.fromPredicate(p, identity)))

/**
 * @category Aletrnaitve
 * @since 0.6.12
 */
export const zero: Alternative1<URI>['zero'] = () => EMPTY

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const map_: Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
const ap_: Apply1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad1<URI>['chain'] = (fa, f) => pipe(fa, chain(f))
/* istanbul ignore next */
const alt_: Alt1<URI>['alt'] = (me, that) => pipe(me, alt(that))
/* istanbul ignore next */
const filter_: Filterable1<URI>['filter'] = <A>(fa: Observable<A>, p: Predicate<A>) => pipe(fa, filter(p))
/* istanbul ignore next */
const filterMap_: Filterable1<URI>['filterMap'] = <A, B>(fa: Observable<A>, f: (a: A) => O.Option<B>) =>
  pipe(fa, filterMap(f))
/* istanbul ignore next */
const partition_: Filterable1<URI>['partition'] = <A>(fa: Observable<A>, p: Predicate<A>) => pipe(fa, partition(p))
/* istanbul ignore next */
const partitionMap_: Filterable1<URI>['partitionMap'] = (fa, f) => pipe(fa, partitionMap(f))

/**
 * @category instances
 * @since 0.6.0
 */
export const URI = 'Observable'

/**
 * @category instances
 * @since 0.6.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Observable<A>
  }
}

/**
 * @category instances
 * @since 0.6.0
 */
export const getMonoid = <A = never>(): Monoid<Observable<A>> => ({
  concat: (x, y) => merge(x, y),
  empty: EMPTY
})

/**
 * @category instances
 * @since 0.6.12
 */
export const Functor: Functor1<URI> = {
  URI,
  map: map_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Apply: Apply1<URI> = {
  URI,
  map: map_,
  ap: ap_
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Applicative: Applicative1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of
}

/**
 * @category instances
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
 * @category instances
 * @since 0.6.12
 */
export const Alt: Alt1<URI> = {
  URI,
  map: map_,
  alt: alt_
}

/**
 * @category instances
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
 * @category instances
 * @since 0.6.12
 */
export const Compactable: Compactable1<URI> = {
  URI,
  compact,
  separate
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Filterable: Filterable1<URI> = {
  URI,
  compact,
  separate,
  map: map_,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_
}

/**
 * @category instances
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
 * @category instances
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
 * @category instances
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
 * @category instances
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
  compact,
  separate,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_,
  fromIO,
  fromTask,
  fromObservable: identity
}

// -------------------------------------------------------------------------------------
// utils
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
export const bindTo = <K extends string, A>(name: K): ((fa: Observable<A>) => Observable<{ [P in K]: A }>) =>
  map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.11
 */
export const bind = <K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => Observable<B>
): ((fa: Observable<A>) => Observable<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )

/**
 * @since 0.6.5
 */
export const toTask = <A>(o: Observable<A>): Task<A> => () => o.toPromise()
