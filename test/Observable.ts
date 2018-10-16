import * as assert from 'assert'
import { from } from 'rxjs'
import { bufferTime } from 'rxjs/operators'

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
})
