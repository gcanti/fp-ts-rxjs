---
title: ObservableEither.ts
nav_order: 4
parent: Modules
---

## ObservableEither overview

Added in v0.6.8

---

<h2 class="text-delta">Table of contents</h2>

- [Alt](#alt)
  - [alt](#alt)
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
  - [orElse](#orelse)
  - [swap](#swap)
- [constructors](#constructors)
  - [fromIO](#fromio)
  - [fromIOEither](#fromioeither)
  - [fromObservable](#fromobservable)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
  - [left](#left)
  - [leftIO](#leftio)
  - [leftObservable](#leftobservable)
  - [right](#right)
  - [rightIO](#rightio)
  - [rightObservable](#rightobservable)
  - [tryCatch](#trycatch)
- [destructors](#destructors)
  - [fold](#fold)
  - [getOrElse](#getorelse)
- [instances](#instances)
  - [Alt](#alt-1)
  - [Applicative](#applicative)
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
  - [~~observableEither~~](#observableeither)
- [model](#model)
  - [ObservableEither (interface)](#observableeither-interface)
- [utils](#utils)
  - [Do](#do)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
  - [filterOrElse](#filterorelse)
  - [fromEither](#fromeither)
  - [fromOption](#fromoption)
  - [fromPredicate](#frompredicate)
  - [of](#of)
  - [toTaskEither](#totaskeither)

---

# Alt

## alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export declare const alt: <E, A>(
  that: () => ObservableEither<E, A>
) => (fa: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

# Apply

## ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export declare const ap: <E, A>(
  fa: ObservableEither<E, A>
) => <B>(fab: ObservableEither<E, (a: A) => B>) => ObservableEither<E, B>
```

Added in v0.6.0

# Bifunctor

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableEither<E, A>) => ObservableEither<G, B>
```

Added in v0.6.8

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableEither<E, A>) => ObservableEither<G, A>
```

Added in v0.6.8

# Functor

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

# Monad

## chain

**Signature**

```ts
export declare const chain: <A, E, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

## chainW

Less strict version of [`chain`](#chain).

**Signature**

```ts
export declare const chainW: <A, E2, B>(
  f: (a: A) => ObservableEither<E2, B>
) => <E1>(ma: ObservableEither<E1, A>) => ObservableEither<E2 | E1, B>
```

Added in v0.6.12

# MonadThrow

## throwError

**Signature**

```ts
export declare const throwError: <E, A>(e: E) => ObservableEither<E, A>
```

Added in v0.6.12

# combinators

## apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export declare const apFirst: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export declare const apSecond: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

## chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export declare const chainFirst: <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## flatten

Derivable from `Monad`.

**Signature**

```ts
export declare const flatten: <E, A>(mma: ObservableEither<E, ObservableEither<E, A>>) => ObservableEither<E, A>
```

Added in v0.6.0

## liftOperator

Lifts an OperatorFunction into an ObservableEither context
Allows e.g. filter to be used on on ObservableEither

**Signature**

```ts
export declare function liftOperator<E, A, B>(
  f: OperatorFunction<A, B>
): (obs: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.12

## orElse

**Signature**

```ts
export declare const orElse: <E, A, M>(
  onLeft: (e: E) => ObservableEither<M, A>
) => (ma: ObservableEither<E, A>) => ObservableEither<M, A>
```

Added in v0.6.8

## swap

**Signature**

```ts
export declare const swap: <E, A>(ma: ObservableEither<E, A>) => ObservableEither<A, E>
```

Added in v0.6.8

# constructors

## fromIO

**Signature**

```ts
export declare const fromIO: <E, A>(fa: IO<A>) => ObservableEither<E, A>
```

Added in v0.6.12

## fromIOEither

**Signature**

```ts
export declare const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## fromObservable

**Signature**

```ts
export declare const fromObservable: <E, A>(fa: Observable<A>) => ObservableEither<E, A>
```

Added in v0.6.12

## fromTask

**Signature**

```ts
export declare const fromTask: <E, A>(fa: Task<A>) => ObservableEither<E, A>
```

Added in v0.6.8

## fromTaskEither

**Signature**

```ts
export declare const fromTaskEither: <E, A>(t: TE.TaskEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## left

**Signature**

```ts
export declare const left: <E = never, A = never>(e: E) => ObservableEither<E, A>
```

Added in v0.6.8

## leftIO

**Signature**

```ts
export declare const leftIO: <E = never, A = never>(me: IO<E>) => ObservableEither<E, A>
```

Added in v0.6.8

## leftObservable

**Signature**

```ts
export declare const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableEither<E, A>
```

Added in v0.6.8

## right

**Signature**

```ts
export declare const right: <E = never, A = never>(a: A) => ObservableEither<E, A>
```

Added in v0.6.8

## rightIO

**Signature**

```ts
export declare const rightIO: <E = never, A = never>(ma: IO<A>) => ObservableEither<E, A>
```

Added in v0.6.8

## rightObservable

**Signature**

```ts
export declare const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableEither<E, A>
```

Added in v0.6.8

## tryCatch

**Signature**

```ts
export declare const tryCatch: <A>(a: Observable<A>) => ObservableEither<unknown, A>
```

Added in v0.6.12

# destructors

## fold

**Signature**

```ts
export declare const fold: <E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>
) => (ma: ObservableEither<E, A>) => Observable<B>
```

Added in v0.6.8

## getOrElse

**Signature**

```ts
export declare const getOrElse: <E, A>(onLeft: (e: E) => Observable<A>) => (ma: ObservableEither<E, A>) => Observable<A>
```

Added in v0.6.8

# instances

## Alt

**Signature**

```ts
export declare const Alt: Alt2<'ObservableEither'>
```

Added in v0.6.12

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative2<'ObservableEither'>
```

Added in v0.6.12

## Apply

**Signature**

```ts
export declare const Apply: Apply2<'ObservableEither'>
```

Added in v0.6.12

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor2<'ObservableEither'>
```

Added in v0.6.12

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'ObservableEither'>
```

Added in v0.6.12

## Monad

**Signature**

```ts
export declare const Monad: Monad2<'ObservableEither'>
```

Added in v0.6.12

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO2<'ObservableEither'>
```

Added in v0.6.12

## MonadObservable

**Signature**

```ts
export declare const MonadObservable: MonadObservable2<'ObservableEither'>
```

Added in v0.6.12

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask2<'ObservableEither'>
```

Added in v0.6.12

## MonadThrow

**Signature**

```ts
export declare const MonadThrow: MonadThrow2<'ObservableEither'>
```

Added in v0.6.12

## URI

**Signature**

```ts
export declare const URI: 'ObservableEither'
```

Added in v0.6.8

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.8

## ~~observableEither~~

**Signature**

```ts
export declare const observableEither: Monad2<'ObservableEither'> &
  Bifunctor2<'ObservableEither'> &
  Alt2<'ObservableEither'> &
  MonadObservable2<'ObservableEither'> &
  MonadThrow2<'ObservableEither'>
```

Added in v0.6.8

# model

## ObservableEither (interface)

**Signature**

```ts
export interface ObservableEither<E, A> extends Observable<E.Either<E, A>> {}
```

Added in v0.6.8

# utils

## Do

**Signature**

```ts
export declare const Do: ObservableEither<never, {}>
```

Added in v0.6.12

## bind

**Signature**

```ts
export declare const bind: <K extends string, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E, B>
) => (fa: ObservableEither<E, A>) => ObservableEither<E, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare const bindTo: <K extends string, E, A>(
  name: K
) => (fa: ObservableEither<E, A>) => ObservableEither<E, { [P in K]: A }>
```

Added in v0.6.11

## bindW

**Signature**

```ts
export declare const bindW: <K extends string, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E2, B>
) => <E1>(
  fa: ObservableEither<E1, A>
) => ObservableEither<E2 | E1, { [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.12

## filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (
    ma: ObservableEither<E, A>
  ) => ObservableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: ObservableEither<E, A>) => ObservableEither<E, A>
}
```

Added in v0.6.10

## fromEither

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromEither: <E, A>(ma: E.Either<E, A>) => ObservableEither<E, A>
```

Added in v0.6.10

## fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromOption: <E>(onNone: () => E) => <A>(ma: Option<A>) => ObservableEither<E, A>
```

Added in v0.6.10

## fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => ObservableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => ObservableEither<E, A>
}
```

Added in v0.6.10

## of

**Signature**

```ts
export declare const of: <E, A>(a: A) => ObservableEither<E, A>
```

Added in v0.6.12

## toTaskEither

**Signature**

```ts
export declare const toTaskEither: <E, A>(o: ObservableEither<E, A>) => TE.TaskEither<E, A>
```

Added in v0.6.8
