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
- [URI](#uri)
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
- [filterOrElse](#filterorelse)
- [flatten](#flatten)
- [fold](#fold)
- [fromEither](#fromeither)
- [fromIO](#fromio)
- [fromIOEither](#fromioeither)
- [fromObservable](#fromobservable)
- [fromOption](#fromoption)
- [fromPredicate](#frompredicate)
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
- [tryCatch](#trycatch)
- [~~observableEither~~](#observableeither)

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

# Alt

**Signature**

```ts
export const Alt: Alt2<URI> = ...
```

Added in v0.6.12

# Applicative

**Signature**

```ts
export const Applicative: Applicative2<URI> = ...
```

Added in v0.6.12

# Apply

**Signature**

```ts
export const Apply: Apply2<URI> = ...
```

Added in v0.6.12

# Bifunctor

**Signature**

```ts
export const Bifunctor: Bifunctor2<URI> = ...
```

Added in v0.6.12

# Do

**Signature**

```ts
export const : ObservableEither<never, {}> = ...
```

Added in v0.6.12

# Functor

**Signature**

```ts
export const Functor: Functor2<URI> = ...
```

Added in v0.6.12

# Monad

**Signature**

```ts
export const Monad: Monad2<URI> = ...
```

Added in v0.6.12

# MonadIO

**Signature**

```ts
export const MonadIO: MonadIO2<URI> = ...
```

Added in v0.6.12

# MonadObservable

**Signature**

```ts
export const MonadObservable: MonadObservable2<URI> = ...
```

Added in v0.6.12

# MonadTask

**Signature**

```ts
export const MonadTask: MonadTask2<URI> = ...
```

Added in v0.6.12

# MonadThrow

**Signature**

```ts
export const MonadThrow: MonadThrow2<URI> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "ObservableEither" = ...
```

Added in v0.6.8

# alt

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

**Signature**

```ts
export const alt = <E, A>(
  that: () => ObservableEither<E, A>
): ((fa: ObservableEither<E, A>) => ObservableEither<E, A>) => ...
```

Added in v0.6.8

# ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export const ap = <E, A>(
  fa: ObservableEither<E, A>
): (<B>(fab: ObservableEither<E, (a: A) => B>) => ObservableEither<E, B>) =>
  flow(
    R.map(gab => (ga: E.Either<E, A>) => ...
```

Added in v0.6.0

# apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export const apFirst: <E, B>(
  fb: ObservableEither<E, B>
) => <A>(fa: ObservableEither<E, A>) => ObservableEither<E, A> = fb =>
  flow(
    map(a => () => ...
```

Added in v0.6.8

# apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export const apSecond = <E, B>(
  fb: ObservableEither<E, B>
): (<A>(fa: ObservableEither<E, A>) => ObservableEither<E, B>) =>
  flow(
    map(() => (b: B) => ...
```

Added in v0.6.8

# bimap

**Signature**

```ts
export const : <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: ObservableEither<E, A>) => ObservableEither<G, B> = ...
```

Added in v0.6.8

# bind

**Signature**

```ts
export const bind = <K extends string, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E, B>
): ((fa: ObservableEither<E, A>) => ObservableEither<E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ...
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export const bindTo = <K extends string, E, A>(
  name: K
): ((fa: ObservableEither<E, A>) => ObservableEither<E, { [P in K]: A }>) =>
  map(a => ...
```

Added in v0.6.11

# bindW

**Signature**

```ts
export const bindW: <K extends string, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => ObservableEither<E2, B>
) => <E1>(
  fa: ObservableEither<E1, A>
) => ObservableEither<E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = ...
```

Added in v0.6.12

# chain

**Signature**

```ts
export const chain = <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
): ((ma: ObservableEither<E, A>) => ObservableEither<E, B>) => ...
```

Added in v0.6.8

# chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export const chainFirst: <E, A, B>(
  f: (a: A) => ObservableEither<E, B>
) => (ma: ObservableEither<E, A>) => ObservableEither<E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => ...
```

Added in v0.6.8

# filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (
    ma: ObservableEither<E, A>
  ) => ObservableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: ObservableEither<E, A>) => ObservableEither<E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): ((ma: ObservableEither<E, A>) => ObservableEither<E, A>) =>
  chain(a => ...
```

Added in v0.6.10

# flatten

Derivable from `Monad`.

**Signature**

```ts
export const : <E, A>(mma: ObservableEither<E, ObservableEither<E, A>>) => ObservableEither<E, A> = ...
```

Added in v0.6.0

# fold

**Signature**

```ts
export const : <E, A, B>(onLeft: (e: E) => Observable<B>, onRight: (a: A) => Observable<B>) => (ma: ObservableEither<E, A>) => Observable<B> = ...
```

Added in v0.6.8

# fromEither

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromEither: <E, A>(ma: E.Either<E, A>) => ObservableEither<E, A> = ma => ...
```

Added in v0.6.10

# fromIO

**Signature**

```ts
export const fromIO: MonadIO2<URI>['fromIO'] = ...
```

Added in v0.6.12

# fromIOEither

**Signature**

```ts
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# fromObservable

**Signature**

```ts
export const fromObservable: MonadObservable2<URI>['fromObservable'] = ...
```

Added in v0.6.12

# fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromOption = <E>(onNone: () => E) => <A>(ma: Option<A>): ObservableEither<E, A> => ...
```

Added in v0.6.10

# fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => ObservableEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => ObservableEither<E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => (a: A): ObservableEither<E, A> => ...
```

Added in v0.6.10

# fromTask

**Signature**

```ts
export const : <E, A>(fa: Task<A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# fromTaskEither

**Signature**

```ts
export const fromTaskEither: <E, A>(t: TE.TaskEither<E, A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# getOrElse

**Signature**

```ts
export const getOrElse = <E, A>(onLeft: (e: E) => Observable<A>) => (ma: ObservableEither<E, A>): Observable<A> => ...
```

Added in v0.6.8

# left

**Signature**

```ts
export const : <E = never, A = never>(e: E) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# leftIO

**Signature**

```ts
export const : <E = never, A = never>(me: IO<E>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# leftObservable

**Signature**

```ts
export const : <E = never, A = never>(ma: Observable<E>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export const map: <A, B>(f: (a: A) => B) => <E>(fa: ObservableEither<E, A>) => ObservableEither<E, B> = f => ...
```

Added in v0.6.8

# mapLeft

**Signature**

```ts
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: ObservableEither<E, A>) => ObservableEither<G, A> = f => ...
```

Added in v0.6.8

# of

**Signature**

```ts
export const of: Applicative2<URI>['of'] = ...
```

Added in v0.6.12

# orElse

**Signature**

```ts
export const orElse: <E, A, M>(
  onLeft: (e: E) => ObservableEither<M, A>
) => (ma: ObservableEither<E, A>) => ObservableEither<M, A> = f => ...
```

Added in v0.6.8

# right

**Signature**

```ts
export const : <E = never, A = never>(a: A) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# rightIO

**Signature**

```ts
export const : <E = never, A = never>(ma: IO<A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# rightObservable

**Signature**

```ts
export const : <E = never, A = never>(ma: Observable<A>) => ObservableEither<E, A> = ...
```

Added in v0.6.8

# swap

**Signature**

```ts
export const : <E, A>(ma: ObservableEither<E, A>) => ObservableEither<A, E> = ...
```

Added in v0.6.8

# throwError

**Signature**

```ts
export const throwError: MonadThrow2<URI>['throwError'] = ...
```

Added in v0.6.12

# toTaskEither

**Signature**

```ts
export const toTaskEither = <E, A>(o: ObservableEither<E, A>): TE.TaskEither<E, A> => () => ...
```

Added in v0.6.8

# tryCatch

**Signature**

```ts
export const : <A>(a: Observable<A>) => ObservableEither<unknown, A> = ...
```

Added in v0.6.12

# ~~observableEither~~

**Signature**

```ts
export const observableEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadObservable2<URI> & MonadThrow2<URI> = ...
```

Added in v0.6.8
