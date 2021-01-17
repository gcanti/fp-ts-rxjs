---
title: ReaderObservable.ts
nav_order: 6
parent: Modules
---

## ReaderObservable overview

Added in v0.6.6

---

<h2 class="text-delta">Table of contents</h2>

- [Alt](#alt)
  - [alt](#alt)
- [Applicative](#applicative)
  - [of](#of)
- [Apply](#apply)
  - [ap](#ap)
- [Compactable](#compactable)
  - [compact](#compact)
  - [separate](#separate)
- [Filterable](#filterable)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
- [Functor](#functor)
  - [map](#map)
- [Monad](#monad)
  - [chain](#chain)
- [combinators](#combinators)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chainFirst](#chainfirst)
  - [chainIOK](#chainiok)
  - [chainTaskK](#chaintaskk)
  - [flatten](#flatten)
  - [fromIOK](#fromiok)
  - [fromObservableK](#fromobservablek)
  - [local](#local)
- [constructors](#constructors)
  - [ask](#ask)
  - [asks](#asks)
  - [fromIO](#fromio)
  - [fromObservable](#fromobservable)
  - [fromOption](#fromoption)
  - [fromReader](#fromreader)
  - [fromReaderTask](#fromreadertask)
  - [fromTask](#fromtask)
- [instances](#instances)
  - [Alt](#alt-1)
  - [Alternative](#alternative)
  - [Applicative](#applicative-1)
  - [Apply](#apply-1)
  - [Compactable](#compactable-1)
  - [Filterable](#filterable-1)
  - [Functor](#functor-1)
  - [Monad](#monad-1)
  - [MonadIO](#monadio)
  - [MonadObservable](#monadobservable)
  - [MonadTask](#monadtask)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [getMonoid](#getmonoid)
  - [~~readerObservable~~](#readerobservable)
- [model](#model)
  - [ReaderObservable (interface)](#readerobservable-interface)
- [utils](#utils)
  - [Do](#do)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
  - [run](#run)
  - [toReaderTask](#toreadertask)
  - [zero](#zero)

---

# Alt

## alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export declare const alt: <E, A>(
  that: () => ReaderObservable<E, A>
) => (fa: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.7

# Applicative

## of

**Signature**

```ts
export declare const of: <R, A>(a: A) => ReaderObservable<R, A>
```

Added in v0.6.6

# Apply

## ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export declare const ap: <E, A>(
  fa: ReaderObservable<E, A>
) => <B>(fab: ReaderObservable<E, (a: A) => B>) => ReaderObservable<E, B>
```

Added in v0.6.6

# Compactable

## compact

**Signature**

```ts
export declare const compact: <E, A>(fa: ReaderObservable<E, O.Option<A>>) => ReaderObservable<E, A>
```

Added in v0.6.7

## separate

**Signature**

```ts
export declare const separate: <E, A, B>(
  fa: ReaderObservable<E, E.Either<A, B>>
) => Separated<ReaderObservable<E, A>, ReaderObservable<E, B>>
```

Added in v0.6.7

# Filterable

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
  <A>(predicate: Predicate<A>): <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A>
}
```

Added in v0.6.7

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(
  f: (a: A) => O.Option<B>
) => <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.7

## partition

**Signature**

```ts
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): <E>(
    fa: ReaderObservable<E, A>
  ) => Separated<ReaderObservable<E, A>, ReaderObservable<E, B>>
  <A>(predicate: Predicate<A>): <E>(
    fa: ReaderObservable<E, A>
  ) => Separated<ReaderObservable<E, A>, ReaderObservable<E, A>>
}
```

Added in v0.6.7

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => E.Either<B, C>
) => <E>(fa: ReaderObservable<E, A>) => Separated<ReaderObservable<E, B>, ReaderObservable<E, C>>
```

Added in v0.6.7

# Functor

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# Monad

## chain

**Signature**

```ts
export declare const chain: <E, A, B>(
  f: (a: A) => ReaderObservable<E, B>
) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# combinators

## apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export declare const apFirst: <E, B>(
  fb: ReaderObservable<E, B>
) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.6

## apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export declare const apSecond: <E, B>(
  fb: ReaderObservable<E, B>
) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

## chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export declare const chainFirst: <E, A, B>(
  f: (a: A) => ReaderObservable<E, B>
) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.6

## chainIOK

**Signature**

```ts
export declare const chainIOK: <A, B>(f: (a: A) => IO<B>) => <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B>
```

Added in v0.6.6

## chainTaskK

**Signature**

```ts
export declare const chainTaskK: <A, B>(
  f: (a: A) => Observable<B>
) => <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B>
```

Added in v0.6.6

## flatten

Derivable from `Monad`.

**Signature**

```ts
export declare const flatten: <E, A>(mma: ReaderObservable<E, ReaderObservable<E, A>>) => ReaderObservable<E, A>
```

Added in v0.6.6

## fromIOK

**Signature**

```ts
export declare const fromIOK: <A extends unknown[], B>(f: (...a: A) => IO<B>) => <R>(...a: A) => ReaderObservable<R, B>
```

Added in v0.6.6

## fromObservableK

**Signature**

```ts
export declare const fromObservableK: <A extends unknown[], B>(
  f: (...a: A) => Observable<B>
) => <R>(...a: A) => ReaderObservable<R, B>
```

Added in v0.6.6

## local

**Signature**

```ts
export declare const local: <R2, R1>(f: (f: R2) => R1) => <A>(ma: ReaderObservable<R1, A>) => ReaderObservable<R2, A>
```

Added in v0.6.6

# constructors

## ask

**Signature**

```ts
export declare const ask: <R>() => ReaderObservable<R, R>
```

Added in v0.6.6

## asks

**Signature**

```ts
export declare const asks: <R, A = never>(f: (r: R) => A) => ReaderObservable<R, A>
```

Added in v0.6.6

## fromIO

**Signature**

```ts
export declare const fromIO: <E, A>(fa: IO<A>) => ReaderObservable<E, A>
```

Added in v0.6.6

## fromObservable

**Signature**

```ts
export declare const fromObservable: <E, A>(fa: Observable<A>) => ReaderObservable<E, A>
```

Added in v0.6.6

## fromOption

**Signature**

```ts
export declare const fromOption: <R, A>(o: O.Option<A>) => ReaderObservable<R, A>
```

Added in v0.6.6

## fromReader

**Signature**

```ts
export declare const fromReader: <R, A = never>(ma: R.Reader<R, A>) => ReaderObservable<R, A>
```

Added in v0.6.6

## fromReaderTask

**Signature**

```ts
export declare const fromReaderTask: <R, A>(ma: ReaderTask<R, A>) => ReaderObservable<R, A>
```

Added in v0.6.9

## fromTask

**Signature**

```ts
export declare const fromTask: <E, A>(fa: Task<A>) => ReaderObservable<E, A>
```

Added in v0.6.6

# instances

## Alt

**Signature**

```ts
export declare const Alt: Alt2<'ReaderObservable'>
```

Added in v0.6.12

## Alternative

**Signature**

```ts
export declare const Alternative: Alternative2<'ReaderObservable'>
```

Added in v0.6.12

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative2<'ReaderObservable'>
```

Added in v0.6.12

## Apply

**Signature**

```ts
export declare const Apply: Apply2<'ReaderObservable'>
```

Added in v0.6.12

## Compactable

**Signature**

```ts
export declare const Compactable: Compactable2<'ReaderObservable'>
```

Added in v0.6.12

## Filterable

**Signature**

```ts
export declare const Filterable: Filterable2<'ReaderObservable'>
```

Added in v0.6.12

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'ReaderObservable'>
```

Added in v0.6.12

## Monad

**Signature**

```ts
export declare const Monad: Monad2<'ReaderObservable'>
```

Added in v0.6.12

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO2<'ReaderObservable'>
```

Added in v0.6.12

## MonadObservable

**Signature**

```ts
export declare const MonadObservable: MonadObservable2<'ReaderObservable'>
```

Added in v0.6.12

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask2<'ReaderObservable'>
```

Added in v0.6.12

## URI

**Signature**

```ts
export declare const URI: 'ReaderObservable'
```

Added in v0.6.6

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.6

## getMonoid

**Signature**

```ts
export declare const getMonoid: <R, A>() => Monoid<ReaderObservable<R, A>>
```

Added in v0.6.6

## ~~readerObservable~~

**Signature**

```ts
export declare const readerObservable: Monad2<'ReaderObservable'> &
  Alternative2<'ReaderObservable'> &
  Filterable2<'ReaderObservable'> &
  MonadObservable2<'ReaderObservable'>
```

Added in v0.6.6

# model

## ReaderObservable (interface)

**Signature**

```ts
export interface ReaderObservable<R, A> {
  (r: R): Observable<A>
}
```

Added in v0.6.6

# utils

## Do

**Signature**

```ts
export declare const Do: ReaderObservable<unknown, {}>
```

Added in v0.6.12

## bind

**Signature**

```ts
export declare const bind: <K extends string, R, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservable<R, B>
) => (fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare const bindTo: <K extends string, R, A>(
  name: K
) => (fa: ReaderObservable<R, A>) => ReaderObservable<R, { [P in K]: A }>
```

Added in v0.6.11

## bindW

**Signature**

```ts
export declare const bindW: <K extends string, R2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservable<R2, B>
) => <R1>(
  fa: ReaderObservable<R1, A>
) => ReaderObservable<R1 & R2, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.12

## run

**Signature**

```ts
export declare const run: <R, A>(ma: ReaderObservable<R, A>, r: R) => Promise<A>
```

Added in v0.6.6

## toReaderTask

**Signature**

```ts
export declare const toReaderTask: <R, A>(ma: ReaderObservable<R, A>) => ReaderTask<R, A>
```

Added in v0.6.6

## zero

**Signature**

```ts
export declare const zero: <E, A>() => ReaderObservable<E, A>
```

Added in v0.6.12
