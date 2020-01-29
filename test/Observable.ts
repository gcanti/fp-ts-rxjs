import * as assert from 'assert'
import { from } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import { identity } from 'fp-ts/lib/function'

import { observable as R } from '../src'

describe('Observable', () => {
  it('of', () => {
    const fa = R.observable.of(1)
    return fa
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
  })

  it('map', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const fb = R.observable.map(fa, double)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 4, 6])
      })
  })

  it('ap', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const triple = (n: number): number => n * 3
    const fab = from([double, triple])
    const fb = R.observable.ap(fab, fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [3, 6, 9])
      })
  })

  it('chain', () => {
    const fa = from([1, 2, 3])
    const fb = R.observable.chain(fa, a => from([a, a + 1]))
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1, 2, 2, 3, 3, 4])
      })
  })

  it('filterMap', () => {
    const fa = from([1, 2, 3])
    const fb = R.observable.filterMap(
      fa,
      O.fromPredicate(n => n > 1)
    )
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('compact', () => {
    const fa = from([1, 2, 3].map(O.fromPredicate(n => n > 1)))
    const fb = R.observable.compact(fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('filter', () => {
    const fa = from([1, 2, 3])
    const fb = R.observable.filter(fa, n => n > 1)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('partitionMap', () => {
    const fa = from([1, 2, 3])
    const s = R.observable.partitionMap(
      fa,
      E.fromPredicate(n => n > 1, identity)
    )
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('separate', () => {
    const fa = from([1, 2, 3].map(E.fromPredicate(n => n > 1, identity)))
    const s = R.observable.separate(fa)
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('partition', () => {
    const fa = from([1, 2, 3])
    const s = R.observable.partition(fa, n => n > 1)
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('zero', async () => {
    const events = await R.observable
      .zero()
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [])
  })

  it('alt', async () => {
    const events = await R.observable
      .alt(R.observable.of(1), () => R.observable.of(2))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('getMonoid', async () => {
    const M = R.getMonoid<number>()
    const events = await M.concat(R.observable.of(1), R.observable.of(2))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('fromOption', async () => {
    const events = await R.fromOption(O.some(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])

    const noEvents = await R.fromOption(O.none)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(noEvents, [])
  })

  it('fromIO', async () => {
    const events = await R.fromIO(() => 1)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])
  })

  it('fromTask', async () => {
    const events = await R.fromTask(T.of(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])
  })

  it('toTask', async () => {
    const t = await R.toTask(R.of(1))()
    assert.deepStrictEqual(t, 1)
  })
})
