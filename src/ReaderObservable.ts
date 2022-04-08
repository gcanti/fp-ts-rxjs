/**
 * @since 0.6.6
 */
import type { Alt2 } from 'fp-ts/Alt'
import type { Alternative2 } from 'fp-ts/Alternative'
import type { Applicative2 } from 'fp-ts/Applicative'
import type { Apply2 } from 'fp-ts/Apply'
import type { Compactable2, Separated } from 'fp-ts/Compactable'
import * as E from 'fp-ts/Either'
import type { Filterable2 } from 'fp-ts/Filterable'
import type { Functor2 } from 'fp-ts/Functor'
import type { IO } from 'fp-ts/IO'
import type { Monad2 } from 'fp-ts/Monad'
import type { MonadIO2 } from 'fp-ts/MonadIO'
import type { MonadTask2 } from 'fp-ts/MonadTask'
import type { Monoid } from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import type { ReaderTask } from 'fp-ts/ReaderTask'
import { flow, identity, Predicate, Refinement } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import type { Observable } from 'rxjs'
import type { MonadObservable2 } from './MonadObservable'
import * as T from './Observable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.6
 */
export interface ReaderObservable<R, A> {
    (r: R): Observable<A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.6
 */
export const fromObservable: MonadObservable2<URI>['fromObservable'] = R.of

/**
 * @category constructors
 * @since 0.6.6
 */
export const fromReader: <R, A = never>(ma: R.Reader<R, A>) => ReaderObservable<R, A> = ma => flow(ma, T.of)

/**
 * @category constructors
 * @since 0.6.6
 */
export const fromOption = <R, A>(o: O.Option<A>): ReaderObservable<R, A> => fromObservable(T.fromOption(o))

/**
 * @category constructors
 * @since 0.6.6
 */
export const fromIO: MonadIO2<URI>['fromIO'] =
    /*#__PURE__*/
    flow(T.fromIO, fromObservable)

/**
 * @category constructors
 * @since 0.6.6
 */
export const fromTask: MonadTask2<URI>['fromTask'] =
    /*#__PURE__*/
    flow(T.fromTask, fromObservable)

/**
 * @category constructors
 * @since 0.6.9
 */
export const fromReaderTask = <R, A>(ma: ReaderTask<R, A>): ReaderObservable<R, A> => flow(ma, T.fromTask)

/**
 * @category constructors
 * @since 0.6.6
 */
export const ask: <R>() => ReaderObservable<R, R> = () => T.of

/**
 * @category constructors
 * @since 0.6.6
 */
export const asks: <R, A = never>(f: (r: R) => A) => ReaderObservable<R, A> = f => flow(T.of, T.map(f))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.6.6
 */
export const local: <R2, R1>(f: (f: R2) => R1) => <A>(ma: ReaderObservable<R1, A>) => ReaderObservable<R2, A> = R.local

/**
 * @category combinators
 * @since 0.6.6
 */
export const fromIOK =
    <A extends Array<unknown>, B>(f: (...a: A) => IO<B>): (<R>(...a: A) => ReaderObservable<R, B>) =>
    (...a) =>
        fromIO(f(...a))

/**
 * @category combinators
 * @since 0.6.6
 */
export const chainIOK = <A, B>(f: (a: A) => IO<B>): (<R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B>) =>
    chain(a => fromIOK(f)(a))

/**
 * @category combinators
 * @since 0.6.6
 */
export const fromObservableK =
    <A extends Array<unknown>, B>(f: (...a: A) => Observable<B>): (<R>(...a: A) => ReaderObservable<R, B>) =>
    (...a) =>
        fromObservable(f(...a))

/**
 * @category combinators
 * @since 0.6.6
 */
export const chainTaskK = <A, B>(
    f: (a: A) => Observable<B>
): (<R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B>) => chain(a => fromObservableK(f)(a))

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.6
 */
export const map: <A, B>(f: (a: A) => B) => <R>(fa: ReaderObservable<R, A>) => ReaderObservable<R, B> = f => fa =>
    flow(fa, T.map(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.6
 */
export const ap: <R, A>(
    fa: ReaderObservable<R, A>
) => <B>(fab: ReaderObservable<R, (a: A) => B>) => ReaderObservable<R, B> = fa => fab => r => pipe(fab(r), T.ap(fa(r)))

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.6
 */
export const apFirst: <R, B>(
    fb: ReaderObservable<R, B>
) => <A>(fa: ReaderObservable<R, A>) => ReaderObservable<R, A> = fb =>
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
 * @since 0.6.6
 */
export const apSecond = <R, B>(
    fb: ReaderObservable<R, B>
): (<A>(fa: ReaderObservable<R, A>) => ReaderObservable<R, B>) =>
    flow(
        map(() => (b: B) => b),
        ap(fb)
    )

/**
 * @category Applicative
 * @since 0.6.6
 */
export const of: <R, A>(a: A) => ReaderObservable<R, A> = a => () => T.of(a)

/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 0.6.12
 */
export const chainW =
    <A, R2, B>(f: (a: A) => ReaderObservable<R2, B>) =>
    <R1>(ma: ReaderObservable<R1, A>): ReaderObservable<R1 & R2, B> =>
    r =>
        pipe(
            ma(r),
            T.chain(a => f(a)(r))
        )

/**
 * @category Monad
 * @since 0.6.6
 */
export const chain: <R, A, B>(
    f: (a: A) => ReaderObservable<R, B>
) => (ma: ReaderObservable<R, A>) => ReaderObservable<R, B> = chainW

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.6
 */
export const flatten: <R, A>(mma: ReaderObservable<R, ReaderObservable<R, A>>) => ReaderObservable<R, A> =
    /*#__PURE__*/
    chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.6
 */
export const chainFirst: <R, A, B>(
    f: (a: A) => ReaderObservable<R, B>
) => (ma: ReaderObservable<R, A>) => ReaderObservable<R, A> = f =>
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
 * @since 0.6.7
 */
export const alt: <R, A>(
    that: () => ReaderObservable<R, A>
) => (fa: ReaderObservable<R, A>) => ReaderObservable<R, A> = that => me => r =>
    pipe(
        me(r),
        T.alt(() => that()(r))
    )

/**
 * @since 0.6.12
 */
export const zero: Alternative2<URI>['zero'] = () => T.Alternative.zero

/**
 * @category Filterable
 * @since 0.6.7
 */
export const filterMap: <A, B>(f: (a: A) => O.Option<B>) => <R>(fa: ReaderObservable<R, A>) => ReaderObservable<R, B> =
    f => fa => r =>
        pipe(fa(r), T.filterMap(f))

/**
 * @category Compactable
 * @since 0.6.7
 */
export const compact: <R, A>(fa: ReaderObservable<R, O.Option<A>>) => ReaderObservable<R, A> =
    /*#__PURE__*/
    filterMap(identity)

/**
 * @category Filterable
 * @since 0.6.7
 */
export const partitionMap: <A, B, C>(
    f: (a: A) => E.Either<B, C>
) => <R>(fa: ReaderObservable<R, A>) => Separated<ReaderObservable<R, B>, ReaderObservable<R, C>> = f => fa => ({
    left: pipe(
        fa,
        filterMap(a => O.fromEither(E.swap(f(a))))
    ),
    right: pipe(
        fa,
        filterMap(a => O.fromEither(f(a)))
    ),
})

/**
 * @category Compactable
 * @since 0.6.7
 */
export const separate: <R, A, B>(
    fa: ReaderObservable<R, E.Either<A, B>>
) => Separated<ReaderObservable<R, A>, ReaderObservable<R, B>> =
    /*#__PURE__*/
    partitionMap(identity)

/**
 * @category Filterable
 * @since 0.6.7
 */
export const filter: {
    <A, B extends A>(refinement: Refinement<A, B>): <R>(fa: ReaderObservable<R, A>) => ReaderObservable<R, B>
    <A>(predicate: Predicate<A>): <R>(fa: ReaderObservable<R, A>) => ReaderObservable<R, A>
} = <A>(predicate: Predicate<A>): (<R>(fa: ReaderObservable<R, A>) => ReaderObservable<R, A>) =>
    filterMap(O.fromPredicate(predicate))

/**
 * @category Filterable
 * @since 0.6.7
 */
export const partition: {
    <A, B extends A>(refinement: Refinement<A, B>): <R>(
        fa: ReaderObservable<R, A>
    ) => Separated<ReaderObservable<R, A>, ReaderObservable<R, B>>
    <A>(predicate: Predicate<A>): <R>(
        fa: ReaderObservable<R, A>
    ) => Separated<ReaderObservable<R, A>, ReaderObservable<R, A>>
} = <A>(
    predicate: Predicate<A>
): (<R>(fa: ReaderObservable<R, A>) => Separated<ReaderObservable<R, A>, ReaderObservable<R, A>>) =>
    partitionMap(E.fromPredicate(predicate, identity))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const map_: Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const ap_: Apply2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad2<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const alt_: Alt2<URI>['alt'] = (fx, f) => pipe(fx, alt(f))
/* istanbul ignore next */
const filter_: Filterable2<URI>['filter'] = <R, A>(fa: ReaderObservable<R, A>, p: Predicate<A>) => pipe(fa, filter(p))
/* istanbul ignore next */
const filterMap_: Filterable2<URI>['filterMap'] = (fa, f) => pipe(fa, filterMap(f))
/* istanbul ignore next */
const partition_: Filterable2<URI>['partition'] = <R, A>(fa: ReaderObservable<R, A>, p: Predicate<A>) =>
    pipe(fa, partition(p))
/* istanbul ignore next */
const partitionMap_: Filterable2<URI>['partitionMap'] = (fa, f) => pipe(fa, partitionMap(f))

/**
 * @category instances
 * @since 0.6.6
 */
export const URI = 'ReaderObservable'

/**
 * @category instances
 * @since 0.6.6
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
    interface URItoKind2<E, A> {
        readonly [URI]: ReaderObservable<E, A>
    }
}

/**
 * @category instances
 * @since 0.6.6
 */
export const getMonoid = <R, A>(): Monoid<ReaderObservable<R, A>> => R.getMonoid(T.getMonoid())

/**
 * @category instances
 * @since 0.6.12
 */
export const Functor: Functor2<URI> = {
    URI,
    map: map_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Apply: Apply2<URI> = {
    URI,
    map: map_,
    ap: ap_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Applicative: Applicative2<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Monad: Monad2<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Alt: Alt2<URI> = {
    URI,
    map: map_,
    alt: alt_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Alternative: Alternative2<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    alt: alt_,
    zero,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Compactable: Compactable2<URI> = {
    URI,
    compact,
    separate,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Filterable: Filterable2<URI> = {
    URI,
    compact,
    separate,
    map: map_,
    filter: filter_,
    filterMap: filterMap_,
    partition: partition_,
    partitionMap: partitionMap_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadIO: MonadIO2<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadTask: MonadTask2<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
    fromTask,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable2<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
    fromTask,
    fromObservable,
}

/**
 * @category instances
 * @since 0.6.6
 * @deprecated
 */
export const readerObservable: Monad2<URI> & Alternative2<URI> & Filterable2<URI> & MonadObservable2<URI> = {
    URI,
    map: map_,
    of,
    ap: ap_,
    chain: chain_,
    zero,
    alt: alt_,
    compact,
    separate,
    partitionMap: partitionMap_,
    partition: partition_,
    filterMap: filterMap_,
    filter: filter_,
    fromIO,
    fromTask,
    fromObservable,
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: ReaderObservable<unknown, Record<string, never>> =
    /*#__PURE__*/
    of({})

/**
 * @since 0.6.11
 */
export const bindTo = <K extends string, R, A>(
    name: K
): ((fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in K]: A }>) =>
    map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.11
 */
export const bind = <K extends string, R, A, B>(
    name: Exclude<K, keyof A>,
    f: (a: A) => ReaderObservable<R, B>
): ((fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
    chain(a =>
        pipe(
            f(a),
            map(b => ({ ...a, [name]: b } as any))
        )
    )

/**
 * @since 0.6.12
 */
export const bindW: <K extends string, R2, A, B>(
    name: Exclude<K, keyof A>,
    f: (a: A) => ReaderObservable<R2, B>
) => <R1>(
    fa: ReaderObservable<R1, A>
) => ReaderObservable<R1 & R2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any

/**
 * @since 0.6.6
 */
export const run = <R, A>(ma: ReaderObservable<R, A>, r: R): Promise<A> => T.toTask(ma(r))()

/**
 * @since 0.6.6
 */
export const toReaderTask =
    <R, A>(ma: ReaderObservable<R, A>): ReaderTask<R, A> =>
    r =>
        T.toTask(ma(r))

/**
 * @since 0.6.15
 */
export const toReaderTaskOption =
    <R, A>(ma: ReaderObservable<R, A>): ReaderTask<R, O.Option<A>> =>
    r =>
        T.toTaskOption(ma(r))
