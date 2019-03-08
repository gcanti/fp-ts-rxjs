import * as assert from 'assert'
import { from } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import { fromPredicate as optionFromPredicate } from 'fp-ts/lib/Option'
import { fromPredicate as eitherFromPredicate } from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'

import { observable } from '../src/Observable'

describe('Observable', () => {
  it('of', () => {
    const fa = observable.of(1)
    return fa
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [1])
      })
  })

  it('map', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const fb = observable.map(fa, double)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [2, 4, 6])
      })
  })

  it('ap', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const triple = (n: number): number => n * 3
    const fab = from([double, triple])
    const fb = observable.ap(fab, fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [3, 6, 9])
      })
  })

  it('chain', () => {
    const fa = from([1, 2, 3])
    const fb = observable.chain(fa, a => from([a, a + 1]))
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [1, 2, 2, 3, 3, 4])
      })
  })

  it('filterMap', () => {
    const fa = from([1, 2, 3])
    const fb = observable.filterMap(fa, optionFromPredicate(n => n > 1))
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [2, 3])
      })
  })

  it('compact', () => {
    const fa = from([1, 2, 3].map(optionFromPredicate(n => n > 1)))
    const fb = observable.compact(fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [2, 3])
      })
  })

  it('filter', () => {
    const fa = from([1, 2, 3])
    const fb = observable.filter(fa, n => n > 1)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [2, 3])
      })
  })

  it('partitionMap', () => {
    const fa = from([1, 2, 3])
    const s = observable.partitionMap(fa, eitherFromPredicate(n => n > 1, identity))
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepEqual(events, [2, 3])
          })
      )
  })

  it('separate', () => {
    const fa = from([1, 2, 3].map(eitherFromPredicate(n => n > 1, identity)))
    const s = observable.separate(fa)
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepEqual(events, [2, 3])
          })
      )
  })

  it('partition', () => {
    const fa = from([1, 2, 3])
    const s = observable.partition(fa, n => n > 1)
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepEqual(events, [2, 3])
          })
      )
  })
})
