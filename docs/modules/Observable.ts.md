---
title: Observable.ts
nav_order: 2
parent: Modules
---

# Observable overview

Added in v0.6.0

---

<h2 class="text-delta">Table of contents</h2>

- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [observable (constant)](#observable-constant)
- [getMonoid (function)](#getmonoid-function)
- [alt (export)](#alt-export)
- [ap (export)](#ap-export)
- [apFirst (export)](#apfirst-export)
- [apSecond (export)](#apsecond-export)
- [chain (export)](#chain-export)
- [chainFirst (export)](#chainfirst-export)
- [compact (export)](#compact-export)
- [filter (export)](#filter-export)
- [filterMap (export)](#filtermap-export)
- [flatten (export)](#flatten-export)
- [map (export)](#map-export)
- [partition (export)](#partition-export)
- [partitionMap (export)](#partitionmap-export)
- [separate (export)](#separate-export)

---

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.6.0

# URI (constant)

**Signature**

```ts
export const URI: "Observable" = ...
```

Added in v0.6.0

# observable (constant)

**Signature**

```ts
export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> = ...
```

Added in v0.6.0

# getMonoid (function)

**Signature**

```ts
export function getMonoid<A = never>(): Monoid<Observable<A>> { ... }
```

Added in v0.6.0

# alt (export)

**Signature**

```ts
<A>(that: () => Observable<A>) => (fa: Observable<A>) => Observable<A>
```

Added in v0.6.0

# ap (export)

**Signature**

```ts
<A>(fa: Observable<A>) => <B>(fab: Observable<(a: A) => B>) => Observable<B>
```

Added in v0.6.0

# apFirst (export)

**Signature**

```ts
<B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<A>
```

Added in v0.6.0

# apSecond (export)

**Signature**

```ts
<B>(fb: Observable<B>) => <A>(fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

# chain (export)

**Signature**

```ts
<A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<B>
```

Added in v0.6.0

# chainFirst (export)

**Signature**

```ts
<A, B>(f: (a: A) => Observable<B>) => (ma: Observable<A>) => Observable<A>
```

Added in v0.6.0

# compact (export)

**Signature**

```ts
<A>(fa: Observable<O.Option<A>>) => Observable<A>
```

Added in v0.6.0

# filter (export)

**Signature**

```ts
{ <A, B>(refinement: Refinement<A, B>): (fa: Observable<A>) => Observable<B>; <A>(predicate: Predicate<A>): (fa: Observable<A>) => Observable<A>; }
```

Added in v0.6.0

# filterMap (export)

**Signature**

```ts
<A, B>(f: (a: A) => O.Option<B>) => (fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

# flatten (export)

**Signature**

```ts
<A>(mma: Observable<Observable<A>>) => Observable<A>
```

Added in v0.6.0

# map (export)

**Signature**

```ts
<A, B>(f: (a: A) => B) => (fa: Observable<A>) => Observable<B>
```

Added in v0.6.0

# partition (export)

**Signature**

```ts
{ <A, B>(refinement: Refinement<A, B>): (fa: Observable<A>) => Separated<Observable<A>, Observable<B>>; <A>(predicate: Predicate<A>): (fa: Observable<A>) => Separated<Observable<A>, Observable<A>>; }
```

Added in v0.6.0

# partitionMap (export)

**Signature**

```ts
<A, B, C>(f: (a: A) => E.Either<B, C>) => (fa: Observable<A>) => Separated<Observable<B>, Observable<C>>
```

Added in v0.6.0

# separate (export)

**Signature**

```ts
<A, B>(fa: Observable<E.Either<A, B>>) => Separated<Observable<A>, Observable<B>>
```

Added in v0.6.0
