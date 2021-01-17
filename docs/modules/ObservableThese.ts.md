---
title: ObservableThese.ts
nav_order: 5
parent: Modules
---

## ObservableThese overview

Added in v0.6.12

---

<h2 class="text-delta">Table of contents</h2>

- [Applicative](#applicative)
  - [of](#of)
- [Bifunctor](#bifunctor)
  - [bimap](#bimap)
  - [mapLeft](#mapleft)
- [Functor](#functor)
  - [map](#map)
- [combinators](#combinators)
  - [swap](#swap)
- [constructors](#constructors)
  - [both](#both)
  - [fromIO](#fromio)
  - [fromIOEither](#fromioeither)
  - [fromTask](#fromtask)
  - [fromTaskThese](#fromtaskthese)
  - [left](#left)
  - [leftIO](#leftio)
  - [leftObservable](#leftobservable)
  - [right](#right)
  - [rightIO](#rightio)
  - [rightObservable](#rightobservable)
- [destructors](#destructors)
  - [fold](#fold)
- [instances](#instances)
  - [Bifunctor](#bifunctor-1)
  - [getApplicative](#getapplicative)
  - [getMonad](#getmonad)
- [model](#model)
  - [ObservableThese (interface)](#observablethese-interface)
- [utils](#utils)
  - [Functor](#functor-1)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [toTaskThese](#totaskthese)

---

# Applicative

## of

**Signature**

```ts
export declare const of: <E, A>(a: A) => ObservableThese<E, A>
```

Added in v0.6.12

# Bifunctor

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableThese<E, A>) => ObservableThese<G, B>
```

Added in v0.6.12

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableThese<E, A>) => ObservableThese<G, A>
```

Added in v0.6.12

# Functor

## map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableThese<E, A>) => ObservableThese<E, B>
```

Added in v0.6.12

# combinators

## swap

**Signature**

```ts
export declare const swap: <E, A>(ma: ObservableThese<E, A>) => ObservableThese<A, E>
```

Added in v0.6.12

# constructors

## both

**Signature**

```ts
export declare const both: <E = never, A = never>(e: E, a: A) => ObservableThese<E, A>
```

Added in v0.6.12

## fromIO

**Signature**

```ts
export declare const fromIO: <E, A>(fa: IO<A>) => ObservableThese<E, A>
```

Added in v0.6.12

## fromIOEither

**Signature**

```ts
export declare const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableThese<E, A>
```

Added in v0.6.12

## fromTask

**Signature**

```ts
export declare const fromTask: <E, A>(fa: Task<A>) => ObservableThese<E, A>
```

Added in v0.6.12

## fromTaskThese

**Signature**

```ts
export declare const fromTaskThese: <E, A>(t: TT.TaskThese<E, A>) => ObservableThese<E, A>
```

Added in v0.6.12

## left

**Signature**

```ts
export declare const left: <E = never, A = never>(e: E) => ObservableThese<E, A>
```

Added in v0.6.12

## leftIO

**Signature**

```ts
export declare const leftIO: <E = never, A = never>(me: IO<E>) => ObservableThese<E, A>
```

Added in v0.6.12

## leftObservable

**Signature**

```ts
export declare const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableThese<E, A>
```

Added in v0.6.12

## right

**Signature**

```ts
export declare const right: <E = never, A = never>(a: A) => ObservableThese<E, A>
```

Added in v0.6.12

## rightIO

**Signature**

```ts
export declare const rightIO: <E = never, A = never>(ma: IO<A>) => ObservableThese<E, A>
```

Added in v0.6.12

## rightObservable

**Signature**

```ts
export declare const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableThese<E, A>
```

Added in v0.6.12

# destructors

## fold

**Signature**

```ts
export declare const fold: <E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>,
  onBoth: (e: E, a: A) => Observable<B>
) => (ma: ObservableThese<E, A>) => Observable<B>
```

Added in v0.6.12

# instances

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor2<'ObservableThese'>
```

Added in v0.6.12

## getApplicative

**Signature**

```ts
export declare const getApplicative: <E>(
  A: Apply1<'Observable'>,
  S: Semigroup<E>
) => Applicative2C<'ObservableThese', E>
```

Added in v0.6.12

## getMonad

**Signature**

```ts
export declare const getMonad: <E>(S: Semigroup<E>) => Monad2C<'ObservableThese', E>
```

Added in v0.6.12

# model

## ObservableThese (interface)

**Signature**

```ts
export interface ObservableThese<E, A> extends Observable<TH.These<E, A>> {}
```

Added in v0.6.12

# utils

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'ObservableThese'>
```

Added in v0.6.12

## URI

**Signature**

```ts
export declare const URI: 'ObservableThese'
```

Added in v0.6.12

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.12

## toTaskThese

**Signature**

```ts
export declare const toTaskThese: <E, A>(o: ObservableThese<E, A>) => TT.TaskThese<E, A>
```

Added in v0.6.12
