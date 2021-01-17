---
title: MonadObservable.ts
nav_order: 2
parent: Modules
---

## MonadObservable overview

Lift a computation from the `Observable` monad

Added in v0.6.6

---

<h2 class="text-delta">Table of contents</h2>

- [type classes](#type-classes)
  - [MonadObservable (interface)](#monadobservable-interface)
  - [MonadObservable1 (interface)](#monadobservable1-interface)
  - [MonadObservable2 (interface)](#monadobservable2-interface)
  - [MonadObservable2C (interface)](#monadobservable2c-interface)
  - [MonadObservable3 (interface)](#monadobservable3-interface)
  - [MonadObservable3C (interface)](#monadobservable3c-interface)
  - [MonadObservable4 (interface)](#monadobservable4-interface)

---

# type classes

## MonadObservable (interface)

**Signature**

```ts
export interface MonadObservable<M> extends MonadTask<M> {
  readonly fromObservable: <A>(fa: Observable<A>) => HKT<M, A>
}
```

Added in v0.6.6

## MonadObservable1 (interface)

**Signature**

```ts
export interface MonadObservable1<M extends URIS> extends MonadTask1<M> {
  readonly fromObservable: <A>(fa: Observable<A>) => Kind<M, A>
}
```

Added in v0.6.6

## MonadObservable2 (interface)

**Signature**

```ts
export interface MonadObservable2<M extends URIS2> extends MonadTask2<M> {
  readonly fromObservable: <E, A>(fa: Observable<A>) => Kind2<M, E, A>
}
```

Added in v0.6.6

## MonadObservable2C (interface)

**Signature**

```ts
export interface MonadObservable2C<M extends URIS2, E> extends MonadTask2C<M, E> {
  readonly fromObservable: <A>(fa: Observable<A>) => Kind2<M, E, A>
}
```

Added in v0.6.6

## MonadObservable3 (interface)

**Signature**

```ts
export interface MonadObservable3<M extends URIS3> extends MonadTask3<M> {
  readonly fromObservable: <R, E, A>(fa: Observable<A>) => Kind3<M, R, E, A>
}
```

Added in v0.6.6

## MonadObservable3C (interface)

**Signature**

```ts
export interface MonadObservable3C<M extends URIS3, E> extends MonadTask3C<M, E> {
  readonly fromObservable: <R, A>(fa: Observable<A>) => Kind3<M, R, E, A>
}
```

Added in v0.6.6

## MonadObservable4 (interface)

**Signature**

```ts
export interface MonadObservable4<M extends URIS4> extends MonadTask4<M> {
  readonly fromObservable: <S, R, E, A>(fa: Observable<A>) => Kind4<M, S, R, E, A>
}
```

Added in v0.6.7
