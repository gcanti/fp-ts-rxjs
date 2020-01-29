---
title: ReaderObservable.ts
nav_order: 4
parent: Modules
---

# ReaderObservable overview

Added in v0.6.6

---

<h2 class="text-delta">Table of contents</h2>

- [ReaderObservable (interface)](#readerobservable-interface)
- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [ask (constant)](#ask-constant)
- [asks (constant)](#asks-constant)
- [fromObservable (constant)](#fromobservable-constant)
- [fromReader (constant)](#fromreader-constant)
- [of (constant)](#of-constant)
- [readerObservable (constant)](#readerobservable-constant)
- [chainIOK (function)](#chainiok-function)
- [chainTaskK (function)](#chaintaskk-function)
- [fromIO (function)](#fromio-function)
- [fromIOK (function)](#fromiok-function)
- [fromObservableK (function)](#fromobservablek-function)
- [fromTask (function)](#fromtask-function)
- [getMonoid (function)](#getmonoid-function)
- [local (function)](#local-function)
- [run (function)](#run-function)
- [ap (export)](#ap-export)
- [apFirst (export)](#apfirst-export)
- [apSecond (export)](#apsecond-export)
- [chain (export)](#chain-export)
- [chainFirst (export)](#chainfirst-export)
- [flatten (export)](#flatten-export)
- [map (export)](#map-export)

---

# ReaderObservable (interface)

**Signature**

```ts
export interface ReaderObservable<R, A> {
  (r: R): Observable<A>
}
```

Added in v0.6.6

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.6

# URI (constant)

**Signature**

```ts
export const URI: "ReaderObservable" = ...
```

Added in v0.6.6

# ask (constant)

**Signature**

```ts
export const ask: <R>() => ReaderObservable<R, R> = ...
```

Added in v0.6.6

# asks (constant)

**Signature**

```ts
export const asks: <R, A = ...
```

Added in v0.6.6

# fromObservable (constant)

**Signature**

```ts
export const fromObservable: <R, A>(ma: Observable<A>) => ReaderObservable<R, A> = ...
```

Added in v0.6.6

# fromReader (constant)

**Signature**

```ts
export const fromReader: <R, A = ...
```

Added in v0.6.6

# of (constant)

**Signature**

```ts
export const of: <R, A>(a: A) => ReaderObservable<R, A> = ...
```

Added in v0.6.6

# readerObservable (constant)

**Signature**

```ts
export const readerObservable: Monad2<URI> & MonadObservable2<URI> = ...
```

Added in v0.6.6

# chainIOK (function)

**Signature**

```ts
export function chainIOK<A, B>(f: (a: A) => IO<B>): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# chainTaskK (function)

**Signature**

```ts
export function chainTaskK<A, B>(
  f: (a: A) => Observable<B>
): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# fromIO (function)

**Signature**

```ts
export function fromIO<R, A>(ma: IO<A>): ReaderObservable<R, A> { ... }
```

Added in v0.6.6

# fromIOK (function)

**Signature**

```ts
export function fromIOK<A extends Array<unknown>, B>(f: (...a: A) => IO<B>): <R>(...a: A) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# fromObservableK (function)

**Signature**

```ts
export function fromObservableK<A extends Array<unknown>, B>(
  f: (...a: A) => Observable<B>
): <R>(...a: A) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# fromTask (function)

**Signature**

```ts
export function fromTask<R, A>(ma: Task<A>): ReaderObservable<R, A> { ... }
```

Added in v0.6.6

# getMonoid (function)

**Signature**

```ts
export function getMonoid<R, A>(): Monoid<ReaderObservable<R, A>> { ... }
```

Added in v0.6.6

# local (function)

**Signature**

```ts
export function local<Q, R>(f: (f: Q) => R): <A>(ma: ReaderObservable<R, A>) => ReaderObservable<Q, A> { ... }
```

Added in v0.6.6

# run (function)

**Signature**

```ts
export function run<R, A>(ma: ReaderObservable<R, A>, r: R): Promise<A> { ... }
```

Added in v0.6.6

# ap (export)

**Signature**

```ts
<E, A>(fa: ReaderObservable<E, A>) => <B>(fab: ReaderObservable<E, (a: A) => B>) => ReaderObservable<E, B>
```

Added in v0.6.6

# apFirst (export)

**Signature**

```ts
<E, B>(fb: ReaderObservable<E, B>) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.6

# apSecond (export)

**Signature**

```ts
<E, B>(fb: ReaderObservable<E, B>) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# chain (export)

**Signature**

```ts
<E, A, B>(f: (a: A) => ReaderObservable<E, B>) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# chainFirst (export)

**Signature**

```ts
<E, A, B>(f: (a: A) => ReaderObservable<E, B>) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.6

# flatten (export)

**Signature**

```ts
<E, A>(mma: ReaderObservable<E, ReaderObservable<E, A>>) => ReaderObservable<E, A>
```

Added in v0.6.6

# map (export)

**Signature**

```ts
<A, B>(f: (a: A) => B) => <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6
