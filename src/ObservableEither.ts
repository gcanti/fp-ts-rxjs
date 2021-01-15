/**
 * @since 0.6.8
 */
import { Alt2 } from 'fp-ts/lib/Alt'
import { Applicative2 } from 'fp-ts/lib/Applicative'
import { Apply2 } from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import * as E from 'fp-ts/lib/Either'
import { getEitherM } from 'fp-ts/lib/EitherT'
import { flow, identity } from 'fp-ts/lib/function'
import { Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2 } from 'fp-ts/lib/Monad'
import { MonadIO2 } from 'fp-ts/lib/MonadIO'
import { MonadTask2 } from 'fp-ts/lib/MonadTask'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { pipe } from 'fp-ts/lib/pipeable'
import { Task } from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { Observable } from 'rxjs'
import { MonadObservable2 } from './MonadObservable'
import * as R from './Observable'

const T = getEitherM(R.Monad)

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    ObservableEither: ObservableEither<E, A>
  }
}

/**
 * @since 0.6.8
 */
export const URI = 'ObservableEither'
/**
 * @since 0.6.8
 */
export type URI = typeof URI

/**
 * @since 0.6.8
 */
export interface ObservableEither<E, A> extends Observable<E.Either<E, A>> {}

/**
 * @since 0.6.8
 */
export const left: <E = never, A = never>(e: E) => ObservableEither<E, A> = T.left

/**
 * @since 0.6.8
 */
export const right: <E = never, A = never>(a: A) => ObservableEither<E, A> = T.of

/**
 * @since 0.6.8
 */
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableEither<E, A> = T.rightM

/**
 * @since 0.6.8
 */
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableEither<E, A> = T.leftM

/**
 * @since 0.6.8
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableEither<E, A> = R.fromIO

/**
 * @since 0.6.8
 */
export function rightIO<E, A>(ma: IO<A>): ObservableEither<E, A> {
  return rightObservable(R.fromIO(ma))
}

/**
 * @since 0.6.8
 */
export function leftIO<E, A>(me: IO<E>): ObservableEither<E, A> {
  return leftObservable(R.fromIO(me))
}

/**
 * @since 0.6.8
 */
export function fromTaskEither<E, A>(t: TE.TaskEither<E, A>): ObservableEither<E, A> {
  return R.fromTask(t)
}

/**
 * @since 0.6.8
 */
export function toTaskEither<E, A>(o: ObservableEither<E, A>): TE.TaskEither<E, A> {
  return () => o.toPromise()
}

/**
 * @since 0.6.8
 */
export function fromTask<E, A>(ma: Task<A>): ObservableEither<E, A> {
  return rightObservable(R.fromTask(ma))
}

/**
 * @since 0.6.8
 */
export function fold<E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>
): (ma: ObservableEither<E, A>) => Observable<B> {
  return ma => T.fold(ma, onLeft, onRight)
}

/**
 * @since 0.6.8
 */
export function getOrElse<E, A>(onLeft: (e: E) => Observable<A>): (ma: ObservableEither<E, A>) => Observable<A> {
  return ma => T.getOrElse(ma, onLeft)
}

/**
 * @since 0.6.8
 */
export function orElse<E, A, M>(
  onLeft: (e: E) => ObservableEither<M, A>
): (ma: ObservableEither<E, A>) => ObservableEither<M, A> {
  return ma => T.orElse(ma, onLeft)
}

/**
 * @since 0.6.8
 */
export const swap: <E, A>(ma: ObservableEither<E, A>) => ObservableEither<A, E> = T.swap

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.8
 */
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableEither<E, A>) => ObservableEither<E, B> = f => fa =>
  T.map(fa, f)

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.0
 */
export const ap: <E, A>(
  fa: ObservableEither<E, A>
) => <B>(fab: ObservableEither<E, (a: A) => B>) => ObservableEither<E, B> = fa => fab => T.ap(fab, fa)

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 0.6.8
 */
export const alt: <E, A>(
  that: () => ObservableEither<E, A>
) => (fa: ObservableEither<E, A>) => ObservableEither<E, A> = that => fa => T.alt(fa, that)

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.8
 */
export const apFirst: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, A> = fb =>
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
 * @since 0.6.8
 */
export const apSecond = <E, B>(
  fb: ObservableEither<E, B>
): (<A>(fa: ObservableEither<E, A>) => ObservableEither<E, B>) =>
  flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * @category Bifunctor
 * @since 0.6.8
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableEither<E, A>) => ObservableEither<G, B> = (f, g) => fa => T.bimap(fa, f, g)

/**
 * @category Bifunctor
 * @since 0.6.8
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableEither<E, A>) => ObservableEither<G, A> = f => fa =>
  T.mapLeft(fa, f)

/**
 * @category Monad
 * @since 0.6.8
 */
export const chain: <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, B> = f => ma => T.chain(ma, f)

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.0
 */
export const flatten: <E, A>(mma: ObservableEither<E, ObservableEither<E, A>>) => ObservableEither<E, A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.8
 */
export const chainFirst: <A, E, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => a)
    )
  )

/**
 * @since 0.6.12
 */
export const of: Applicative2<URI>['of'] = right

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

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
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: T.bimap,
  mapLeft: T.mapLeft
}

/**
 * @since 0.6.12
 */
export const Alt: Alt2<URI> = {
  URI,
  map: T.map,
  alt: T.alt
}

/**
 * @since 0.6.12
 */
export const fromIO: MonadTask2<URI>['fromIO'] = rightIO

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
export const fromObservable: MonadObservable2<URI>['fromObservable'] = rightObservable

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
 * @since 0.6.12
 */
export const throwError: MonadThrow2<URI>['throwError'] = left

/**
 * @since 0.6.12
 */
export const MonadThrow: MonadThrow2<URI> = {
  URI,
  map: T.map,
  ap: T.ap,
  of,
  chain: T.chain,
  throwError
}

/**
 * @deprecated
 * @since 0.6.8
 */
export const observableEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadObservable2<URI> & MonadThrow2<URI> = {
  URI,
  map: T.map,
  of,
  ap: T.ap,
  chain: T.chain,
  bimap: T.bimap,
  mapLeft: T.mapLeft,
  alt: T.alt,
  fromIO: rightIO,
  fromTask,
  fromObservable: rightObservable,
  throwError: left
}

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: ObservableEither<never, {}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
export function bindTo<K extends string, E, A>(
  name: K
): (fa: ObservableEither<E, A>) => ObservableEither<E, { [P in K]: A }> {
  return map(a => ({ [name]: a } as { [P in K]: A }))
}

/**
 * @since 0.6.11
 */
export function bind<K extends string, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E, B>
): (fa: ObservableEither<E, A>) => ObservableEither<E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
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
export const bindW: <K extends string, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E2, B>
) => <E1>(
  fa: ObservableEither<E1, A>
) => ObservableEither<E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any
