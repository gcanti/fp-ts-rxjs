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
- [stateReaderObservableEither](#statereaderobservableeither)
- [throwError](#throwerror)

---

# StateReaderObservableEither (interface)

**Signature**

```ts
export interface StateReaderObservableEither<S, R, E, A> {
  (s: S): ROBE.ReaderObservableEither<R, E, [A, S]>
}
```

Added in v0.6.10

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.10

# URI

**Signature**

```ts
export const URI: "StateReaderObservableEither" = ...
```

Added in v0.6.10

# ap

**Signature**

```ts
<S, R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => <B>(fab: StateReaderObservableEither<S, R, E, (a: A) => B>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# apFirst

**Signature**

```ts
<S, R, E, B>(fb: StateReaderObservableEither<S, R, E, B>) => <A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

# apSecond

**Signature**

```ts
<S, R, E, B>(fb: StateReaderObservableEither<S, R, E, B>) => <A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# bimap

**Signature**

```ts
<E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => <S, R>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, B>
```

Added in v0.6.10

# bind

**Signature**

```ts
export function bind<K extends string, S, R, E, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => StateReaderObservableEither<S, R, E, B>
): (
  fa: StateReaderObservableEither<S, R, E, A>
) => StateReaderObservableEither<S, R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> { ... }
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export function bindTo<K extends string>(
  name: K
): <S, R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, { [P in K]: A }> { ... }
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
<S, R, E, A, B>(f: (a: A) => StateReaderObservableEither<S, R, E, B>) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# chainFirst

**Signature**

```ts
<S, R, E, A, B>(f: (a: A) => StateReaderObservableEither<S, R, E, B>) => (ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

# evaluate

**Signature**

```ts
export function evaluate<S>(
  s: S
): <R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => ROBE.ReaderObservableEither<R, E, A> { ... }
```

Added in v0.6.10

# execute

**Signature**

```ts
export function execute<S>(
  s: S
): <R, E, A>(fa: StateReaderObservableEither<S, R, E, A>) => ROBE.ReaderObservableEither<R, E, S> { ... }
```

Added in v0.6.10

# filterOrElse

**Signature**

```ts
{ <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>; <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(ma: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, A>; }
```

Added in v0.6.10

# flatten

**Signature**

```ts
<S, R, E, A>(mma: StateReaderObservableEither<S, R, E, StateReaderObservableEither<S, R, E, A>>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

# fromEither

**Signature**

```ts
<S, R, E, A>(ma: E.Either<E, A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

# fromIO

**Signature**

```ts
export function fromIO<S, R, E, A>(io: IO.IO<A>): StateReaderObservableEither<S, R, E, A> { ... }
```

Added in v0.6.10

# fromObservable

**Signature**

```ts
export function fromObservable<S, R, E, A>(observable: Observable<A>): StateReaderObservableEither<S, R, E, A> { ... }
```

Added in v0.6.10

# fromOption

**Signature**

```ts
<E>(onNone: () => E) => <S, R, A>(ma: Option<A>) => StateReaderObservableEither<S, R, E, A>
```

Added in v0.6.10

# fromPredicate

**Signature**

```ts
{ <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderObservableEither<S, R, E, B>; <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <S, R>(a: A) => StateReaderObservableEither<S, R, E, A>; }
```

Added in v0.6.10

# fromReaderObservableEither

**Signature**

```ts
export const fromReaderObservableEither: <S, R, E, A>(
  ma: ROBE.ReaderObservableEither<R, E, A>
) => StateReaderObservableEither<S, R, E, A> = ...
```

Added in v0.6.10

# fromTask

**Signature**

```ts
export function fromTask<S, R, E, A>(task: T.Task<A>): StateReaderObservableEither<S, R, E, A> { ... }
```

Added in v0.6.10

# get

**Signature**

```ts
export const get: <R, E, S>() => StateReaderObservableEither<S, R, E, S> = ...
```

Added in v0.6.10

# gets

**Signature**

```ts
export const gets: <S, R, E, A>(f: (s: S) => A) => StateReaderObservableEither<S, R, E, A> = ...
```

Added in v0.6.10

# left

**Signature**

```ts
export const left: <S, R, E = never, A = never>(e: E) => StateReaderObservableEither<S, R, E, A> = ...
```

Added in v0.6.10

# map

**Signature**

```ts
<A, B>(f: (a: A) => B) => <S, R, E>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, E, B>
```

Added in v0.6.10

# mapLeft

**Signature**

```ts
<E, G>(f: (e: E) => G) => <S, R, A>(fa: StateReaderObservableEither<S, R, E, A>) => StateReaderObservableEither<S, R, G, A>
```

Added in v0.6.10

# modify

**Signature**

```ts
export const modify: <R, E, S>(f: (s: S) => S) => StateReaderObservableEither<S, R, E, void> = ...
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
export const put: <R, E, S>(s: S) => StateReaderObservableEither<S, R, E, void> = ...
```

Added in v0.6.10

# right

**Signature**

```ts
export const right: <S, R, E = never, A = never>(a: A) => StateReaderObservableEither<S, R, E, A> = ...
```

Added in v0.6.10

# stateReaderObservableEither

**Signature**

```ts
export const stateReaderObservableEither: MonadObservable4<URI> & Bifunctor4<URI> & MonadThrow4<URI> = ...
```

Added in v0.6.10

# throwError

**Signature**

```ts
export function throwError<S, R, E, A>(e: E): StateReaderObservableEither<S, R, E, A> { ... }
```

Added in v0.6.10
