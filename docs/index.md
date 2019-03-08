---
title: Home
nav_order: 1
---

[fp-ts](https://github.com/gcanti/fp-ts) bindings for rxjs

# Implemented instances

- `Monad`
- `Alternative`
- `Filterable`

# Example

```ts
import { from } from 'rxjs'
import { observable } from 'fp-ts-rxjs/lib/Observable'

const fa = from([1, 2, 3])
const fb = observable.chain(fa, a => from([a, a + 1]))
// fb will emit 1, 2, 2, 3, 3, 4
```

# TypeScript compatibility

The stable version is tested against TypeScript 3.1.3

# rxjs compatibility

| rxjs version | fp-ts-rxjs version |
| ------------ | ------------------ |
| `rxjs@6`     | `fp-ts-rxjs@0.5.x` |
| `rxjs@5`     | `fp-ts-rxjs@0.4.x` |
