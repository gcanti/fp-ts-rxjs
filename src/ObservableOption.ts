/**
 * @since 0.6.14
 */
import { Alt1 } from 'fp-ts/Alt'
import { Applicative1 } from 'fp-ts/Applicative'
import { Apply1 } from 'fp-ts/Apply'
import { Functor1 } from 'fp-ts/Functor'
import { IO } from 'fp-ts/IO'
import { Monad1 } from 'fp-ts/Monad'
import { MonadIO1 } from 'fp-ts/MonadIO'
import { MonadTask1 } from 'fp-ts/MonadTask'
import * as O from 'fp-ts/Option'
import { flow, identity, Predicate, Refinement } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { MonadObservable1 } from './MonadObservable'
import * as R from './Observable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.14
 */
export interface ObservableOption<A> extends Observable<O.Option<A>> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.14
 */
export const none: ObservableOption<never> =
    /*#__PURE__*/
    pipe(O.none, R.of)

/**
 * @category constructors
 * @since 0.6.14
 */
export const some: <A>(a: A) => ObservableOption<A> =
    /*#__PURE__*/
    flow(O.some, R.of)

/**
 * @category constructors
 * @since 0.6.14
 */
export const fromObservable: <A = never>(ma: Observable<A>) => ObservableOption<A> =
    /*#__PURE__*/
    R.map(O.some)

/**
 * @category constructors
 * @since 0.6.14
 */
export const fromIO: <A = never>(ma: IO<A>) => ObservableOption<A> =
    /*#__PURE__*/
    flow(R.fromIO, fromObservable)

/**
 * @category constructors
 * @since 0.6.14
 */
export const fromTask: MonadTask1<URI>['fromTask'] =
    /*#__PURE__*/
    flow(R.fromTask, fromObservable)

/**
 * @category constructors
 * @since 0.6.14
 */
export const tryCatch: <A>(a: Observable<A>) => ObservableOption<A> =
    /*#__PURE__*/
    flow(
        R.map(O.some),
        catchError(() => none)
    )

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category destructors
 * @since 0.6.14
 */
export const fold: <A, B>(
    onNone: () => Observable<B>,
    onSome: (a: A) => Observable<B>
) => (ma: ObservableOption<A>) => Observable<B> =
    /*#__PURE__*/
    flow(O.fold, R.chain)

/**
 * @category destructors
 * @since 0.6.14
 */
export const getOrElse =
    <A>(onNone: () => Observable<A>) =>
    (ma: ObservableOption<A>): Observable<A> =>
        pipe(ma, R.chain(O.fold(onNone, R.of)))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const alt: <A>(onNone: () => ObservableOption<A>) => (ma: ObservableOption<A>) => ObservableOption<A> = f =>
    R.chain(O.fold(f, some))

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.14
 */
export const map: <A, B>(f: (a: A) => B) => (fa: ObservableOption<A>) => ObservableOption<B> = f => R.map(O.map(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.14
 */
export const ap = <A>(fa: ObservableOption<A>): (<B>(fab: ObservableOption<(a: A) => B>) => ObservableOption<B>) =>
    flow(
        R.map(gab => (ga: O.Option<A>) => O.ap(ga)(gab)),
        R.ap(fa)
    )

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const apFirst: <B>(fb: ObservableOption<B>) => <A>(fa: ObservableOption<A>) => ObservableOption<A> = fb =>
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
 * @since 0.6.14
 */
export const apSecond = <B>(fb: ObservableOption<B>): (<A>(fa: ObservableOption<A>) => ObservableOption<B>) =>
    flow(
        map(() => (b: B) => b),
        ap(fb)
    )

/**
 * @category Monad
 * @since 0.6.14
 */
export const chain =
    <A, B>(f: (a: A) => ObservableOption<B>) =>
    (ma: ObservableOption<A>): ObservableOption<B> =>
        pipe(ma, R.chain(O.fold(() => none, f)))

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const flatten: <A>(mma: ObservableOption<ObservableOption<A>>) => ObservableOption<A> =
    /*#__PURE__*/
    chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const chainFirst: <A, B>(
    f: (a: A) => ObservableOption<B>
) => (ma: ObservableOption<A>) => ObservableOption<A> = f =>
    chain(a =>
        pipe(
            f(a),
            map(() => a)
        )
    )

/**
 * @since 0.6.14
 */
export const of: Applicative1<URI>['of'] = some

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.14
 */
export const filterOrElse: {
    <A, B extends A>(refinement: Refinement<A, B>): (ma: ObservableOption<A>) => ObservableOption<B>
    <A>(predicate: Predicate<A>): (ma: ObservableOption<A>) => ObservableOption<A>
} = <A>(predicate: Predicate<A>): ((ma: ObservableOption<A>) => ObservableOption<A>) =>
    chain(a => (predicate(a) ? of(a) : none))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.14
 */
export const fromOption = <A>(ma: O.Option<A>): ObservableOption<A> => (ma._tag === 'None' ? none : of(ma.value))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.14
 */
export const fromPredicate: {
    <A, B extends A>(refinement: Refinement<A, B>): (a: A) => ObservableOption<B>
    <A>(predicate: Predicate<A>): (a: A) => ObservableOption<A>
} =
    <A>(predicate: Predicate<A>) =>
    (a: A): ObservableOption<A> =>
        predicate(a) ? of(a) : none

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const map_: Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const ap_: Apply1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad1<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const alt_: Alt1<URI>['alt'] = (fx, fy) => pipe(fx, alt(fy))

/**
 * @category instances
 * @since 0.6.14
 */
export const URI = 'ObservableOption'

/**
 * @category instances
 * @since 0.6.14
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly [URI]: ObservableOption<A>
    }
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Functor: Functor1<URI> = {
    URI,
    map: map_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Apply: Apply1<URI> = {
    URI,
    map: map_,
    ap: ap_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Applicative: Applicative1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Monad: Monad1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Alt: Alt1<URI> = {
    URI,
    map: map_,
    alt: alt_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const MonadIO: MonadIO1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const MonadTask: MonadTask1<URI> = {
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
 * @since 0.6.14
 */
export const MonadObservable: MonadObservable1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
    fromTask,
    fromObservable,
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.14
 */
export const Do: ObservableOption<{}> =
    /*#__PURE__*/
    of({})

/**
 * @since 0.6.14
 */
export const bindTo = <K extends string, A>(
    name: K
): ((fa: ObservableOption<A>) => ObservableOption<{ [P in K]: A }>) => map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.14
 */
export const bind = <K extends string, A, B>(
    name: Exclude<K, keyof A>,
    f: (a: A) => ObservableOption<B>
): ((fa: ObservableOption<A>) => ObservableOption<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
    chain(a =>
        pipe(
            f(a),
            map(b => ({ ...a, [name]: b } as any))
        )
    )
