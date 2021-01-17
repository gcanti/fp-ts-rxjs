---
title: ReaderObservable.ts
nav_order: 6
parent: Modules
---

# ReaderObservable overview

Added in v0.6.6

---

<h2 class="text-delta">Table of contents</h2>

- [ReaderObservable (interface)](#readerobservable-interface)
- [URI (type alias)](#uri-type-alias)
- [Alt](#alt)
- [Alternative](#alternative)
- [Applicative](#applicative)
- [Apply](#apply)
- [Compactable](#compactable)
- [Do](#do)
- [Filterable](#filterable)
- [Functor](#functor)
- [Monad](#monad)
- [MonadIO](#monadio)
- [MonadObservable](#monadobservable)
- [MonadTask](#monadtask)
- [URI](#uri)
- [alt](#alt)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [ask](#ask)
- [asks](#asks)
- [bind](#bind)
- [bindTo](#bindto)
- [bindW](#bindw)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [chainIOK](#chainiok)
- [chainTaskK](#chaintaskk)
- [compact](#compact)
- [filter](#filter)
- [filterMap](#filtermap)
- [flatten](#flatten)
- [fromIO](#fromio)
- [fromIOK](#fromiok)
- [fromObservable](#fromobservable)
- [fromObservableK](#fromobservablek)
- [fromOption](#fromoption)
- [fromReader](#fromreader)
- [fromReaderTask](#fromreadertask)
- [fromTask](#fromtask)
- [getMonoid](#getmonoid)
- [local](#local)
- [map](#map)
- [of](#of)
- [partition](#partition)
- [partitionMap](#partitionmap)
- [run](#run)
- [separate](#separate)
- [toReaderTask](#toreadertask)
- [zero](#zero)
- [~~readerObservable~~](#readerobservable)

---

# ReaderObservable (interface)

**Signature**

```ts
export interface ReaderObservable<R, A> {
  (r: R): Observable<A>
}
```

Added in v0.6.6

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.6

# Alt

**Signature**

```ts
export const Alt: Alt2<URI> = ...
```

Added in v0.6.12

# Alternative

**Signature**

```ts
export const Alternative: Alternative2<URI> = ...
```

Added in v0.6.12

# Applicative

**Signature**

```ts
export const Applicative: Applicative2<URI> = ...
```

Added in v0.6.12

# Apply

**Signature**

```ts
export const Apply: Apply2<URI> = ...
```

Added in v0.6.12

# Compactable

**Signature**

```ts
export const Compactable: Compactable2<URI> = ...
```

Added in v0.6.12

# Do

**Signature**

```ts
export const : ReaderObservable<unknown, {}> = ...
```

Added in v0.6.12

# Filterable

**Signature**

```ts
export const Filterable: Filterable2<URI> = ...
```

Added in v0.6.12

# Functor

**Signature**

```ts
export const Functor: Functor2<URI> = ...
```

Added in v0.6.12

# Monad

**Signature**

```ts
export const Monad: Monad2<URI> = ...
```

Added in v0.6.12

# MonadIO

**Signature**

```ts
export const MonadIO: MonadIO2<URI> = ...
```

Added in v0.6.12

# MonadObservable

**Signature**

```ts
export const MonadObservable: MonadObservable2<URI> = ...
```

Added in v0.6.12

# MonadTask

**Signature**

```ts
export const MonadTask: MonadTask2<URI> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "ReaderObservable" = ...
```

Added in v0.6.6

# alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export const alt: <E, A>(
  that: () => ReaderObservable<E, A>
) => (fa: ReaderObservable<E, A>) => ReaderObservable<E, A> = that => me => r =>
  pipe(
    me(r),
    T.alt(() => ...
```

Added in v0.6.7

# ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export const ap: <E, A>(
  fa: ReaderObservable<E, A>
) => <B>(fab: ReaderObservable<E, (a: A) => B>) => ReaderObservable<E, B> = fa => fab => r => ...
```

Added in v0.6.6

# apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export const apFirst: <E, B>(
  fb: ReaderObservable<E, B>
) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A> = fb =>
  flow(
    map(a => () => ...
```

Added in v0.6.6

# apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export const apSecond = <E, B>(
  fb: ReaderObservable<E, B>
): (<A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>) =>
  flow(
    map(() => (b: B) => ...
```

Added in v0.6.6

# ask

**Signature**

```ts
export const ask: <R>() => ReaderObservable<R, R> = () => ...
```

Added in v0.6.6

# asks

**Signature**

```ts
export const asks: <R, A = never>(f: (r: R) => A) => ReaderObservable<R, A> = f => ...
```

Added in v0.6.6

# bind

**Signature**

```ts
export const bind = <K extends string, R, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservable<R, B>
): ((fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ...
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export const bindTo = <K extends string, R, A>(
  name: K
): ((fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in K]: A }>) =>
  map(a => ...
```

Added in v0.6.11

# bindW

**Signature**

```ts
export const bindW: <K extends string, R2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservable<R2, B>
) => <R1>(
  fa: ReaderObservable<R1, A>
) => ReaderObservable<R1 & R2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = ...
```

Added in v0.6.12

# chain

**Signature**

```ts
export const chain: <E, A, B>(
  f: (a: A) => ReaderObservable<E, B>
) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, B> = f => fa => r =>
  pipe(
    fa(r),
    T.chain(a => ...
```

Added in v0.6.6

# chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export const chainFirst: <E, A, B>(
  f: (a: A) => ReaderObservable<E, B>
) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => ...
```

Added in v0.6.6

# chainIOK

**Signature**

```ts
export const chainIOK = <A, B>(f: (a: A) => IO<B>): (<R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B>) =>
  chain(a => ...
```

Added in v0.6.6

# chainTaskK

**Signature**

```ts
export const chainTaskK = <A, B>(
  f: (a: A) => Observable<B>
): (<R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B>) => chain(a => ...
```

Added in v0.6.6

# compact

**Signature**

```ts
export const : <E, A>(fa: ReaderObservable<E, O.Option<A>>) => ReaderObservable<E, A> = ...
```

Added in v0.6.7

# filter

**Signature**

```ts
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
  <A>(predicate: Predicate<A>): <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A>
} = <A>(predicate: Predicate<A>): (<E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A>) => ...
```

Added in v0.6.7

# filterMap

**Signature**

```ts
export const filterMap: <A, B>(
  f: (a: A) => O.Option<B>
) => <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B> = f => fa => r => ...
```

Added in v0.6.7

# flatten

Derivable from `Monad`.

**Signature**

```ts
export const : <E, A>(mma: ReaderObservable<E, ReaderObservable<E, A>>) => ReaderObservable<E, A> = ...
```

Added in v0.6.6

# fromIO

**Signature**

```ts
export const : <E, A>(fa: IO<A>) => ReaderObservable<E, A> = ...
```

Added in v0.6.6

# fromIOK

**Signature**

```ts
export const fromIOK = <A extends Array<unknown>, B>(
  f: (...a: A) => IO<B>
): (<R>(...a: A) => ReaderObservable<R, B>) => (...a) => ...
```

Added in v0.6.6

# fromObservable

**Signature**

```ts
export const fromObservable: MonadObservable2<URI>['fromObservable'] = ...
```

Added in v0.6.6

# fromObservableK

**Signature**

```ts
export const fromObservableK = <A extends Array<unknown>, B>(
  f: (...a: A) => Observable<B>
): (<R>(...a: A) => ReaderObservable<R, B>) => (...a) => ...
```

Added in v0.6.6

# fromOption

**Signature**

```ts
export const fromOption = <R, A>(o: O.Option<A>): ReaderObservable<R, A> => ...
```

Added in v0.6.6

# fromReader

**Signature**

```ts
export const fromReader: <R, A = never>(ma: R.Reader<R, A>) => ReaderObservable<R, A> = ma => ...
```

Added in v0.6.6

# fromReaderTask

**Signature**

```ts
export const fromReaderTask = <R, A>(ma: ReaderTask<R, A>): ReaderObservable<R, A> => ...
```

Added in v0.6.9

# fromTask

**Signature**

```ts
export const : <E, A>(fa: Task<A>) => ReaderObservable<E, A> = ...
```

Added in v0.6.6

# getMonoid

**Signature**

```ts
export const getMonoid = <R, A>(): Monoid<ReaderObservable<R, A>> => ...
```

Added in v0.6.6

# local

**Signature**

```ts
export const local: <R2, R1>(f: (f: R2) => R1) => <A>(ma: ReaderObservable<R1, A>) => ReaderObservable<R2, A> = ...
```

Added in v0.6.6

# map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B> = f => fa => ...
```

Added in v0.6.6

# of

**Signature**

```ts
export const of: <R, A>(a: A) => ReaderObservable<R, A> = a => () => ...
```

Added in v0.6.6

# partition

**Signature**

```ts
export const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): <E>(
    fa: ReaderObservable<E, A>
  ) => Separated<ReaderObservable<E, A>, ReaderObservable<E, B>>
  <A>(predicate: Predicate<A>): <E>(
    fa: ReaderObservable<E, A>
  ) => Separated<ReaderObservable<E, A>, ReaderObservable<E, A>>
} = <A>(
  predicate: Predicate<A>
): (<E>(fa: ReaderObservable<E, A>) => Separated<ReaderObservable<E, A>, ReaderObservable<E, A>>) => ...
```

Added in v0.6.7

# partitionMap

**Signature**

```ts
export const partitionMap: <A, B, C>(
  f: (a: A) => E.Either<B, C>
) => <E>(fa: ReaderObservable<E, A>) => Separated<ReaderObservable<E, B>, ReaderObservable<E, C>> = f => fa => ({
  left: pipe(
    fa,
    filterMap(a => O.fromEither(E.swap(f(a))))
  ),
  right: pipe(
    fa,
    filterMap(a => ...
```

Added in v0.6.7

# run

**Signature**

```ts
export const run = <R, A>(ma: ReaderObservable<R, A>, r: R): Promise<A> => ...
```

Added in v0.6.6

# separate

**Signature**

```ts
export const : <E, A, B>(fa: ReaderObservable<E, E.Either<A, B>>) => Separated<ReaderObservable<E, A>, ReaderObservable<E, B>> = ...
```

Added in v0.6.7

# toReaderTask

**Signature**

```ts
export const toReaderTask = <R, A>(ma: ReaderObservable<R, A>): ReaderTask<R, A> => r => () => ...
```

Added in v0.6.6

# zero

**Signature**

```ts
export const zero: Alternative2<URI>['zero'] = () => ...
```

Added in v0.6.12

# ~~readerObservable~~

**Signature**

```ts
export const readerObservable: Monad2<URI> & Alternative2<URI> & Filterable2<URI> & MonadObservable2<URI> = ...
```

Added in v0.6.6
