---
title: ObservableEither.ts
nav_order: 4
parent: Modules
---

## ObservableEither overview

Added in v0.6.8

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Alt](#alt)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Bifunctor](#bifunctor)
  - [Do](#do)
  - [Functor](#functor)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [MonadObservable](#monadobservable)
  - [MonadTask](#monadtask)
  - [MonadThrow](#monadthrow)
  - [ObservableEither (interface)](#observableeither-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [alt](#alt)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [bimap](#bimap)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
  - [chain](#chain)
  - [chainFirst](#chainfirst)
  - [flatten](#flatten)
  - [fold](#fold)
  - [fromIO](#fromio)
  - [fromIOEither](#fromioeither)
  - [fromObservable](#fromobservable)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
  - [getOrElse](#getorelse)
  - [left](#left)
  - [leftIO](#leftio)
  - [leftObservable](#leftobservable)
  - [map](#map)
  - [mapLeft](#mapleft)
  - [of](#of)
  - [orElse](#orelse)
  - [right](#right)
  - [rightIO](#rightio)
  - [rightObservable](#rightobservable)
  - [swap](#swap)
  - [throwError](#throwerror)
  - [toTaskEither](#totaskeither)
  - [~~observableEither~~](#observableeither)

---

# utils

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

## Do

**Signature**

```ts
export declare const Do: ObservableEither<never, {}>
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

## ObservableEither (interface)

**Signature**

```ts
export interface ObservableEither<E, A> extends Observable<E.Either<E, A>> {}
```

Added in v0.6.8

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

## alt

**Signature**

```ts
export declare const alt: <E, A>(
  that: () => ObservableEither<E, A>
) => (fa: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## ap

**Signature**

```ts
export declare const ap: <E, A>(
  fa: ObservableEither<E, A>
) => <B>(fab: ObservableEither<E, (a: A) => B>) => ObservableEither<E, B>
```

Added in v0.6.8

## apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableEither<E, A>) => ObservableEither<G, B>
```

Added in v0.6.8

## bind

**Signature**

```ts
export declare function bind<K extends string, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E, B>
): (fa: ObservableEither<E, A>) => ObservableEither<E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>
```

Added in v0.6.11

## bindTo

**Signature**

```ts
export declare function bindTo<K extends string, E, A>(
  name: K
): (fa: ObservableEither<E, A>) => ObservableEither<E, { [P in K]: A }>
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

## chain

**Signature**

```ts
export declare const chain: <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

## chainFirst

**Signature**

```ts
export declare const chainFirst: <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

## flatten

**Signature**

```ts
export declare const flatten: <E, A>(mma: ObservableEither<E, ObservableEither<E, A>>) => ObservableEither<E, A>
```

Added in v0.6.8

## fold

**Signature**

```ts
export declare function fold<E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>
): (ma: ObservableEither<E, A>) => Observable<B>
```

Added in v0.6.8

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
export declare function fromTask<E, A>(ma: Task<A>): ObservableEither<E, A>
```

Added in v0.6.8

## fromTaskEither

**Signature**

```ts
export declare function fromTaskEither<E, A>(t: TE.TaskEither<E, A>): ObservableEither<E, A>
```

Added in v0.6.8

## getOrElse

**Signature**

```ts
export declare function getOrElse<E, A>(onLeft: (e: E) => Observable<A>): (ma: ObservableEither<E, A>) => Observable<A>
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
export declare function leftIO<E, A>(me: IO<E>): ObservableEither<E, A>
```

Added in v0.6.8

## leftObservable

**Signature**

```ts
export declare const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableEither<E, A>
```

Added in v0.6.8

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableEither<E, A>) => ObservableEither<G, A>
```

Added in v0.6.8

## of

**Signature**

```ts
export declare const of: <E, A>(a: A) => ObservableEither<E, A>
```

Added in v0.6.12

## orElse

**Signature**

```ts
export declare function orElse<E, A, M>(
  onLeft: (e: E) => ObservableEither<M, A>
): (ma: ObservableEither<E, A>) => ObservableEither<M, A>
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
export declare function rightIO<E, A>(ma: IO<A>): ObservableEither<E, A>
```

Added in v0.6.8

## rightObservable

**Signature**

```ts
export declare const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableEither<E, A>
```

Added in v0.6.8

## swap

**Signature**

```ts
export declare const swap: <E, A>(ma: ObservableEither<E, A>) => ObservableEither<A, E>
```

Added in v0.6.8

## throwError

**Signature**

```ts
export declare const throwError: <E, A>(e: E) => ObservableEither<E, A>
```

Added in v0.6.12

## toTaskEither

**Signature**

```ts
export declare function toTaskEither<E, A>(o: ObservableEither<E, A>): TE.TaskEither<E, A>
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
