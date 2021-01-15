---
title: Observable.ts
nav_order: 3
parent: Modules
---

# Observable overview

Added in v0.6.0

---

<h2 class="text-delta">Table of contents</h2>

- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [alt](#alt)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [bind](#bind)
- [bindTo](#bindto)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [compact](#compact)
- [filter](#filter)
- [filterMap](#filtermap)
- [flatten](#flatten)
- [fromIO](#fromio)
- [fromOption](#fromoption)
- [fromTask](#fromtask)
- [getMonoid](#getmonoid)
- [map](#map)
- [observable](#observable)
- [of](#of)
- [partition](#partition)
- [partitionMap](#partitionmap)
- [separate](#separate)
- [toTask](#totask)

---

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.0

# URI

**Signature**

```ts
export const URI: "Observable" = ...
```

Added in v0.6.0

# alt

**Signature**

```ts
<A>(that: () => Observable<A>) => (fa: Observable<A>) => Observable<A>
```

Added in v0.6.0

# ap

**Signature**

```ts
<A>(fa: Observable<A>) => <B>(fab: Observable<(a: A) => B>) => Observable<B>
```

Added in v0.6.0

# apFirst

**Signature**

```ts
<B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<A>
```

Added in v0.6.0

# apSecond

**Signature**

```ts
<B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

# bind

**Signature**

```ts
export function bind<K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: (a: A) => Observable<B>
): (fa: Observable<A>) => Observable<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }> { ... }
```

Added in v0.6.11

# bindTo

**Signature**

```ts
export function bindTo<K extends string, A>(name: K): (fa: Observable<A>) => Observable<{ [P in K]: A }> { ... }
```

Added in v0.6.11

# chain

**Signature**

```ts
<A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<B>
```

Added in v0.6.0

# chainFirst

**Signature**

```ts
<A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<A>
```

Added in v0.6.0

# compact

**Signature**

```ts
<A>(fa: Observable<O.Option<A>>) => Observable<A>
```

Added in v0.6.0

# filter

**Signature**

```ts
{ <A, B>(refinement: Refinement<A, B>): (fa: Observable<A>) => Observable<B>; <A>(predicate: Predicate<A>): (fa: Observable<A>) => Observable<A>; }
```

Added in v0.6.0

# filterMap

**Signature**

```ts
<A, B>(f: (a: A) => O.Option<B>) => (fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

# flatten

**Signature**

```ts
<A>(mma: Observable<Observable<A>>) => Observable<A>
```

Added in v0.6.0

# fromIO

**Signature**

```ts
export function fromIO<A>(io: IO<A>): Observable<A> { ... }
```

Added in v0.6.5

# fromOption

**Signature**

```ts
export function fromOption<A>(o: O.Option<A>): Observable<A> { ... }
```

Added in v0.6.5

# fromTask

**Signature**

```ts
export function fromTask<A>(t: Task<A>): Observable<A> { ... }
```

Added in v0.6.5

# getMonoid

**Signature**

```ts
export function getMonoid<A = never>(): Monoid<Observable<A>> { ... }
```

Added in v0.6.0

# map

**Signature**

```ts
<A, B>(f: (a: A) => B) => (fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

# observable

**Signature**

```ts
export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> & MonadObservable1<URI> = ...
```

Added in v0.6.0

# of

**Signature**

```ts
export function of<A>(a: A): Observable<A> { ... }
```

Added in v0.6.6

# partition

**Signature**

```ts
{ <A, B>(refinement: Refinement<A, B>): (fa: Observable<A>) => Separated<Observable<A>, Observable<B>>; <A>(predicate: Predicate<A>): (fa: Observable<A>) => Separated<Observable<A>, Observable<A>>; }
```

Added in v0.6.0

# partitionMap

**Signature**

```ts
<A, B, C>(f: (a: A) => E.Either<B, C>) => (fa: Observable<A>) => Separated<Observable<B>, Observable<C>>
```

Added in v0.6.0

# separate

**Signature**

```ts
<A, B>(fa: Observable<E.Either<A, B>>) => Separated<Observable<A>, Observable<B>>
```

Added in v0.6.0

# toTask

**Signature**

```ts
export function toTask<A>(o: Observable<A>): Task<A> { ... }
```

Added in v0.6.5
