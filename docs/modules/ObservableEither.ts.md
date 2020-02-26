---
title: ObservableEither.ts
nav_order: 4
parent: Modules
---

# ObservableEither overview

Added in v0.6.8

---

<h2 class="text-delta">Table of contents</h2>

- [ObservableEither (interface)](#observableeither-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [alt](#alt)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [bimap](#bimap)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [flatten](#flatten)
- [fold](#fold)
- [fromIOEither](#fromioeither)
- [fromTask](#fromtask)
- [fromTaskEither](#fromtaskeither)
- [getOrElse](#getorelse)
- [left](#left)
- [leftIO](#leftio)
- [leftObservable](#leftobservable)
- [map](#map)
- [mapLeft](#mapleft)
- [observableEither](#observableeither)
- [orElse](#orelse)
- [right](#right)
- [rightIO](#rightio)
- [rightObservable](#rightobservable)
- [swap](#swap)
- [toTaskEither](#totaskeither)

---

# ObservableEither (interface)

**Signature**

```ts
export interface ObservableEither<E, A> extends Observable<E.Either<E, A>> {}
```

Added in v0.6.8

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.8

# URI

**Signature**

```ts
export const URI: "ObservableEither" = ...
```

Added in v0.6.8

# alt

**Signature**

```ts
<E, A>(that: () => ObservableEither<E, A>) => (fa: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

# ap

**Signature**

```ts
<E, A>(fa: ObservableEither<E, A>) => <B>(fab: ObservableEither<E, (a: A) => B>) => ObservableEither<E, B>
```

Added in v0.6.8

# apFirst

**Signature**

```ts
<E, B>(fb: ObservableEither<E, B>) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

# apSecond

**Signature**

```ts
<E, B>(fb: ObservableEither<E, B>) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

# bimap

**Signature**

```ts
<E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: ObservableEither<E, A>) => ObservableEither<G, B>
```

Added in v0.6.8

# chain

**Signature**

```ts
<E, A, B>(f: (a: A) => ObservableEither<E, B>) => (ma: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

# chainFirst

**Signature**

```ts
<E, A, B>(f: (a: A) => ObservableEither<E, B>) => (ma: ObservableEither<E, A>) => ObservableEither<E, A>
```

Added in v0.6.8

# flatten

**Signature**

```ts
<E, A>(mma: ObservableEither<E, ObservableEither<E, A>>) => ObservableEither<E, A>
```

Added in v0.6.8

# fold

**Signature**

```ts
export function fold<E, A, B>(
  onLeft: (e: E) => Observable<B>,
  onRight: (a: A) => Observable<B>
): (ma: ObservableEither<E, A>) => Observable<B> { ... }
```

Added in v0.6.8

# fromIOEither

**Signature**

```ts
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# fromTask

**Signature**

```ts
export function fromTask<E, A>(ma: Task<A>): ObservableEither<E, A> { ... }
```

Added in v0.6.8

# fromTaskEither

**Signature**

```ts
export function fromTaskEither<E, A>(t: TE.TaskEither<E, A>): ObservableEither<E, A> { ... }
```

Added in v0.6.8

# getOrElse

**Signature**

```ts
export function getOrElse<E, A>(onLeft: (e: E) => Observable<A>): (ma: ObservableEither<E, A>) => Observable<A> { ... }
```

Added in v0.6.8

# left

**Signature**

```ts
export const left: <E = never, A = never>(e: E) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# leftIO

**Signature**

```ts
export function leftIO<E, A>(me: IO<E>): ObservableEither<E, A> { ... }
```

Added in v0.6.8

# leftObservable

**Signature**

```ts
export const leftObservable: <E = never, A = never>(ma: Observable<E>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# map

**Signature**

```ts
<A, B>(f: (a: A) => B) => <E>(fa: ObservableEither<E, A>) => ObservableEither<E, B>
```

Added in v0.6.8

# mapLeft

**Signature**

```ts
<E, G>(f: (e: E) => G) => <A>(fa: ObservableEither<E, A>) => ObservableEither<G, A>
```

Added in v0.6.8

# observableEither

**Signature**

```ts
export const observableEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadObservable2<URI> & MonadThrow2<URI> = ...
```

Added in v0.6.8

# orElse

**Signature**

```ts
export function orElse<E, A, M>(
  onLeft: (e: E) => ObservableEither<M, A>
): (ma: ObservableEither<E, A>) => ObservableEither<M, A> { ... }
```

Added in v0.6.8

# right

**Signature**

```ts
export const right: <E = never, A = never>(a: A) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# rightIO

**Signature**

```ts
export function rightIO<E, A>(ma: IO<A>): ObservableEither<E, A> { ... }
```

Added in v0.6.8

# rightObservable

**Signature**

```ts
export const rightObservable: <E = never, A = never>(ma: Observable<A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# swap

**Signature**

```ts
export const swap: <E, A>(ma: ObservableEither<E, A>) => ObservableEither<A, E> = ...
```

Added in v0.6.8

# toTaskEither

**Signature**

```ts
export function toTaskEither<E, A>(o: ObservableEither<E, A>): TE.TaskEither<E, A> { ... }
```

Added in v0.6.8
