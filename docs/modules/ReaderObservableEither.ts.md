---
title: ReaderObservableEither.ts
nav_order: 7
parent: Modules
---

# ReaderObservableEither overview

Added in v0.6.10

---

<h2 class="text-delta">Table of contents</h2>

- [ReaderObservableEither (interface)](#readerobservableeither-interface)
- [URI (type alias)](#uri-type-alias)
- [Do](#do)
- [URI](#uri)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [ask](#ask)
- [asks](#asks)
- [bimap](#bimap)
- [bind](#bind)
- [bindTo](#bindto)
- [bindW](#bindw)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [filterOrElse](#filterorelse)
- [flatten](#flatten)
- [fromEither](#fromeither)
- [fromIO](#fromio)
- [fromObservable](#fromobservable)
- [fromObservableEither](#fromobservableeither)
- [fromOption](#fromoption)
- [fromPredicate](#frompredicate)
- [fromReader](#fromreader)
- [fromTask](#fromtask)
- [local](#local)
- [map](#map)
- [mapLeft](#mapleft)
- [of](#of)
- [readerObservableEither](#readerobservableeither)
- [throwError](#throwerror)

---

# ReaderObservableEither (interface)

**Signature**

```ts
export interface ReaderObservableEither<R, E, A> {
  (r: R): OBE.ObservableEither<E, A>
}
```

Added in v0.6.10

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.10

# Do

**Signature**

```ts
export const : ReaderObservableEither<unknown, never, {}> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "ReaderObservableEither" = ...
```

Added in v0.6.10

# ap

**Signature**

```ts
<R, E, A>(fa: ReaderObservableEither<R, E, A>) => <B>(fab: ReaderObservableEither<R, E, (a: A) => B>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# apFirst

**Signature**

```ts
<R, E, B>(fb: ReaderObservableEither<R, E, B>) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

# apSecond

**Signature**

```ts
<R, E, B>(fb: ReaderObservableEither<R, E, B>) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# ask

**Signature**

```ts
export function ask<R, E>(): ReaderObservableEither<R, E, R> { ... }
```

Added in v0.6.10

# asks

**Signature**

```ts
export function asks<R, E, A>(f: (r: R) => A): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# bimap

**Signature**

```ts
<E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => <R>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, B>
```

Added in v0.6.10

# bind

**Signature**

```ts
export function bind<K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
): (
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> { ... }
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export function bindTo<K extends string, R, E, A>(
  name: K
): (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }> { ... }
```

Added in v0.6.11

# bindW

**Signature**

```ts
export const bindW: <K extends string, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(
  fa: ReaderObservableEither<R1, E1, A>
) => ReaderObservableEither<R1 & R2, E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = ...
```

Added in v0.6.12

# chain

**Signature**

```ts
<R, E, A, B>(f: (a: A) => ReaderObservableEither<R, E, B>) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# chainFirst

**Signature**

```ts
<R, E, A, B>(f: (a: A) => ReaderObservableEither<R, E, B>) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

# filterOrElse

**Signature**

```ts
{ <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>; <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>; }
```

Added in v0.6.10

# flatten

**Signature**

```ts
<R, E, A>(mma: ReaderObservableEither<R, E, ReaderObservableEither<R, E, A>>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

# fromEither

**Signature**

```ts
<R, E, A>(ma: Either<E, A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

# fromIO

**Signature**

```ts
export function fromIO<R, E, A>(a: IO.IO<A>): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# fromObservable

**Signature**

```ts
export function fromObservable<R, E, A>(a: Observable<A>): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# fromObservableEither

**Signature**

```ts
export function fromObservableEither<R, E, A>(ma: OBE.ObservableEither<E, A>): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# fromOption

**Signature**

```ts
<E>(onNone: () => E) => <R, A>(ma: Option<A>) => ReaderObservableEither<R, E, A>
```

Added in v0.6.10

# fromPredicate

**Signature**

```ts
{ <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <U>(a: A) => ReaderObservableEither<U, E, B>; <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, A>; }
```

Added in v0.6.10

# fromReader

**Signature**

```ts
export function fromReader<R, E, A>(ma: R.Reader<R, A>): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# fromTask

**Signature**

```ts
export function fromTask<R, E, A>(a: T.Task<A>): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# local

**Signature**

```ts
export function local<R, Q>(
  f: (d: Q) => R
): <E, A>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<Q, E, A> { ... }
```

Added in v0.6.10

# map

**Signature**

```ts
<A, B>(f: (a: A) => B) => <R, E>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>
```

Added in v0.6.10

# mapLeft

**Signature**

```ts
<E, G>(f: (e: E) => G) => <R, A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, A>
```

Added in v0.6.10

# of

**Signature**

```ts
export function of<R, E, A>(a: A): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# readerObservableEither

**Signature**

```ts
export const readerObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = ...
```

Added in v0.6.10

# throwError

**Signature**

```ts
export function throwError<R, E, A>(e: E): ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10
