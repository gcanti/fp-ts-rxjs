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

Added in v0.6.0

# URI (constant)

**Signature**

```ts
export const URI = ...
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
