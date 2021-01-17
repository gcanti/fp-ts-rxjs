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
- [left](#left)
- [local](#local)
- [map](#map)
- [mapLeft](#mapleft)
- [of](#of)
- [right](#right)
- [throwError](#throwerror)
- [~~readerObservableEither~~](#readerobservableeither)

---

# ReaderObservableEither (interface)

**Signature**

```ts
export interface ReaderObservableEither<R, E, A> {
  (r: R): OE.ObservableEither<E, A>
}
```

Added in v0.6.10

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.10

# Applicative

**Signature**

```ts
export const Applicative: Applicative3<URI> = ...
```

Added in v0.6.12

# Apply

**Signature**

```ts
export const Apply: Apply3<URI> = ...
```

Added in v0.6.12

# Bifunctor

**Signature**

```ts
export const Bifunctor: Bifunctor3<URI> = ...
```

Added in v0.6.12

# Do

**Signature**

```ts
export const : ReaderObservableEither<unknown, never, {}> = ...
```

Added in v0.6.12

# Functor

**Signature**

```ts
export const Functor: Functor3<URI> = ...
```

Added in v0.6.12

# Monad

**Signature**

```ts
export const Monad: Monad3<URI> = ...
```

Added in v0.6.12

# MonadIO

**Signature**

```ts
export const MonadIO: MonadIO3<URI> = ...
```

Added in v0.6.12

# MonadObservable

**Signature**

```ts
export const MonadObservable: MonadObservable3<URI> = ...
```

Added in v0.6.12

# MonadTask

**Signature**

```ts
export const MonadTask: MonadTask3<URI> = ...
```

Added in v0.6.12

# MonadThrow

**Signature**

```ts
export const MonadThrow: MonadThrow3<URI> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "ReaderObservableEither" = ...
```

Added in v0.6.10

# ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export const ap: <R, E, A>(
  fa: ReaderObservableEither<R, E, A>
) => <B>(fab: ReaderObservableEither<R, E, (a: A) => B>) => ReaderObservableEither<R, E, B> = fa => fab => r => ...
```

Added in v0.6.10

# apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export const apFirst: <R, E, B>(
  fb: ReaderObservableEither<R, E, B>
) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = fb =>
  flow(
    map(a => () => ...
```

Added in v0.6.10

# apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export const apSecond = <R, E, B>(
  fb: ReaderObservableEither<R, E, B>
): (<A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>) =>
  flow(
    map(() => (b: B) => ...
```

Added in v0.6.10

# ask

**Signature**

```ts
export const ask: <R, E>() => ReaderObservableEither<R, E, R> = () => ...
```

Added in v0.6.10

# asks

**Signature**

```ts
export const asks: <R, E, A>(f: (r: R) => A) => ReaderObservableEither<R, E, A> = f => ...
```

Added in v0.6.10

# bimap

**Signature**

```ts
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, B> = (f, g) => fea => r => ...
```

Added in v0.6.10

# bind

**Signature**

```ts
export const bind = <K extends string, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ReaderObservableEither<R, E, B>
): ((
  fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ...
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export const bindTo = <K extends string, R, E, A>(
  name: K
): ((fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }>) =>
  map(a => ...
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
export const chain: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = f => fa => r =>
  pipe(
    fa(r),
    OE.chain(a => ...
```

Added in v0.6.10

# chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export const chainFirst: <R, E, A, B>(
  f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => ...
```

Added in v0.6.10

# filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
    ma: ReaderObservableEither<R, E, A>
  ) => ReaderObservableEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(
    ma: ReaderObservableEither<R, E, A>
  ) => ReaderObservableEither<R, E, A>
} = <E, A>(
  predicate: Predicate<A>,
  onFalse: (a: A) => E
): (<R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>) =>
  chain(a => ...
```

Added in v0.6.10

# flatten

Derivable from `Monad`.

**Signature**

```ts
export const : <R, E, A>(mma: ReaderObservableEither<R, E, ReaderObservableEither<R, E, A>>) => ReaderObservableEither<R, E, A> = ...
```

Added in v0.6.10

# fromEither

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromEither: <R, E, A>(ma: Either<E, A>) => ReaderObservableEither<R, E, A> = ma => ...
```

Added in v0.6.10

# fromIO

**Signature**

```ts
export const fromIO: MonadIO3<URI>['fromIO'] = ma => () => ...
```

Added in v0.6.10

# fromObservable

**Signature**

```ts
export const fromObservable: MonadObservable3<URI>['fromObservable'] = ma => () => ...
```

Added in v0.6.10

# fromObservableEither

**Signature**

```ts
export const fromObservableEither: <R, E, A>(ma: OE.ObservableEither<E, A>) => ReaderObservableEither<R, E, A> = ...
```

Added in v0.6.10

# fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromOption = <E>(onNone: () => E) => <R, A>(ma: Option<A>): ReaderObservableEither<R, E, A> => ...
```

Added in v0.6.10

# fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => <R>(a: A): ReaderObservableEither<R, E, A> => ...
```

Added in v0.6.10

# fromReader

**Signature**

```ts
export const fromReader: <R, E, A>(ma: R.Reader<R, A>) => ReaderObservableEither<R, E, A> = ma => ...
```

Added in v0.6.10

# fromTask

**Signature**

```ts
export const fromTask: MonadTask3<URI>['fromTask'] = ma => () => ...
```

Added in v0.6.10

# left

**Signature**

```ts
export const : <R, E = never, A = never>(e: E) => ReaderObservableEither<R, E, A> = ...
```

Added in v2.0.0

# local

**Signature**

```ts
export const local: <R2, R1>(
  f: (d: R2) => R1
) => <E, A>(ma: ReaderObservableEither<R1, E, A>) => ReaderObservableEither<R2, E, A> = ...
```

Added in v0.6.10

# map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export const map: <A, B>(
  f: (a: A) => B
) => <R, E>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = f => fa => ...
```

Added in v0.6.10

# mapLeft

**Signature**

```ts
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, A> = f => fea => r => ...
```

Added in v0.6.10

# of

**Signature**

```ts
export const of: Applicative3<URI>['of'] = ...
```

Added in v0.6.10

# right

**Signature**

```ts
export const : <R, E = never, A = never>(a: A) => ReaderObservableEither<R, E, A> = ...
```

Added in v2.0.0

# throwError

**Signature**

```ts
export const throwError: MonadThrow3<URI>['throwError'] = e => () => ...
```

Added in v0.6.10

# ~~readerObservableEither~~

**Signature**

```ts
export const readerObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = ...
```

Added in v0.6.10
