/**
 * @since 0.6.10
 */
import * as OBE from './ObservableEither'
import { io as IO, reader as R, task as T } from 'fp-ts'
import { MonadObservable3 } from './MonadObservable'
import { MonadThrow3 } from 'fp-ts/lib/MonadThrow'
import { Bifunctor3 } from 'fp-ts/lib/Bifunctor'
import { getReaderM } from 'fp-ts/lib/ReaderT'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { Observable } from 'rxjs'

/**
 * @since 0.6.10
 */
export const URI = 'ReaderObservableEither'

/**
 * @since 0.6.10
 */
export type URI = typeof URI

/**
 * @since 0.6.10
 */
export interface ReaderObservableEither<R, E, A> {
  (r: R): OBE.ObservableEither<E, A>
}

declare module 'fp-ts/lib/HKT' {
  export interface URItoKind3<R, E, A> {
    readonly [URI]: ReaderObservableEither<R, E, A>
  }
}

const M = getReaderM(OBE.observableEither)

/**
 * @since 0.6.10
 */
export function ask<R, E>(): ReaderObservableEither<R, E, R> {
  return M.ask<R, E>()
}

/**
 * @since 0.6.10
 */
export function asks<R, E, A>(f: (r: R) => A): ReaderObservableEither<R, E, A> {
  return M.asks<R, E, A>(f)
}

/**
 * @since 0.6.10
 */
export function fromObservableEither<R, E, A>(ma: OBE.ObservableEither<E, A>): ReaderObservableEither<R, E, A> {
  return M.fromM(ma)
}

/**
 * @since 0.6.10
 */
export function fromReader<R, E, A>(ma: R.Reader<R, A>): ReaderObservableEither<R, E, A> {
  return M.fromReader(ma)
}

/**
 * @since 0.6.10
 */
export function local<R, Q>(
  f: (d: Q) => R
): <E, A>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<Q, E, A> {
  return ma => M.local(ma, f)
}

/**
 * @since 0.6.10
 */
export function of<R, E, A>(a: A): ReaderObservableEither<R, E, A> {
  return M.of(a)
}

/**
 * @since 0.6.10
 */
export function fromIO<R, E, A>(a: IO.IO<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.observableEither.fromIO(a)
}

/**
 * @since 0.6.10
 */
export function fromTask<R, E, A>(a: T.Task<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.observableEither.fromTask(a)
}

/**
 * @since 0.6.10
 */
export function fromObservable<R, E, A>(a: Observable<A>): ReaderObservableEither<R, E, A> {
  return () => OBE.observableEither.fromObservable(a)
}

/**
 * @since 0.6.10
 */
export function throwError<R, E, A>(e: E): ReaderObservableEither<R, E, A> {
  return () => OBE.left<E, A>(e)
}


/**
 * @since 0.6.8
 */
export const chainW = <A, R2, E2, B>(
  f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(ma: ReaderObservableEither<R1, E2, A>): ReaderObservableEither<R1 & R2, E1 | E2, B> =>
  chain(f)(ma as any) as any

/**
 * @since 0.6.10
 */
export const readerObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = {
  URI,
  ap: M.ap,
  map: M.map,
  of: M.of,
  chain: M.chain,
  fromIO,
  fromObservable,
  fromTask,
  throwError,
  bimap: (fea, f, g) => r => OBE.bimap(f, g)(fea(r)),
  mapLeft: (fea, f) => r => OBE.mapLeft(f)(fea(r))
}

const {
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  filterOrElse,
  flatten,
  fromEither,
  fromOption,
  fromPredicate,
  map,
  mapLeft
} = pipeable(readerObservableEither)

export {
  /**
   * @since 0.6.10
   */
  ap,
  /**
   * @since 0.6.10
   */
  apFirst,
  /**
   * @since 0.6.10
   */
  apSecond,
  /**
   * @since 0.6.10
   */
  bimap,
  /**
   * @since 0.6.10
   */
  chain,
  /**
   * @since 0.6.10
   */
  chainFirst,
  /**
   * @since 0.6.10
   */
  filterOrElse,
  /**
   * @since 0.6.10
   */
  flatten,
  /**
   * @since 0.6.10
   */
  fromEither,
  /**
   * @since 0.6.10
   */
  fromOption,
  /**
   * @since 0.6.10
   */
  fromPredicate,
  /**
   * @since 0.6.10
   */
  map,
  /**
   * @since 0.6.10
   */
  mapLeft
}

// DO

/**
 * @category Do
 * @since 0.6.11
 */
export function bindTo<K extends string, R, E, A>(
  name: K
): (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }> {
  return map(a => ({ [name]: a } as { [P in K]: A }))
}

/**
 * @category Do
 * @since 0.6.11
 */
export function bind<K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
): (
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
  return chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )
}
