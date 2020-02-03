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
- [URI](#uri)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [ask](#ask)
- [asks](#asks)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [chainIOK](#chainiok)
- [chainTaskK](#chaintaskk)
- [flatten](#flatten)
- [fromIO](#fromio)
- [fromIOK](#fromiok)
- [fromObservable](#fromobservable)
- [fromObservableK](#fromobservablek)
- [fromOption](#fromoption)
- [fromReader](#fromreader)
- [fromTask](#fromtask)
- [getMonoid](#getmonoid)
- [local](#local)
- [map](#map)
- [of](#of)
- [readerObservable](#readerobservable)
- [run](#run)
- [toReaderTask](#toreadertask)

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

# URI

**Signature**

```ts
export const URI: "ReaderObservable" = ...
```

Added in v0.6.6

# ap

**Signature**

```ts
<E, A>(fa: ReaderObservable<E, A>) => <B>(fab: ReaderObservable<E, (a: A) => B>) => ReaderObservable<E, B>
```

Added in v0.6.6

# apFirst

**Signature**

```ts
<E, B>(fb: ReaderObservable<E, B>) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.6

# apSecond

**Signature**

```ts
<E, B>(fb: ReaderObservable<E, B>) => <A>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# ask

**Signature**

```ts
export const ask: <R>() => ReaderObservable<R, R> = ...
```

Added in v0.6.6

# asks

**Signature**

```ts
export const asks: <R, A = never>(f: (r: R) => A) => ReaderObservable<R, A> = ...
```

Added in v0.6.6

# chain

**Signature**

```ts
<E, A, B>(f: (a: A) => ReaderObservable<E, B>) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# chainFirst

**Signature**

```ts
<E, A, B>(f: (a: A) => ReaderObservable<E, B>) => (ma: ReaderObservable<E, A>) => ReaderObservable<E, A>
```

Added in v0.6.6

# chainIOK

**Signature**

```ts
export function chainIOK<A, B>(f: (a: A) => IO<B>): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# chainTaskK

**Signature**

```ts
export function chainTaskK<A, B>(
  f: (a: A) => Observable<B>
): <R>(ma: ReaderObservable<R, A>) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# flatten

**Signature**

```ts
<E, A>(mma: ReaderObservable<E, ReaderObservable<E, A>>) => ReaderObservable<E, A>
```

Added in v0.6.6

# fromIO

**Signature**

```ts
export function fromIO<R, A>(ma: IO<A>): ReaderObservable<R, A> { ... }
```

Added in v0.6.6

# fromIOK

**Signature**

```ts
export function fromIOK<A extends Array<unknown>, B>(f: (...a: A) => IO<B>): <R>(...a: A) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# fromObservable

**Signature**

```ts
export const fromObservable: <R, A>(ma: Observable<A>) => ReaderObservable<R, A> = ...
```

Added in v0.6.6

# fromObservableK

**Signature**

```ts
export function fromObservableK<A extends Array<unknown>, B>(
  f: (...a: A) => Observable<B>
): <R>(...a: A) => ReaderObservable<R, B> { ... }
```

Added in v2.4.0

# fromOption

**Signature**

```ts
export function fromOption<R, A>(o: Option<A>): ReaderObservable<R, A> { ... }
```

Added in v0.6.6

# fromReader

**Signature**

```ts
export const fromReader: <R, A = never>(ma: Reader<R, A>) => ReaderObservable<R, A> = ...
```

Added in v0.6.6

# fromTask

**Signature**

```ts
export function fromTask<R, A>(ma: Task<A>): ReaderObservable<R, A> { ... }
```

Added in v0.6.6

# getMonoid

**Signature**

```ts
export function getMonoid<R, A>(): Monoid<ReaderObservable<R, A>> { ... }
```

Added in v0.6.6

# local

**Signature**

```ts
export function local<Q, R>(f: (f: Q) => R): <A>(ma: ReaderObservable<R, A>) => ReaderObservable<Q, A> { ... }
```

Added in v0.6.6

# map

**Signature**

```ts
<A, B>(f: (a: A) => B) => <E>(fa: ReaderObservable<E, A>) => ReaderObservable<E, B>
```

Added in v0.6.6

# of

**Signature**

```ts
export const of: <R, A>(a: A) => ReaderObservable<R, A> = ...
```

Added in v0.6.6

# readerObservable

**Signature**

```ts
export const readerObservable: Monad2<URI> & MonadObservable2<URI> = ...
```

Added in v0.6.6

# run

**Signature**

```ts
export function run<R, A>(ma: ReaderObservable<R, A>, r: R): Promise<A> { ... }
```

Added in v0.6.6

# toReaderTask

**Signature**

```ts
export function toReaderTask<R, A>(ma: ReaderObservable<R, A>): ReaderTask<R, A> { ... }
```

Added in v0.6.6
