---
title: StateReaderObservableEither.ts
nav_order: 8
parent: Modules
---

## StateReaderObservableEither overview

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
  - [Functor](#functor-1)
  - [Monad](#monad-1)
  - [MonadIO](#monadio)
  - [MonadObservable](#monadobservable)
  - [MonadTask](#monadtask)
  - [MonadThrow](#monadthrow)
  - [StateReaderObservableEither (interface)](#statereaderobservableeither-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
  - [evaluate](#evaluate)
  - [execute](#execute)
  - [filterOrElse](#filterorelse)
  - [fromEither](#fromeither)
  - [fromIO](#fromio)
  - [fromObservable](#fromobservable)
  - [fromOption](#fromoption)
  - [fromPredicate](#frompredicate)
  - [fromReaderObservableEither](#fromreaderobservableeither)
  - [fromTask](#fromtask)
  - [get](#get)
  - [gets](#gets)
  - [left](#left)
  - [modify](#modify)
  - [of](#of)
  - [put](#put)
  - [right](#right)
  - [throwError](#throwerror)
  - [~~stateReaderObservableEither~~](#statereaderobservableeither)

---

# Apply

## ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export declare const ap: <S, R, E, A>(
  fa: StateReaderObservableEither<S, R, E, A>
) => <B>(fab: StateReaderObservableEither<S, R, E, (a: A) => B>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# Bifunctor

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <S, R>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, B>
```

Added in v0.6.10

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, A>
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
) => <S, R, E>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# Monad

## chain

**Signature**

```ts
export declare const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# combinators

## apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export declare const apFirst: <S, R, E, B>(
  fb: StateReaderObservableEither<S, R, E, B>
) => <A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export declare const apSecond: <S, R, E, B>(
  fb: StateReaderObservableEither<S, R, E, B>
) => <A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

## chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export declare const chainFirst: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## flatten

Derivable from `Monad`.

**Signature**

```ts
export declare const flatten: <S, R, E, A>(
  mma: StateReaderObservableEither<S, R, E, StateReaderObservableEither<S, R, E, A>>
) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

# utils

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative4<'StateReaderObservableEither'>
```

Added in v0.6.12

## Apply

**Signature**

```ts
export declare const Apply: Apply4<'StateReaderObservableEither'>
```

Added in v0.6.12

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor4<'StateReaderObservableEither'>
```

Added in v0.6.12

## Functor

**Signature**

```ts
export declare const Functor: Functor4<'StateReaderObservableEither'>
```

Added in v0.6.12

## Monad

**Signature**

```ts
export declare const Monad: Monad4<'StateReaderObservableEither'>
```

Added in v0.6.12

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO4<'StateReaderObservableEither'>
```

Added in v0.6.12

## MonadObservable

**Signature**

```ts
export declare const MonadObservable: MonadObservable4<'StateReaderObservableEither'>
```

Added in v0.6.12

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask4<'StateReaderObservableEither'>
```

Added in v0.6.12

## MonadThrow

**Signature**

```ts
export declare const MonadThrow: MonadThrow4<'StateReaderObservableEither'>
```

Added in v0.6.12

## StateReaderObservableEither (interface)

**Signature**

```ts
export interface StateReaderObservableEither<S, R, E, A> {
  (s: S): ROBE.ReaderObservableEither<R, E, [A, S]>
}
```

Added in v0.6.10

## URI

**Signature**

```ts
export declare const URI: 'StateReaderObservableEither'
```

Added in v0.6.10

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.10

## bind

**Signature**

```ts
export declare function bind<K extends string, S, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
): (
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare function bindTo<K extends string>(
  name: K
): <S, R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, { [P in K]: A }>
```

Added in v0.6.11

## bindW

**Signature**

```ts
export declare const bindW: <K extends string, S, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderObservableEither<S, R1, E1, A>
) => StateReaderObservableEither<S, R1 & R2, E2 | E1, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.12

## evaluate

**Signature**

```ts
export declare function evaluate<S>(
  s: S
): <R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => ROBE.ReaderObservableEither<R, E, A>
```

Added in v0.6.10

## execute

**Signature**

```ts
export declare function execute<S>(
  s: S
): <R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => ROBE.ReaderObservableEither<R, E, S>
```

Added in v0.6.10

## filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderObservableEither<S, R, E, A>
  ) => StateReaderObservableEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderObservableEither<S, R, E, A>
  ) => StateReaderObservableEither<S, R, E, A>
}
```

Added in v0.6.10

## fromEither

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromEither: <S, R, E, A>(ma: E.Either<E, A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## fromIO

**Signature**

```ts
export declare function fromIO<S, R, E, A>(io: IO.IO<A>): StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## fromObservable

**Signature**

```ts
export declare function fromObservable<S, R, E, A>(observable: Observable<A>): StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromOption: <E>(
  onNone: () => E
) => <S, R, A>(ma: Option<A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    a: A
  ) => StateReaderObservableEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderObservableEither<S, R, E, A>
}
```

Added in v0.6.10

## fromReaderObservableEither

**Signature**

```ts
export declare const fromReaderObservableEither: <S, R, E, A>(
  ma: ROBE.ReaderObservableEither<R, E, A>
) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## fromTask

**Signature**

```ts
export declare function fromTask<S, R, E, A>(task: T.Task<A>): StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## get

**Signature**

```ts
export declare const get: <R, E, S>() => StateReaderObservableEither<S, R, E, S>
```

Added in v0.6.10

## gets

**Signature**

```ts
export declare const gets: <S, R, E, A>(f: (s: S) => A) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## left

**Signature**

```ts
export declare const left: <S, R, E = never, A = never>(e: E) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## modify

**Signature**

```ts
export declare const modify: <R, E, S>(f: (s: S) => S) => StateReaderObservableEither<S, R, E, void>
```

Added in v0.6.10

## of

**Signature**

```ts
export declare const of: <S, R, E, A>(a: A) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.12

## put

**Signature**

```ts
export declare const put: <R, E, S>(s: S) => StateReaderObservableEither<S, R, E, void>
```

Added in v0.6.10

## right

**Signature**

```ts
export declare const right: <S, R, E = never, A = never>(a: A) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## throwError

**Signature**

```ts
export declare function throwError<S, R, E, A>(e: E): StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

## ~~stateReaderObservableEither~~

**Signature**

```ts
export declare const stateReaderObservableEither: MonadObservable4<'StateReaderObservableEither'> &
  Bifunctor4<'StateReaderObservableEither'> &
  MonadThrow4<'StateReaderObservableEither'>
```

Added in v0.6.10
