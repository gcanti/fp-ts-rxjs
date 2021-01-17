---
title: StateReaderObservableEither.ts
nav_order: 8
parent: Modules
---

# StateReaderObservableEither overview

Added in v0.6.10

---

<h2 class="text-delta">Table of contents</h2>

- [StateReaderObservableEither (interface)](#statereaderobservableeither-interface)
- [URI (type alias)](#uri-type-alias)
- [Applicative](#applicative)
- [Apply](#apply)
- [Bifunctor](#bifunctor)
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
- [bimap](#bimap)
- [bind](#bind)
- [bindTo](#bindto)
- [bindW](#bindw)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [evaluate](#evaluate)
- [execute](#execute)
- [filterOrElse](#filterorelse)
- [flatten](#flatten)
- [fromEither](#fromeither)
- [fromIO](#fromio)
- [fromObservable](#fromobservable)
- [fromOption](#fromoption)
- [fromPredicate](#frompredicate)
- [fromReaderObservableEither](#fromreaderobservableeither)
- [fromTask](#fromtask)
- [get](#get)
- [gets](#gets)
- [left](#left)
- [map](#map)
- [mapLeft](#mapleft)
- [modify](#modify)
- [of](#of)
- [put](#put)
- [right](#right)
- [throwError](#throwerror)
- [~~stateReaderObservableEither~~](#statereaderobservableeither)

---

# StateReaderObservableEither (interface)

**Signature**

```ts
export interface StateReaderObservableEither<S, R, E, A> {
  (s: S): ROE.ReaderObservableEither<R, E, [A, S]>
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
export const Applicative: Applicative4<URI> = ...
```

Added in v0.6.12

# Apply

**Signature**

```ts
export const Apply: Apply4<URI> = ...
```

Added in v0.6.12

# Bifunctor

**Signature**

```ts
export const Bifunctor: Bifunctor4<URI> = ...
```

Added in v0.6.12

# Functor

**Signature**

```ts
export const Functor: Functor4<URI> = ...
```

Added in v0.6.12

# Monad

**Signature**

```ts
export const Monad: Monad4<URI> = ...
```

Added in v0.6.12

# MonadIO

**Signature**

```ts
export const MonadIO: MonadIO4<URI> = ...
```

Added in v0.6.12

# MonadObservable

**Signature**

```ts
export const MonadObservable: MonadObservable4<URI> = ...
```

Added in v0.6.12

# MonadTask

**Signature**

```ts
export const MonadTask: MonadTask4<URI> = ...
```

Added in v0.6.12

# MonadThrow

**Signature**

```ts
export const MonadThrow: MonadThrow4<URI> = ...
```

Added in v0.6.12

# URI

**Signature**

```ts
export const URI: "StateReaderObservableEither" = ...
```

Added in v0.6.10

# ap

Apply a function to an argument under a type constructor.

**Signature**

```ts
export const ap: <S, R, E, A>(
  fa: StateReaderObservableEither<S, R, E, A>
) => <B>(
  fab: StateReaderObservableEither<S, R, E, (a: A) => B>
) => StateReaderObservableEither<S, R, E, B> = fa => fab => s1 =>
  pipe(
    fab(s1),
    ROE.chain(([f, s2]) =>
      pipe(
        fa(s2),
        ROE.map(([a, s3]) => ...
```

Added in v0.6.10

# apFirst

Combine two effectful actions, keeping only the result of the first.

Derivable from `Apply`.

**Signature**

```ts
export const apFirst: <S, R, E, B>(
  fb: StateReaderObservableEither<S, R, E, B>
) => <A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A> = fb =>
  flow(
    map(a => () => ...
```

Added in v0.6.10

# apSecond

Combine two effectful actions, keeping only the result of the second.

Derivable from `Apply`.

**Signature**

```ts
export const apSecond = <S, R, E, B>(
  fb: StateReaderObservableEither<S, R, E, B>
): (<A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>) =>
  flow(
    map(() => (b: B) => ...
```

Added in v0.6.10

# bimap

**Signature**

```ts
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <S, R>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, B> = (f, g) => fea => ...
```

Added in v0.6.10

# bind

**Signature**

```ts
export const bind = <K extends string, S, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
): ((
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
  chain(a =>
    pipe(
      f(a),
      map(b => ...
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export const bindTo = <K extends string>(name: K) => <S, R, E, A>(
  fa: StateReaderObservableEither<S, R, E, A>
): StateReaderObservableEither<S, R, E, { [P in K]: A }> =>
  pipe(
    fa,
    map(value => ...
```

Added in v0.6.11

# bindW

**Signature**

```ts
export const bindW: <K extends string, S, R2, E2, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderObservableEither<S, R1, E1, A>
) => StateReaderObservableEither<
  S,
  R1 & R2,
  E1 | E2,
  { [P in keyof A | K]: P extends keyof A ? A[P] : B }
> = ...
```

Added in v0.6.12

# chain

**Signature**

```ts
export const chain: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B> = f => ma => s1 =>
  pipe(
    ma(s1),
    ROE.chain(([a, s2]) => ...
```

Added in v0.6.10

# chainFirst

Composes computations in sequence, using the return value of one computation to determine the next computation and
keeping only the result of the first.

Derivable from `Monad`.

**Signature**

```ts
export const chainFirst: <S, R, E, A, B>(
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => ...
```

Added in v0.6.10

# evaluate

**Signature**

```ts
export const evaluate = <S>(s: S) => <R, E, A>(
  ma: StateReaderObservableEither<S, R, E, A>
): ROE.ReaderObservableEither<R, E, A> =>
  pipe(
    ma(s),
    ROE.map(([a]) => ...
```

Added in v0.6.10

# execute

**Signature**

```ts
export const execute = <S>(s: S) => <R, E, A>(
  ma: StateReaderObservableEither<S, R, E, A>
): ROE.ReaderObservableEither<R, E, S> =>
  pipe(
    ma(s),
    ROE.map(([_, s]) => ...
```

Added in v0.6.10

# filterOrElse

Derivable from `MonadThrow`.

**Signature**

```ts
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderObservableEither<S, R, E, A>
  ) => StateReaderObservableEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(
    ma: StateReaderObservableEither<S, R, E, A>
  ) => StateReaderObservableEither<S, R, E, A>
} = <E, A>(
  predicate: Predicate<A>,
  onFalse: (a: A) => E
): (<S, R>(ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>) =>
  chain(a => ...
```

Added in v0.6.10

# flatten

Derivable from `Monad`.

**Signature**

```ts
export const : <S, R, E, A>(mma: StateReaderObservableEither<S, R, E, StateReaderObservableEither<S, R, E, A>>) => StateReaderObservableEither<S, R, E, A> = ...
```

Added in v0.6.10

# fromEither

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromEither: <S, R, E, A>(ma: E.Either<E, A>) => StateReaderObservableEither<S, R, E, A> = ma => ...
```

Added in v0.6.10

# fromIO

**Signature**

```ts
export const fromIO: MonadIO4<URI>['fromIO'] = ma => ...
```

Added in v0.6.10

# fromObservable

**Signature**

```ts
export const fromObservable: MonadObservable4<URI>['fromObservable'] = ma => s => () =>
  pipe(
    ma,
    OB.map(a => ...
```

Added in v0.6.10

# fromOption

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromOption = <E>(onNone: () => E) => <S, R, A>(ma: Option<A>): StateReaderObservableEither<S, R, E, A> => ...
```

Added in v0.6.10

# fromPredicate

Derivable from `MonadThrow`.

**Signature**

```ts
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(
    a: A
  ) => StateReaderObservableEither<S, R, E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderObservableEither<S, R, E, A>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => <S, R>(a: A): StateReaderObservableEither<S, R, E, A> => ...
```

Added in v0.6.10

# fromReaderObservableEither

**Signature**

```ts
export const fromReaderObservableEither: <S, R, E, A>(
  ma: ROE.ReaderObservableEither<R, E, A>
) => StateReaderObservableEither<S, R, E, A> = fa => s =>
  pipe(
    fa,
    ROE.map(a => ...
```

Added in v0.6.10

# fromTask

**Signature**

```ts
export const fromTask: MonadTask4<URI>['fromTask'] = ma => ...
```

Added in v0.6.10

# get

**Signature**

```ts
export const get: <R, E, S>() => StateReaderObservableEither<S, R, E, S> = () => s => ...
```

Added in v0.6.10

# gets

**Signature**

```ts
export const gets: <S, R, E, A>(f: (s: S) => A) => StateReaderObservableEither<S, R, E, A> = f => s => ...
```

Added in v0.6.10

# left

**Signature**

```ts
export const left: <S, R, E = never, A = never>(e: E) => StateReaderObservableEither<S, R, E, A> = e => () => ...
```

Added in v0.6.10

# map

`map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
use the type constructor `F` to represent some computational context.

**Signature**

```ts
export const map: <A, B>(
  f: (a: A) => B
) => <S, R, E>(
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, B> = f => fa => s1 =>
  pipe(
    fa(s1),
    ROE.map(([a, s2]) => ...
```

Added in v0.6.10

# mapLeft

**Signature**

```ts
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <S, R, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, A> = f => fea => ...
```

Added in v0.6.10

# modify

**Signature**

```ts
export const modify: <R, E, S>(f: (s: S) => S) => StateReaderObservableEither<S, R, E, void> = f => s => ...
```

Added in v0.6.10

# of

**Signature**

```ts
export const of: Applicative4<URI>['of'] = ...
```

Added in v0.6.12

# put

**Signature**

```ts
export const put: <R, E, S>(s: S) => StateReaderObservableEither<S, R, E, void> = s => () => ...
```

Added in v0.6.10

# right

**Signature**

```ts
export const right: <S, R, E = never, A = never>(a: A) => StateReaderObservableEither<S, R, E, A> = a => s => ...
```

Added in v0.6.10

# throwError

**Signature**

```ts
export const throwError: MonadThrow4<URI>['throwError'] = ...
```

Added in v0.6.10

# ~~stateReaderObservableEither~~

**Signature**

```ts
export const stateReaderObservableEither: MonadObservable4<URI> & Bifunctor4<URI> & MonadThrow4<URI> = ...
```

Added in v0.6.10
