---
title: ReaderObservableEither.ts
nav_order: 7
parent: Modules
---

## ReaderObservableEither overview

Added in v0.6.10

---

<h2 class="text-delta">Table of contents</h2>

- [Apply](#apply)
  - [ap](#ap)
- [Bifunctor](#bifunctor)
  - [bimap](#bimap)
  - [mapLeft](#mapleft)
- [Functor](#functor)
  - [map](#map)
- [Monad](#monad)
  - [chain](#chain)
- [combinators](#combinators)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chainFirst](#chainfirst)
  - [flatten](#flatten)
- [utils](#utils)
  - [Applicative](#applicative)
  - [Apply](#apply-1)
  - [Bifunctor](#bifunctor-1)
  - [Do](#do)
  - [Functor](#functor-1)
  - [Monad](#monad-1)
  - [MonadIO](#monadio)
  - [MonadObservable](#monadobservable)
  - [MonadTask](#monadtask)
  - [MonadThrow](#monadthrow)
  - [ReaderObservableEither (interface)](#readerobservableeither-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [ask](#ask)
  - [asks](#asks)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
  - [filterOrElse](#filterorelse)
  - [fromEither](#fromeither)
  - [fromIO](#fromio)
  - [fromObservable](#fromobservable)
  - [fromObservableEither](#fromobservableeither)
  - [fromOption](#fromoption)
  - [fromPredicate](#frompredicate)
  - [fromReader](#fromreader)
  - [fromTask](#fromtask)
  - [local](#local)
  - [of](#of)
  - [throwError](#throwerror)
  - [~~readerObservableEither~~](#readerobservableeither)

---

# Apply

## ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export declare const ap: <R, E, A>(
  fa: ReaderObservableEither<R, E, A>
) => <B>(fab: ReaderObservableEither<R, E, (a: A) => B>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# Bifunctor

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, B>
```

Added in v0.6.10

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, A>
```

Added in v0.6.10

# Functor

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(
  f: (a: A) => B
) => <R, E>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# Monad

## chain

**Signature**

```ts
export declare const chain: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# combinators

## apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export declare const apFirst: <R, E, B>(
  fb: ReaderObservableEither<R, E, B>
) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export declare const apSecond: <R, E, B>(
  fb: ReaderObservableEither<R, E, B>
) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

## chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export declare const chainFirst: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## flatten

Derivable from `Monad`.

**Signature**

```ts
export declare const flatten: <R, E, A>(
  mma: ReaderObservableEither<R, E, ReaderObservableEither<R, E, A>>
) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

# utils

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative3<'ReaderObservableEither'>
```

Added in v0.6.12

## Apply

**Signature**

```ts
export declare const Apply: Apply3<'ReaderObservableEither'>
```

Added in v0.6.12

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor3<'ReaderObservableEither'>
```

Added in v0.6.12

## Do

**Signature**

```ts
export declare const Do: ReaderObservableEither<unknown, never, {}>
```

Added in v0.6.12

## Functor

**Signature**

```ts
export declare const Functor: Functor3<'ReaderObservableEither'>
```

Added in v0.6.12

## Monad

**Signature**

```ts
export declare const Monad: Monad3<'ReaderObservableEither'>
```

Added in v0.6.12

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO3<'ReaderObservableEither'>
```

Added in v0.6.12

## MonadObservable

**Signature**

```ts
export declare const MonadObservable: MonadObservable3<'ReaderObservableEither'>
```

Added in v0.6.12

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask3<'ReaderObservableEither'>
```

Added in v0.6.12

## MonadThrow

**Signature**

```ts
export declare const MonadThrow: MonadThrow3<'ReaderObservableEither'>
```

Added in v0.6.12

## ReaderObservableEither (interface)

**Signature**

```ts
export interface ReaderObservableEither<R, E, A> {
  (r: R): OBE.ObservableEither<E, A>
}
```

Added in v0.6.10

## URI

**Signature**

```ts
export declare const URI: 'ReaderObservableEither'
```

Added in v0.6.10

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.10

## ask

**Signature**

```ts
export declare function ask<R, E>(): ReaderObservableEither<R, E, R>
```

Added in v0.6.10

## asks

**Signature**

```ts
export declare function asks<R, E, A>(f: (r: R) => A): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## bind

**Signature**

```ts
export declare function bind<K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
): (
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare function bindTo<K extends string, R, E, A>(
  name: K
): (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }>
```

Added in v0.6.11

## bindW

**Signature**

```ts
export declare const bindW: <K extends string, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderObservableEither<R1, E1, A>
) => ReaderObservableEither<R1 & R2, E2 | E1, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.12

## filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderObservableEither<R, E, A>
  ) => ReaderObservableEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(
    ma: ReaderObservableEither<R, E, A>
  ) => ReaderObservableEither<R, E, A>
}
```

Added in v0.6.10

## fromEither

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromEither: <R, E, A>(ma: Either<E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromIO

**Signature**

```ts
export declare function fromIO<R, E, A>(a: IO.IO<A>): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromObservable

**Signature**

```ts
export declare function fromObservable<R, E, A>(a: Observable<A>): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromObservableEither

**Signature**

```ts
export declare function fromObservableEither<R, E, A>(ma: OBE.ObservableEither<E, A>): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromOption: <E>(onNone: () => E) => <R, A>(ma: Option<A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, A>
}
```

Added in v0.6.10

## fromReader

**Signature**

```ts
export declare function fromReader<R, E, A>(ma: R.Reader<R, A>): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromTask

**Signature**

```ts
export declare function fromTask<R, E, A>(a: T.Task<A>): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## local

**Signature**

```ts
export declare function local<R, Q>(
  f: (d: Q) => R
): <E, A>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<Q, E, A>
```

Added in v0.6.10

## of

**Signature**

```ts
export declare function of<R, E, A>(a: A): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## throwError

**Signature**

```ts
export declare function throwError<R, E, A = never>(e: E): ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## ~~readerObservableEither~~

**Signature**

```ts
export declare const readerObservableEither: MonadObservable3<'ReaderObservableEither'> &
  MonadThrow3<'ReaderObservableEither'> &
  Bifunctor3<'ReaderObservableEither'>
```

Added in v0.6.10
