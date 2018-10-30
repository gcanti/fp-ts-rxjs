import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import { combineLatest, EMPTY, merge, Observable, of as rxOf } from 'rxjs'
import { map as rxMap, mergeMap } from 'rxjs/operators'

declare module 'rxjs/internal/Observable' {
  interface Observable<T> {
    readonly _URI: URI
    readonly _A: T
  }
}

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT<A> {
    Observable: Observable<A>
  }
}

export const URI = 'Observable'

export type URI = typeof URI

export const getMonoid = <A = never>(): Monoid<Observable<A>> => {
  return {
    concat: (x, y) => merge(x, y),
    empty: EMPTY
  }
}

const map = <A, B>(fa: Observable<A>, f: (a: A) => B): Observable<B> => fa.pipe(rxMap(f))

const of = <A>(a: A): Observable<A> => rxOf(a)

const ap = <A, B>(fab: Observable<(a: A) => B>, fa: Observable<A>): Observable<B> =>
  combineLatest(fab, fa, (f, a) => f(a))

const chain = <A, B>(fa: Observable<A>, f: (a: A) => Observable<B>): Observable<B> => fa.pipe(mergeMap(f))

const alt = <A>(x: Observable<A>, y: Observable<A>): Observable<A> => merge(x, y)

const zero = <A>(): Observable<A> => EMPTY

export const observable: Monad1<URI> & Alternative1<URI> = {
  URI,
  map,
  of,
  ap,
  chain,
  zero,
  alt
}
