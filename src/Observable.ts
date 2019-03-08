import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import { combineLatest, EMPTY, merge, Observable, of as rxOf } from 'rxjs'
import { map as rxMap, mergeMap } from 'rxjs/operators'
import { Filterable1 } from 'fp-ts/lib/Filterable'
import { Either, fromPredicate as eitherFromPredicate } from 'fp-ts/lib/Either'
import { Separated } from 'fp-ts/lib/Compactable'
import { Predicate, identity } from 'fp-ts/lib/function'
import { Option, fromPredicate as optionFromPredicate, some, none } from 'fp-ts/lib/Option'

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

function filterMap<A, B>(fa: Observable<A>, f: (a: A) => Option<B>): Observable<B> {
  return fa.pipe(mergeMap(a => f(a).fold(zero(), of)))
}

const compact: <A>(fa: Observable<Option<A>>) => Observable<A> = fa => filterMap(fa, identity)

const filter: <A>(fa: Observable<A>, p: Predicate<A>) => Observable<A> = (fa, p) =>
  filterMap(fa, optionFromPredicate(p))

function partitionMap<RL, RR, A>(
  fa: Observable<A>,
  f: (a: A) => Either<RL, RR>
): Separated<Observable<RL>, Observable<RR>> {
  return {
    left: filterMap(fa, a => f(a).fold(some, () => none)),
    right: filterMap(fa, a => f(a).fold(() => none, some))
  }
}

const separate: <A, B>(fa: Observable<Either<A, B>>) => Separated<Observable<A>, Observable<B>> = fa =>
  partitionMap(fa, identity)

const partition: <A>(fa: Observable<A>, p: Predicate<A>) => Separated<Observable<A>, Observable<A>> = (fa, p) =>
  partitionMap(fa, eitherFromPredicate(p, identity))

export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> = {
  URI,
  map,
  of,
  ap,
  chain,
  zero,
  alt,
  compact,
  separate,
  partitionMap,
  partition,
  filterMap,
  filter
}
