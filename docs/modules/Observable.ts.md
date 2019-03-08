---
title: Observable.ts
nav_order: 2
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [observable (constant)](#observable-constant)
- [getMonoid (function)](#getmonoid-function)

---

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

# URI (constant)

**Signature**

```ts
export const URI = ...
```

# observable (constant)

**Signature**

```ts
export const observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> = ...
```

# getMonoid (function)

**Signature**

```ts
export const getMonoid = <A = never>(): Monoid<Observable<A>> => ...
```
