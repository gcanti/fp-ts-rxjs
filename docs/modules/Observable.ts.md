---
title: Observable.ts
nav_order: 3
parent: Modules
---

## Observable overview

Added in v0.6.0

---

<h2 class="text-delta">Table of contents</h2>

- [Alt](#alt)
  - [alt](#alt)
- [Alternative](#alternative)
  - [zero](#zero)
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
  - [flatten](#flatten)
- [constructors](#constructors)
  - [fromIO](#fromio)
  - [fromOption](#fromoption)
  - [fromTask](#fromtask)
- [instances](#instances)
  - [Alt](#alt-1)
  - [Alternative](#alternative-1)
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
  - [~~observable~~](#observable)
- [utils](#utils)
  - [Do](#do)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [toTask](#totask)
  - [toTaskOption](#totaskoption)

---

# Alt

## alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export declare const alt: <A>(that: () => any) => (fa: any) => any
```

Added in v0.6.0

# Alternative

## zero

**Signature**

```ts
export declare const zero: <A>() => any
```

Added in v0.6.12

# Applicative

## of

**Signature**

```ts
export declare const of: <A>(a: A) => any
```

Added in v0.6.6

# Apply

## ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export declare const ap: <A>(fa: any) => <B>(fab: any) => any
```

Added in v0.6.0

# Compactable

## compact

**Signature**

```ts
export declare const compact: <A>(fa: any) => any
```

Added in v0.6.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(fa: any) => Separated<any, any>
```

Added in v0.6.0

# Filterable

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: any) => any
  <A>(predicate: Predicate<A>): (fa: any) => any
}
```

Added in v0.6.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => O.Option<B>) => (fa: any) => any
```

Added in v0.6.0

## partition

**Signature**

```ts
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: any) => Separated<any, any>
  <A>(predicate: Predicate<A>): (fa: any) => Separated<any, any>
}
```

Added in v0.6.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(f: (a: A) => E.Either<B, C>) => (fa: any) => Separated<any, any>
```

Added in v0.6.0

# Functor

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: any) => any
```

Added in v0.6.0

# Monad

## chain

Composes computations in sequence, using the return value of one computation to determine the next computation.

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => any) => (ma: any) => any
```

Added in v0.6.0

# combinators

## apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export declare const apFirst: <B>(fb: any) => <A>(fa: any) => any
```

Added in v0.6.0

## apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export declare const apSecond: <B>(fb: any) => <A>(fa: any) => any
```

Added in v0.6.0

## chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => any) => (ma: any) => any
```

Added in v0.6.0

## flatten

Derivable from `Monad`.

**Signature**

```ts
export declare const flatten: <A>(mma: any) => any
```

Added in v0.6.0

# constructors

## fromIO

**Signature**

```ts
export declare const fromIO: <A>(fa: IO<A>) => any
```

Added in v0.6.5

## fromOption

**Signature**

```ts
export declare const fromOption: <A>(o: O.Option<A>) => any
```

Added in v0.6.5

## fromTask

**Signature**

```ts
export declare const fromTask: <A>(fa: Task<A>) => any
```

Added in v0.6.5

# instances

## Alt

**Signature**

```ts
export declare const Alt: Alt1<'Observable'>
```

Added in v0.6.12

## Alternative

**Signature**

```ts
export declare const Alternative: Alternative1<'Observable'>
```

Added in v0.6.12

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative1<'Observable'>
```

Added in v0.6.12

## Apply

**Signature**

```ts
export declare const Apply: Apply1<'Observable'>
```

Added in v0.6.12

## Compactable

**Signature**

```ts
export declare const Compactable: Compactable1<'Observable'>
```

Added in v0.6.12

## Filterable

**Signature**

```ts
export declare const Filterable: Filterable1<'Observable'>
```

Added in v0.6.12

## Functor

**Signature**

```ts
export declare const Functor: Functor1<'Observable'>
```

Added in v0.6.12

## Monad

**Signature**

```ts
export declare const Monad: Monad1<'Observable'>
```

Added in v0.6.12

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO1<'Observable'>
```

Added in v0.6.12

## MonadObservable

**Signature**

```ts
export declare const MonadObservable: MonadObservable1<'Observable'>
```

Added in v0.6.12

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask1<'Observable'>
```

Added in v0.6.12

## URI

**Signature**

```ts
export declare const URI: 'Observable'
```

Added in v0.6.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.0

## getMonoid

**Signature**

```ts
export declare const getMonoid: <A = never>() => Monoid<any>
```

Added in v0.6.0

## ~~observable~~

**Signature**

```ts
export declare const observable: Monad1<'Observable'> &
  Alternative1<'Observable'> &
  Filterable1<'Observable'> &
  MonadObservable1<'Observable'>
```

Added in v0.6.0

# utils

## Do

**Signature**

```ts
export declare const Do: any
```

Added in v0.6.12

## bind

**Signature**

```ts
export declare const bind: <K extends string, A, B>(name: Exclude<K, keyof A>, f: (a: A) => any) => (fa: any) => any
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare const bindTo: <K extends string, A>(name: K) => (fa: any) => any
```

Added in v0.6.11

## toTask

**Signature**

```ts
export declare const toTask: <A>(o: any) => Task<A>
```

Added in v0.6.5

## toTaskOption

**Signature**

```ts
export declare const toTaskOption: <A>(o: any) => Task<O.Option<A>>
```

Added in v0.6.15
