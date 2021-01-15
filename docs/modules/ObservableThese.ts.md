---
title: ObservableThese.ts
nav_order: 5
parent: Modules
---

# ObservableThese overview

Added in v0.6.12

---

<h2 class="text-delta">Table of contents</h2>

- [ObservableThese (interface)](#observablethese-interface)
- [URI (type alias)](#uri-type-alias)
- [Bifunctor](#bifunctor)
- [Functor](#functor)
- [URI](#uri)
- [bimap](#bimap)
- [both](#both)
- [fold](#fold)
- [fromIOEither](#fromioeither)
- [fromTask](#fromtask)
- [fromTaskThese](#fromtaskthese)
- [getApplicative](#getapplicative)
- [getMonad](#getmonad)
- [left](#left)
- [leftIO](#leftio)
- [leftObservable](#leftobservable)
- [map](#map)
- [mapLeft](#mapleft)
- [of](#of)
- [right](#right)
- [rightIO](#rightio)
- [rightObservable](#rightobservable)
- [swap](#swap)
- [toTaskThese](#totaskthese)

---

# ObservableThese (interface)

**Signature**

```ts
export interface ObservableThese<E, A> extends Observable<TH.These<E, A>> {}
```

Added in v0.6.12

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.12

# Bifunctor

**Signature**

```ts
export const Bifunctor: Bifunctor2<URI> = ...
```

Added in v0.6.12

# Functor

**Signature**

```ts
export const Functor: Functor2<URI> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "ObservableThese" = ...
```

Added in v0.6.12

# bimap

**Signature**

```ts
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: ObservableThese<E, A>) => ObservableThese<G, B> = (f, g) => fa => ...
```

Added in v0.6.12

# both

**Signature**

```ts
export const both: <E = never, A = never>(e: E, a: A) => ObservableThese<E, A> = ...
```

Added in v0.6.12

# fold

**Signature**

```ts
export function fold<E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>,
  onBoth: (e: E, a: A) => Observable<B>
): (ma: ObservableThese<E, A>) => Observable<B> { ... }
```

Added in v0.6.12

# fromIOEither

**Signature**

```ts
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableThese<E, A> = ...
```

Added in v0.6.12

# fromTask

**Signature**

```ts
export function fromTask<E, A>(ma: Task<A>): ObservableThese<E, A> { ... }
```

Added in v0.6.12

# fromTaskThese

**Signature**

```ts
export function fromTaskThese<E, A>(t: TT.TaskThese<E, A>): ObservableThese<E, A> { ... }
```

Added in v0.6.12

# getApplicative

**Signature**

```ts
export function getApplicative<E>(A: Apply1<R.URI>, SE: Semigroup<E>): Applicative2C<URI, E> { ... }
```

Added in v0.6.12

# getMonad

**Signature**

```ts
export function getMonad<E>(SE: Semigroup<E>): Monad2C<URI, E> { ... }
```

Added in v0.6.12

# left

**Signature**

```ts
export const left: <E = never, A = never>(e: E) => ObservableThese<E, A> = ...
```

Added in v0.6.12

# leftIO

**Signature**

```ts
export function leftIO<E, A>(me: IO<E>): ObservableThese<E, A> { ... }
```

Added in v0.6.12

# leftObservable

**Signature**

```ts
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableThese<E, A> = ...
```

Added in v0.6.12

# map

**Signature**

```ts
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableThese<E, A>) => ObservableThese<E, B> = f => fa => ...
```

Added in v0.6.12

# mapLeft

**Signature**

```ts
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableThese<E, A>) => ObservableThese<G, A> = f => fa => ...
```

Added in v0.6.12

# of

**Signature**

```ts
export const of: Applicative2<URI>['of'] = ...
```

Added in v0.6.12

# right

**Signature**

```ts
export const right: <E = never, A = never>(a: A) => ObservableThese<E, A> = ...
```

Added in v0.6.12

# rightIO

**Signature**

```ts
export function rightIO<E, A>(ma: IO<A>): ObservableThese<E, A> { ... }
```

Added in v0.6.12

# rightObservable

**Signature**

```ts
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableThese<E, A> = ...
```

Added in v0.6.12

# swap

**Signature**

```ts
export const swap: <E, A>(ma: ObservableThese<E, A>) => ObservableThese<A, E> = ...
```

Added in v0.6.12

# toTaskThese

**Signature**

```ts
export function toTaskThese<E, A>(o: ObservableThese<E, A>): TT.TaskThese<E, A> { ... }
```

Added in v0.6.12
