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

export const URI = 'Observable'

export type URI = typeof URI

export function concat<A>(x: Observable<A>, y: Observable<A>): Observable<A> {
  return Observable.merge(x, y)
}

export function empty<A>(): Observable<A> {
  return Observable.empty<A>()
}

export function map<A, B>(f: (a: A) => B, fa: Observable<A>): Observable<B> {
  return fa.map(f)
}

export function of<A>(a: A): Observable<A> {
  return Observable.of(a)
}

export function ap<A, B>(fab: Observable<(a: A) => B>, fa: Observable<A>): Observable<B> {
  return Observable.combineLatest(fab, fa, (f, a) => f(a))
}

export function chain<A, B>(f: (a: A) => Observable<B>, fa: Observable<A>): Observable<B> {
  return fa.flatMap(f)
}

export function alt<A>(x: Observable<A>, y: Observable<A>): Observable<A> {
  return Observable.merge(x, y)
}

export function zero<A>(): Observable<A> {
  return Observable.empty<A>()
}

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
