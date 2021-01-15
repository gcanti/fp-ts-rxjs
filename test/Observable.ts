import * as assert from 'assert'
import { from } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import { identity } from 'fp-ts/lib/function'
import * as _ from '../src/Observable'
import { pipe } from 'fp-ts/lib/pipeable'

describe('Observable', () => {
  it('of', () => {
    const fa = _.of(1)
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
    const fb = pipe(fa, _.map(double))
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
    const fb = pipe(fab, _.ap(fa))
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [3, 6, 9])
      })
  })

  it('apFirst', () => {
    return pipe(from([1]), _.apFirst(from([2])))
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
  })

  it('apSecond', () => {
    return pipe(from([1]), _.apSecond(from([2])))
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2])
      })
  })

  it('chain', () => {
    const fa = from([1, 2, 3])
    const fb = pipe(
      fa,
      _.chain(a => from([a, a + 1]))
    )
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1, 2, 2, 3, 3, 4])
      })
  })

  it('chainFirst', () => {
    const fa = from([1, 2, 3])
    const fb = pipe(
      fa,
      _.chainFirst(a => from([a, a + 1]))
    )
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1, 1, 2, 2, 3, 3])
      })
  })

  it('filterMap', () => {
    const fa = from([1, 2, 3])
    const fb = pipe(fa, _.filterMap(O.fromPredicate(n => n > 1)))
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('compact', () => {
    const fa = from([1, 2, 3].map(O.fromPredicate(n => n > 1)))
    const fb = _.compact(fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('filter', () => {
    const fa = from([1, 2, 3])
    const fb = pipe(
      fa,
      _.filter(n => n > 1)
    )
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('partitionMap', () => {
    const fa = from([1, 2, 3])
    const s = pipe(fa, _.partitionMap(E.fromPredicate(n => n > 1, identity)))
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
    const s = _.separate(fa)
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
    const s = pipe(
      fa,
      _.partition(n => n > 1)
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

  it('zero', async () => {
    const events = await _.zero()
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [])
  })

  it('alt', async () => {
    const events = await pipe(
      _.of(1),
      _.alt(() => _.of(2))
    )
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('getMonoid', async () => {
    const M = _.getMonoid<number>()
    const events = await M.concat(_.of(1), _.of(2))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('fromOption', async () => {
    const events = await _.fromOption(O.some(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])

    const noEvents = await _.fromOption(O.none)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(noEvents, [])
  })

  it('fromIO', async () => {
    const events = await _.fromIO(() => 1)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])
  })

  it('fromTask', async () => {
    const events = await _.fromTask(T.of(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])
  })

  it('toTask', async () => {
    const t = await _.toTask(_.of(1))()
    assert.deepStrictEqual(t, 1)
  })

  it('do notation', async () => {
    const t = await pipe(
      _.of(1),
      _.bindTo('a'),
      _.bind('b', () => _.of('b'))
    )
      .pipe(bufferTime(10))
      .toPromise()

    assert.deepStrictEqual(t, [{ a: 1, b: 'b' }])
  })
})
