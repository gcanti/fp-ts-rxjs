---
title: ObservableOption.ts
nav_order: 5
parent: Modules
---

## ObservableOption overview

Added in v0.6.14

---

<h2 class="text-delta">Table of contents</h2>

- [Alt](#alt)
  - [alt](#alt)
- [Apply](#apply)
  - [ap](#ap)
- [Functor](#functor)
  - [map](#map)
- [Monad](#monad)
  - [chain](#chain)
- [combinators](#combinators)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chainFirst](#chainfirst)
  - [flatten](#flatten)
  - [orElse](#orelse)
- [constructors](#constructors)
  - [fromIO](#fromio)
  - [fromObservable](#fromobservable)
  - [fromTask](#fromtask)
  - [none](#none)
  - [some](#some)
  - [someIO](#someio)
  - [someObservable](#someobservable)
  - [tryCatch](#trycatch)
- [destructors](#destructors)
  - [fold](#fold)
  - [getOrElse](#getorelse)
- [instances](#instances)
  - [Alt](#alt-1)
  - [Applicative](#applicative)
  - [Apply](#apply-1)
  - [Functor](#functor-1)
  - [Monad](#monad-1)
  - [MonadIO](#monadio)
  - [MonadObservable](#monadobservable)
  - [MonadTask](#monadtask)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [~~observableOption~~](#observableoption)
- [model](#model)
  - [ObservableOption (interface)](#observableoption-interface)
- [utils](#utils)
  - [Do](#do)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [filterOrElse](#filterorelse)
  - [fromOption](#fromoption)
  - [fromPredicate](#frompredicate)
  - [of](#of)

---

# Alt

## alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export declare const alt: <A>(that: () => ObservableOption<A>) => (fa: ObservableOption<A>) => ObservableOption<A>
```

Added in v0.6.14

# Apply

## ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export declare const ap: <A>(fa: ObservableOption<A>) => <B>(fab: ObservableOption<(a: A) => B>) => ObservableOption<B>
```

Added in v0.6.14

# Functor

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: ObservableOption<A>) => ObservableOption<B>
```

Added in v0.6.14

# Monad

## chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => ObservableOption<B>) => (ma: ObservableOption<A>) => ObservableOption<B>
```

Added in v0.6.14

# combinators

## apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export declare const apFirst: <B>(fb: ObservableOption<B>) => <A>(fa: ObservableOption<A>) => ObservableOption<A>
```

Added in v0.6.14

## apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export declare const apSecond: <B>(fb: ObservableOption<B>) => <A>(fa: ObservableOption<A>) => ObservableOption<B>
```

Added in v0.6.14

## chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export declare const chainFirst: <A, B>(
  f: (a: A) => ObservableOption<B>
) => (ma: ObservableOption<A>) => ObservableOption<A>
```

Added in v0.6.14

## flatten

Derivable from `Monad`.

**Signature**

```ts
export declare const flatten: <A>(mma: ObservableOption<ObservableOption<A>>) => ObservableOption<A>
```

Added in v0.6.14

## orElse

**Signature**

```ts
export declare const orElse: <A>(onNone: () => ObservableOption<A>) => (ma: ObservableOption<A>) => ObservableOption<A>
```

Added in v0.6.14

# constructors

## fromIO

**Signature**

```ts
export declare const fromIO: <A>(fa: IO<A>) => ObservableOption<A>
```

Added in v0.6.14

## fromObservable

**Signature**

```ts
export declare const fromObservable: <A>(fa: Observable<A>) => ObservableOption<A>
```

Added in v0.6.14

## fromTask

**Signature**

```ts
export declare const fromTask: <A>(fa: Task<A>) => ObservableOption<A>
```

Added in v0.6.14

## none

**Signature**

```ts
export declare const none: ObservableOption<never>
```

Added in v0.6.14

## some

**Signature**

```ts
export declare const some: <A = never>(a: A) => ObservableOption<A>
```

Added in v0.6.14

## someIO

**Signature**

```ts
export declare const someIO: <A = never>(ma: IO<A>) => ObservableOption<A>
```

Added in v0.6.14

## someObservable

**Signature**

```ts
export declare const someObservable: <A = never>(ma: Observable<A>) => ObservableOption<A>
```

Added in v0.6.14

## tryCatch

**Signature**

```ts
export declare const tryCatch: <A>(a: Observable<A>) => ObservableOption<A>
```

Added in v0.6.14

# destructors

## fold

**Signature**

```ts
export declare const fold: <A, B>(
  onNone: () => Observable<B>,
  onSome: (a: A) => Observable<B>
) => (ma: ObservableOption<A>) => Observable<B>
```

Added in v0.6.14

## getOrElse

**Signature**

```ts
export declare const getOrElse: <A>(onNone: () => Observable<A>) => (ma: ObservableOption<A>) => Observable<A>
```

Added in v0.6.14

# instances

## Alt

**Signature**

```ts
export declare const Alt: Alt1<'ObservableOption'>
```

Added in v0.6.14

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative1<'ObservableOption'>
```

Added in v0.6.14

## Apply

**Signature**

```ts
export declare const Apply: Apply1<'ObservableOption'>
```

Added in v0.6.14

## Functor

**Signature**

```ts
export declare const Functor: Functor1<'ObservableOption'>
```

Added in v0.6.14

## Monad

**Signature**

```ts
export declare const Monad: Monad1<'ObservableOption'>
```

Added in v0.6.14

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO1<'ObservableOption'>
```

Added in v0.6.14

## MonadObservable

**Signature**

```ts
export declare const MonadObservable: MonadObservable1<'ObservableOption'>
```

Added in v0.6.14

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask1<'ObservableOption'>
```

Added in v0.6.14

## URI

**Signature**

```ts
export declare const URI: 'ObservableOption'
```

Added in v0.6.14

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.14

## ~~observableOption~~

**Signature**

```ts
export declare const observableOption: Monad1<'ObservableOption'> &
  Alt1<'ObservableOption'> &
  MonadObservable1<'ObservableOption'>
```

Added in v0.6.14

# model

## ObservableOption (interface)

**Signature**

```ts
export interface ObservableOption<A> extends Observable<O.Option<A>> {}
```

Added in v0.6.14

# utils

## Do

**Signature**

```ts
export declare const Do: ObservableOption<{}>
```

Added in v0.6.14

## bind

**Signature**

```ts
export declare const bind: <K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableOption<B>
) => (fa: ObservableOption<A>) => ObservableOption<{ [P in K | keyof A]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.14

## bindTo

**Signature**

```ts
export declare const bindTo: <K extends string, A>(
  name: K
) => (fa: ObservableOption<A>) => ObservableOption<{ [P in K]: A }>
```

Added in v0.6.14

## filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const filterOrElse: {
  <A, B extends A>(refinement: Refinement<A, B>): (ma: ObservableOption<A>) => ObservableOption<B>
  <A>(predicate: Predicate<A>): (ma: ObservableOption<A>) => ObservableOption<A>
}
```

Added in v0.6.14

## fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromOption: <A>(ma: O.Option<A>) => ObservableOption<A>
```

Added in v0.6.14

## fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export declare const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => ObservableOption<B>
  <A>(predicate: Predicate<A>): (a: A) => ObservableOption<A>
}
```

Added in v0.6.14

## of

**Signature**

```ts
export declare const of: <A>(a: A) => ObservableOption<A>
```

Added in v0.6.14
