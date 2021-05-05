---
title: ReaderObservableEither.ts
nav_order: 8
parent: Modules
---

## ReaderObservableEither overview

Added in v0.6.10

---

<h2 class="text-delta">Table of contents</h2>

- [Applicative](#applicative)
  - [of](#of)
- [Apply](#apply)
  - [ap](#ap)
- [Bifunctor](#bifunctor)
  - [bimap](#bimap)
  - [mapLeft](#mapleft)
- [Functor](#functor)
  - [map](#map)
- [Monad](#monad)
  - [chain](#chain)
  - [chainW](#chainw)
- [MonadThrow](#monadthrow)
  - [throwError](#throwerror)
- [combinators](#combinators)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chainFirst](#chainfirst)
  - [flatten](#flatten)
  - [liftOperator](#liftoperator)
  - [local](#local)
- [constructors](#constructors)
  - [ask](#ask)
  - [asks](#asks)
  - [fromIO](#fromio)
  - [fromObservable](#fromobservable)
  - [fromObservableEither](#fromobservableeither)
  - [fromReader](#fromreader)
  - [fromTask](#fromtask)
  - [left](#left)
  - [right](#right)
- [instances](#instances)
  - [Applicative](#applicative-1)
  - [Apply](#apply-1)
  - [Bifunctor](#bifunctor-1)
  - [Functor](#functor-1)
  - [Monad](#monad-1)
  - [MonadIO](#monadio)
  - [MonadObservable](#monadobservable)
  - [MonadTask](#monadtask)
  - [MonadThrow](#monadthrow-1)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [~~readerObservableEither~~](#readerobservableeither)
- [model](#model)
  - [ReaderObservableEither (interface)](#readerobservableeither-interface)
- [utils](#utils)
  - [Do](#do)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
  - [filterOrElse](#filterorelse)
  - [fromEither](#fromeither)
  - [fromOption](#fromoption)
  - [fromPredicate](#frompredicate)

---

# Applicative

## of

**Signature**

```ts
export declare const of: <R, E, A>(a: A) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

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

## chainW

Less strict version of [`chain`](#chain).

**Signature**

```ts
export declare const chainW: <A, R2, E2, B>(
  f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(ma: ReaderObservableEither<R1, E1, A>) => ReaderObservableEither<R1 & R2, E2 | E1, B>
```

Added in v0.6.12

# MonadThrow

## throwError

**Signature**

```ts
export declare const throwError: <R, E, A>(e: E) => ReaderObservableEither<R, E, A>
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

## liftOperator

Lifts an OperatorFunction into a ReaderObservableEither context
Allows e.g. filter to be used on on ReaderObservableEither

**Signature**

```ts
export declare function liftOperator<R, E, A, B>(
  f: OperatorFunction<A, B>
): (obs: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.12

## local

**Signature**

```ts
export declare const local: <R2, R1>(
  f: (d: R2) => R1
) => <E, A>(ma: ReaderObservableEither<R1, E, A>) => ReaderObservableEither<R2, E, A>
```

Added in v0.6.10

# constructors

## ask

**Signature**

```ts
export declare const ask: <R, E>() => ReaderObservableEither<R, E, R>
```

Added in v0.6.10

## asks

**Signature**

```ts
export declare const asks: <R, E, A>(f: (r: R) => A) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromIO

**Signature**

```ts
export declare const fromIO: <R, E, A>(fa: IO<A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromObservable

**Signature**

```ts
export declare const fromObservable: <R, E, A>(fa: Observable<A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromObservableEither

**Signature**

```ts
export declare const fromObservableEither: <R, E, A>(ma: OE.ObservableEither<E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromReader

**Signature**

```ts
export declare const fromReader: <R, E, A>(ma: R.Reader<R, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## fromTask

**Signature**

```ts
export declare const fromTask: <R, E, A>(fa: Task<A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## left

**Signature**

```ts
export declare const left: <R, E = never, A = never>(e: E) => ReaderObservableEither<R, E, A>
```

Added in v2.0.0

## right

**Signature**

```ts
export declare const right: <R, E = never, A = never>(a: A) => ReaderObservableEither<R, E, A>
```

Added in v2.0.0

# instances

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

## ~~readerObservableEither~~

**Signature**

```ts
export declare const readerObservableEither: MonadObservable3<'ReaderObservableEither'> &
  MonadThrow3<'ReaderObservableEither'> &
  Bifunctor3<'ReaderObservableEither'>
```

Added in v0.6.10

# model

## ReaderObservableEither (interface)

**Signature**

```ts
export interface ReaderObservableEither<R, E, A> {
  (r: R): OE.ObservableEither<E, A>
}
```

Added in v0.6.10

# utils

## Do

**Signature**

```ts
export declare const Do: ReaderObservableEither<unknown, never, {}>
```

Added in v0.6.12

## bind

**Signature**

```ts
export declare const bind: <K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare const bindTo: <K extends string, R, E, A>(
  name: K
) => (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }>
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
