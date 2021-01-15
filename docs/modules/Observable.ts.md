---
title: Observable.ts
nav_order: 3
parent: Modules
---

## Observable overview

Added in v0.6.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
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
  - [URI (type alias)](#uri-type-alias)
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

# utils

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

## Do

**Signature**

```ts
export declare const Do: Observable<{}>
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

## alt

**Signature**

```ts
export declare const alt: <A>(that: () => Observable<A>) => (fa: Observable<A>) => Observable<A>
```

Added in v0.6.0

## ap

**Signature**

```ts
export declare const ap: <A>(fa: Observable<A>) => <B>(fab: Observable<(a: A) => B>) => Observable<B>
```

Added in v0.6.0

## apFirst

**Signature**

```ts
export declare const apFirst: <B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<A>
```

Added in v0.6.0

## apSecond

**Signature**

```ts
export declare const apSecond: <B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

## bind

**Signature**

```ts
export declare function bind<K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => Observable<B>
): (fa: Observable<A>) => Observable<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare function bindTo<K extends string, A>(name: K): (fa: Observable<A>) => Observable<{ [P in K]: A }>
```

Added in v0.6.11

## chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<B>
```

Added in v0.6.0

## chainFirst

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<A>
```

Added in v0.6.0

## compact

**Signature**

```ts
export declare const compact: <A>(fa: Observable<O.Option<A>>) => Observable<A>
```

Added in v0.6.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B>(refinement: Refinement<A, B>): (fa: Observable<A>) => Observable<B>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Observable<A>
}
```

Added in v0.6.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => O.Option<B>) => (fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(mma: Observable<Observable<A>>) => Observable<A>
```

Added in v0.6.0

## fromIO

**Signature**

```ts
export declare function fromIO<A>(io: IO<A>): Observable<A>
```

Added in v0.6.5

## fromOption

**Signature**

```ts
export declare function fromOption<A>(o: O.Option<A>): Observable<A>
```

Added in v0.6.5

## fromTask

**Signature**

```ts
export declare function fromTask<A>(t: Task<A>): Observable<A>
```

Added in v0.6.5

## getMonoid

**Signature**

```ts
export declare function getMonoid<A = never>(): Monoid<Observable<A>>
```

Added in v0.6.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => Observable<A>
```

Added in v0.6.6

## partition

**Signature**

```ts
export declare const partition: {
  <A, B>(refinement: Refinement<A, B>): (fa: Observable<A>) => Separated<Observable<A>, Observable<B>>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Separated<Observable<A>, Observable<A>>
}
```

Added in v0.6.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => E.Either<B, C>
) => (fa: Observable<A>) => Separated<Observable<B>, Observable<C>>
```

Added in v0.6.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(fa: Observable<E.Either<A, B>>) => Separated<Observable<A>, Observable<B>>
```

Added in v0.6.0

## toTask

**Signature**

```ts
export declare function toTask<A>(o: Observable<A>): Task<A>
```

Added in v0.6.5

## zero

**Signature**

```ts
export declare const zero: <A>() => Observable<A>
```

Added in v0.6.12

## ~~observable~~

**Signature**

```ts
export declare const observable: Monad1<'Observable'> &
  Alternative1<'Observable'> &
  Filterable1<'Observable'> &
  MonadObservable1<'Observable'>
```

Added in v0.6.0
