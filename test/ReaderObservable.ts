import * as assert from 'assert'
import { array } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import { reader } from 'fp-ts/lib/Reader'
import * as _ from '../src/ReaderObservable'
import * as R from '../src/Observable'
import * as T from 'fp-ts/lib/Task'
import * as RT from 'fp-ts/lib/ReaderTask'
import * as I from 'fp-ts/lib/IO'
import { bufferTime } from 'rxjs/operators'
import * as O from 'fp-ts/lib/Option'
import { from } from 'rxjs'
import * as E from 'fp-ts/lib/Either'
import { identity } from 'fp-ts/lib/function'

describe('ReaderObservable', () => {
  describe('Monad', () => {
    it('map', async () => {
      const double = (n: number): number => n * 2

      const x = await _.readerObservable
        .map(
          _.of(1),
          double
        )({})
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(x, [2])
    })

    it('ap', async () => {
      const double = (n: number): number => n * 2
      const mab = _.of(double)
      const ma = _.of(1)
      const x = await _.readerObservable
        .ap(
          mab,
          ma
        )({})
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(x, [2])
    })

    it('chain', async () => {
      const f = (a: string) => _.of(a.length)
      const e1 = await _.readerObservable
        .chain(
          _.of('foo'),
          f
        )({})
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e1, [3])
    })
  })

  it('ask', async () => {
    const e = await _.ask<number>()(1)
      .pipe(bufferTime(10))
      .toPromise()
    return assert.deepStrictEqual(e, [1])
  })

  it('asks', async () => {
    const e = await _.asks((s: string) => s.length)('foo')
      .pipe(bufferTime(10))
      .toPromise()
    return assert.deepStrictEqual(e, [3])
  })

  it('local', async () => {
    const len = (s: string): number => s.length
    const e = await pipe(
      _.asks((n: number) => n + 1),
      _.local(len)
    )('aaa')
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [4])
  })

  it('fromOption', async () => {
    const a = await _.fromOption(O.some(1))({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(a, [1])
  })

  it('fromTask', async () => {
    const e = await _.fromTask(T.of(1))({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [1])
  })

  it('fromReaderTask', async () => {
    const e = await _.fromReaderTask(RT.of(1))({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [1])
  })

  it('fromReader', async () => {
    const e = await _.fromReader(reader.of(1))({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [1])
  })

  it('toReaderTask', async () => {
    const e = await _.toReaderTask(_.of(1))({})()
    assert.deepStrictEqual(e, 1)
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
    const fa = () => from([1, 2, 3].map(O.fromPredicate(n => n > 1)))
    const fb = _.readerObservable.compact(fa)
    return fb({})
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('filter', () => {
    const fa = () => from([1, 2, 3])
    const fb = _.readerObservable.filter(fa, n => n > 1)
    return fb({})
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('partitionMap', () => {
    const fa = () => from([1, 2, 3])
    const s = _.readerObservable.partitionMap(
      fa,
      E.fromPredicate(n => n > 1, identity)
    )
    return s
      .left({})
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s
          .right({})
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('separate', () => {
    const fa = () => from([1, 2, 3].map(E.fromPredicate(n => n > 1, identity)))
    const s = _.readerObservable.separate(fa)
    return s
      .left({})
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s
          .right({})
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('partition', () => {
    const fa = () => from([1, 2, 3])
    const s = _.readerObservable.partition(fa, n => n > 1)
    return s
      .left({})
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s
          .right({})
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('zero', async () => {
    const events = await _.readerObservable
      .zero()({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [])
  })

  it('alt', async () => {
    const events = await _.readerObservable
      .alt(_.readerObservable.of(1), () => _.readerObservable.of(2))({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('getMonoid', async () => {
    const M = _.getMonoid()
    const e = await M.concat(
      _.of('a'),
      M.empty
    )({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, ['a'])
    const e2 = await M.concat(
      M.empty,
      _.of('b')
    )({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e2, ['b'])
    const e3 = await M.concat(
      _.of('a'),
      _.of('b')
    )({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e3, ['a', 'b'])
  })

  it('reader', async () => {
    const e = await _.fromReader(reader.of(1))({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [1])
  })

  it('sequence parallel', async () => {
    const log: Array<string> = []
    const append = (message: string): _.ReaderObservable<{}, number> =>
      _.fromTask(() => Promise.resolve(log.push(message)))
    const t1 = _.readerObservable.chain(append('start 1'), () => append('end 1'))
    const t2 = _.readerObservable.chain(append('start 2'), () => append('end 2'))
    const sequenceParallel = array.sequence(_.readerObservable)
    const ns = await sequenceParallel([t1, t2])({})
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(ns, [[3, 4]])
    assert.deepStrictEqual(log, ['start 1', 'start 2', 'end 1', 'end 2'])
  })

  describe('MonadIO', () => {
    it('fromIO', async () => {
      const e = await _.readerObservable
        .fromIO(() => 1)({})
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e, [1])
    })
  })

  it('chainIOK', async () => {
    const f = (s: string) => I.of(s.length)
    const x = await _.run(pipe(_.of('a'), _.chainIOK(f)), undefined)
    assert.deepStrictEqual(x, 1)
  })

  it('chainTaskK', async () => {
    const f = (s: string) => R.of(s.length)
    const x = await _.run(pipe(_.of('a'), _.chainTaskK(f)), undefined)
    assert.deepStrictEqual(x, 1)
  })

  it('do notation', async () => {
    const t = await pipe(
      _.of(1),
      _.bindTo('a'),
      _.bind('b', () => _.of('b'))
    )(undefined)
      .pipe(bufferTime(10))
      .toPromise()

    assert.deepStrictEqual(t, [{ a: 1, b: 'b' }])
  })
})
