---
title: Observable.ts
nav_order: 3
parent: Modules
---

# Observable overview

Added in v0.6.0

---

<h2 class="text-delta">Table of contents</h2>

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
- [bind](#bind)
- [bindTo](#bindto)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [compact](#compact)
- [filter](#filter)
- [filterMap](#filtermap)
- [flatten](#flatten)
- [fromIO](#fromio)
- [fromOption](#fromoption)
- [fromTask](#fromtask)
- [getMonoid](#getmonoid)
- [map](#map)
- [of](#of)
- [partition](#partition)
- [partitionMap](#partitionmap)
- [separate](#separate)
- [toTask](#totask)
- [zero](#zero)
- [~~observable~~](#observable)

---

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.0

# Alt

**Signature**

```ts
export const Alt: Alt1<URI> = ...
```

Added in v0.6.12

# Alternative

**Signature**

```ts
export const Alternative: Alternative1<URI> = ...
```

Added in v0.6.12

# Applicative

**Signature**

```ts
export const Applicative: Applicative1<URI> = ...
```

Added in v0.6.12

# Apply

**Signature**

```ts
export const Apply: Apply1<URI> = ...
```

Added in v0.6.12

# Compactable

**Signature**

```ts
export const Compactable: Compactable1<URI> = ...
```

Added in v0.6.12

# Do

**Signature**

```ts
export const : Observable<{}> = ...
```

Added in v0.6.12

# Filterable

**Signature**

```ts
export const Filterable: Filterable1<URI> = ...
```

Added in v0.6.12

# Functor

**Signature**

```ts
export const Functor: Functor1<URI> = ...
```

Added in v0.6.12

# Monad

**Signature**

```ts
export const Monad: Monad1<URI> = ...
```

Added in v0.6.12

# MonadIO

**Signature**

```ts
export const MonadIO: MonadIO1<URI> = ...
```

Added in v0.6.12

# MonadObservable

**Signature**

```ts
export const MonadObservable: MonadObservable1<URI> = ...
```

Added in v0.6.12

# MonadTask

**Signature**

```ts
export const MonadTask: MonadTask1<URI> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "Observable" = ...
```

Added in v0.6.0

# alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export const alt: <A>(that: () => Observable<A>) => (fa: Observable<A>) => Observable<A> = that => fa => ...
```

Added in v0.6.0

# ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export const ap: <A>(fa: Observable<A>) => <B>(fab: Observable<(a: A) => B>) => Observable<B> = fa => fab =>
  combineLatest([fab, fa]).pipe(rxMap(([f, a]) => ...
```

Added in v0.6.0

# apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export const apFirst: <B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<A> = fb =>
  flow(
    map(a => () => ...
```

Added in v0.6.0

# apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export const apSecond = <B>(fb: Observable<B>): (<A>(fa: Observable<A>) => Observable<B>) =>
  flow(
    map(() => (b: B) => ...
```

Added in v0.6.0

# bind

**Signature**

```ts
export const bind = <K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => Observable<B>
): ((fa: Observable<A>) => Observable<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ...
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export const bindTo = <K extends string, A>(name: K): ((fa: Observable<A>) => Observable<{ [P in K]: A }>) =>
  map(a => ...
```

Added in v0.6.11

# chain

Composes computations in sequence, using the return value of one computation to determine the next computation.

**Signature**

```ts
export const chain: <A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<B> = f => ma => ...
```

Added in v0.6.0

# chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export const chainFirst: <A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => ...
```

Added in v0.6.0

# compact

**Signature**

```ts
export const : <A>(fa: Observable<O.Option<A>>) => Observable<A> = ...
```

Added in v0.6.0

# filter

**Signature**

```ts
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Observable<A>) => Observable<B>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Observable<A>
} = <A>(p: Predicate<A>) => (fa: Observable<A>) => ...
```

Added in v0.6.0

# filterMap

**Signature**

```ts
export const filterMap = <A, B>(f: (a: A) => O.Option<B>) => (fa: Observable<A>): Observable<B> =>
  fa.pipe(
    mergeMap(a =>
      pipe(
        f(a),
        // tslint:disable-next-line: deprecation
        O.fold<B, Observable<B>>(() => ...
```

Added in v0.6.0

# flatten

Derivable from `Monad`.

**Signature**

```ts
export const : <A>(mma: Observable<Observable<A>>) => Observable<A> = ...
```

Added in v0.6.0

# fromIO

**Signature**

```ts
export const fromIO: MonadIO1<URI>['fromIO'] = ma => defer(() => ...
```

Added in v0.6.5

# fromOption

**Signature**

```ts
export const fromOption = <A>(o: O.Option<A>): Observable<A> => ...
```

Added in v0.6.5

# fromTask

**Signature**

```ts
export const fromTask: MonadTask1<URI>['fromTask'] = ...
```

Added in v0.6.5

# getMonoid

**Signature**

```ts
export const getMonoid = <A = never>(): Monoid<Observable<A>> => ({
  concat: (x, y) => ...
```

Added in v0.6.0

# map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export const map: <A, B>(f: (a: A) => B) => (fa: Observable<A>) => Observable<B> = f => fa => ...
```

Added in v0.6.0

# of

**Signature**

```ts
export const of: Applicative1<URI>['of'] = ...
```

Added in v0.6.6

# partition

**Signature**

```ts
export const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Observable<A>) => Separated<Observable<A>, Observable<B>>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Separated<Observable<A>, Observable<A>>
} = <A>(p: Predicate<A>) => (fa: Observable<A>) => ...
```

Added in v0.6.0

# partitionMap

**Signature**

```ts
export const partitionMap: <A, B, C>(
  f: (a: A) => E.Either<B, C>
) => (fa: Observable<A>) => Separated<Observable<B>, Observable<C>> = f => fa => ({
  left: pipe(
    fa,
    filterMap(a => O.fromEither(E.swap(f(a))))
  ),
  right: pipe(
    fa,
    filterMap(a => ...
```

Added in v0.6.0

# separate

**Signature**

```ts
export const : <A, B>(fa: Observable<E.Either<A, B>>) => Separated<Observable<A>, Observable<B>> = ...
```

Added in v0.6.0

# toTask

**Signature**

```ts
export const toTask = <A>(o: Observable<A>): Task<A> => () => ...
```

Added in v0.6.5

# zero

**Signature**

```ts
export const zero: Alternative1<URI>['zero'] = () => ...
```

Added in v0.6.12

# ~~observable~~

**Signature**

```ts
export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> & MonadObservable1<URI> = ...
```

Added in v0.6.0
