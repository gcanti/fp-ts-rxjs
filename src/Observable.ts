import { Monoid } from 'fp-ts/lib/Monoid'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Alternative1 } from 'fp-ts/lib/Alternative'
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

export const getMonoid = <A = never>(): Monoid<Observable<A>> => {
  return {
    concat: (x, y) => Observable.merge(x, y),
    empty: Observable.empty()
  }
}

const map = <A, B>(fa: Observable<A>, f: (a: A) => B): Observable<B> => fa.map(f)

const of = <A>(a: A): Observable<A> => Observable.of(a)

const ap = <A, B>(fab: Observable<(a: A) => B>, fa: Observable<A>): Observable<B> =>
  Observable.combineLatest(fab, fa, (f, a) => f(a))

const chain = <A, B>(fa: Observable<A>, f: (a: A) => Observable<B>): Observable<B> => fa.flatMap(f)

const alt = <A>(x: Observable<A>, y: Observable<A>): Observable<A> => Observable.merge(x, y)

const zero = <A>(): Observable<A> => Observable.empty()

export const observable: Monad1<URI> & Alternative1<URI> = {
  URI,
  map,
  of,
  ap,
  chain,
  zero,
  alt
}
