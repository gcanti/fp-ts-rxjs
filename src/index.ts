import { Monoid } from 'fp-ts/lib/Monoid'
import { Monad } from 'fp-ts/lib/Monad'
import { Alternative } from 'fp-ts/lib/Alternative'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'

declare module 'rxjs/Observable' {
  interface Observable<T> {
    _URI: URI
    _A: T
  }
}

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT<A> {
    Observable: Observable<A>
  }
}

export const URI = 'Observable'

export type URI = typeof URI

export const concat = <A>(x: Observable<A>) => (y: Observable<A>): Observable<A> => Observable.merge(x, y)

export const empty = <A>(): Observable<A> => Observable.empty<A>()

export const map = <A, B>(f: (a: A) => B, fa: Observable<A>): Observable<B> => fa.map(f)

export const of = <A>(a: A): Observable<A> => Observable.of(a)

export const ap = <A, B>(fab: Observable<(a: A) => B>, fa: Observable<A>): Observable<B> =>
  Observable.combineLatest(fab, fa, (f, a) => f(a))

export const chain = <A, B>(f: (a: A) => Observable<B>, fa: Observable<A>): Observable<B> => fa.flatMap(f)

export const alt = <A>(x: Observable<A>, y: Observable<A>): Observable<A> => Observable.merge(x, y)

export const zero = <A>(): Observable<A> => Observable.empty<A>()

export const rxjs: Monoid<Observable<any>> & Monad<URI> & Alternative<URI> = {
  URI,
  concat,
  empty,
  map,
  of,
  ap,
  chain,
  zero,
  alt
}
