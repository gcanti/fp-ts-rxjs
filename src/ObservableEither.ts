/**
 * @since 0.6.8
 */
import * as E from 'fp-ts/lib/Either'
import * as R from './Observable'
import * as TE from 'fp-ts/lib/TaskEither'
import { Alt2 } from 'fp-ts/lib/Alt'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2 } from 'fp-ts/lib/Monad'
import { MonadObservable2 } from './MonadObservable'
import { Observable } from 'rxjs'
import { Task } from 'fp-ts/lib/Task'
import { getEitherM } from 'fp-ts/lib/EitherT'
import { pipeable } from 'fp-ts/lib/pipeable'

const T = getEitherM(R.observable)

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

/**
 * @since 0.6.8
 */
export const observableEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadObservable2<URI> & MonadThrow2<URI> = {
  URI,
  map: T.map,
  of: T.of,
  ap: T.ap,
  chain: T.chain,
  bimap: T.bimap,
  mapLeft: T.mapLeft,
  alt: T.alt,
  fromObservable: rightObservable,
  fromTask,
  fromIO: rightIO,
  throwError: left
}

const { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft } = pipeable(observableEither)

export {
  /**
   * @since 0.6.8
   */
  alt,
  /**
   * @since 0.6.8
   */
  ap,
  /**
   * @since 0.6.8
   */
  apFirst,
  /**
   * @since 0.6.8
   */
  apSecond,
  /**
   * @since 0.6.8
   */
  bimap,
  /**
   * @since 0.6.8
   */
  chain,
  /**
   * @since 0.6.8
   */
  chainFirst,
  /**
   * @since 0.6.8
   */
  flatten,
  /**
   * @since 0.6.8
   */
  map,
  /**
   * @since 0.6.8
   */
  mapLeft
}
