import * as assert from 'assert'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import { io } from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'
import { bufferTime } from 'rxjs/operators'

import * as _ from '../src/ObservableEither'
import { of as rxOf, Observable } from 'rxjs'

describe('ObservableEither', () => {
  it('rightIO', async () => {
    const e = await _.rightIO(io.of(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.right(1)])
  })
  it('leftIO', async () => {
    const e = await _.leftIO(io.of(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.left(1)])
  })

  it('fromTaskEither', async () => {
    const e = await _.fromTaskEither(TE.right(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.right(1)])
  })

  it('toTaskEither', async () => {
    const e = await _.toTaskEither(_.right(1))()
    assert.deepStrictEqual(e, E.right(1))
  })

  it('fromTask', async () => {
    const e = await _.fromTask(T.of(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.right(1)])
  })

  it('fold left', async () => {
    const f = (n: number): Observable<number> => rxOf(n * 2)
    const g = (n: number): Observable<number> => rxOf(n * 3)
    const e = await pipe(_.left(2), _.fold(f, g))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [4])
  })

  it('fold right', async () => {
    const f = (n: number): Observable<number> => rxOf(n * 2)
    const g = (n: number): Observable<number> => rxOf(n * 3)
    const e = await pipe(_.right(3), _.fold(f, g))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [9])
  })

  it('getOrElse (left)', async () => {
    const onLeft = (s: string): Observable<number> => rxOf(s.length)
    const e = await pipe(_.left('four'), _.getOrElse(onLeft))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [4])
  })

  it('getOrElse (right)', async () => {
    const onLeft = (s: string): Observable<number> => rxOf(s.length)
    const e = await pipe(_.right(1), _.getOrElse(onLeft))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [1])
  })

  it('orElse (left)', async () => {
    const onLeft = (s: string): _.ObservableEither<number, number> => _.left(s.length)
    const e = await pipe(_.left('four'), _.orElse(onLeft))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.left(4)])
  })

  it('orElse (right)', async () => {
    const onLeft = (s: string): _.ObservableEither<number, number> => _.left(s.length)
    const e = await pipe(_.right(1), _.orElse(onLeft))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.right(1)])
  })

  it('swap left to right', async () => {
    const e = await pipe(_.left(1), _.swap)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.right(1)])
  })

  it('swap right to left', async () => {
    const e = await pipe(_.right(1), _.swap)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(e, [E.left(1)])
  })

  describe('Monad', () => {
    it('of', async () => {
      const fea = _.observableEither.of(1)
      const x = await fea.pipe(bufferTime(10)).toPromise()
      assert.deepStrictEqual(x, [E.right(1)])
    })

    it('map', async () => {
      const double = (n: number): number => n * 2
      const x = await _.observableEither
        .map(_.right(1), double)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(x, [E.right(2)])
    })

    it('ap', async () => {
      const double = (n: number): number => n * 2
      const mab = _.right(double)
      const ma = _.right(1)
      const x = await _.observableEither
        .ap(mab, ma)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(x, [E.right(2)])
    })

    it('chain', async () => {
      const f = (a: string): _.ObservableEither<string, number> => (a.length > 2 ? _.right(a.length) : _.left('text'))
      const e1 = await _.observableEither
        .chain(_.right('four'), f)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e1, [E.right(4)])
      const e2 = await _.observableEither
        .chain(_.right('a'), f)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e2, [E.left('text')])
    })

    it('left identity', async () => {
      const f = (a: string): _.ObservableEither<string, number> => (a.length > 2 ? _.right(a.length) : _.left('text'))
      const a = 'text'
      const e1 = await _.observableEither
        .chain(_.observableEither.of(a), f)
        .pipe(bufferTime(10))
        .toPromise()
      const e2 = await f(a)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e1, e2)
    })

    it('right identity', async () => {
      const fa = _.observableEither.of(1)
      const e1 = await _.observableEither
        .chain(fa, _.observableEither.of)
        .pipe(bufferTime(10))
        .toPromise()
      const e2 = await fa.pipe(bufferTime(10)).toPromise()
      assert.deepStrictEqual(e1, e2)
    })
  })

  describe('Bifunctor', () => {
    it('bimap', async () => {
      const f = (s: string): number => s.length
      const g = (n: number): boolean => n > 2

      const e1 = await _.observableEither
        .bimap(_.right(1), f, g)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e1, [E.right(false)])
      const e2 = await _.observableEither
        .bimap(_.left('foo'), f, g)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e2, [E.left(3)])
    })

    it('mapLeft', async () => {
      const double = (n: number): number => n * 2
      const e = await _.observableEither
        .mapLeft(_.left(1), double)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e, [E.left(2)])
    })
  })

  describe('Alt', () => {
    it('alt right right', async () => {
      const fx = _.right(1)
      const fy = () => _.right(2)
      const e1 = await _.observableEither
        .alt(fx, fy)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e1, [E.right(1)])
    })

    it('alt left right', async () => {
      const fx = _.left(1)
      const fy = () => _.right(2)
      const e1 = await _.observableEither
        .alt(fx, fy)
        .pipe(bufferTime(10))
        .toPromise()
      assert.deepStrictEqual(e1, [E.right(2)])
    })

    it('associativity', async () => {
      const fa = _.left(1)
      const ga = () => _.right(2)
      const ha = () => _.right(3)

      const e1 = await _.observableEither
        .alt(_.observableEither.alt(fa, ga), ha)
        .pipe(bufferTime(10))
        .toPromise()

      const e2 = await _.observableEither
        .alt(fa, () => _.observableEither.alt(ga(), ha))
        .pipe(bufferTime(10))
        .toPromise()

      assert.deepStrictEqual(e1, e2)
    })

    it('distributivity', async () => {
      const double = (n: number): number => n * 2
      const fx = _.left('left')
      const fy = () => _.right(1)

      const e1 = await _.observableEither
        .map(_.observableEither.alt(fx, fy), double)
        .pipe(bufferTime(10))
        .toPromise()

      const e2 = await _.observableEither
        .alt(_.observableEither.map(fx, double), () => _.observableEither.map(fy(), double))
        .pipe(bufferTime(10))
        .toPromise()

      assert.deepStrictEqual(e1, e2)
    })
  })

  it('do notation', async () => {
    const t = await pipe(
      _.right(1),
      _.bindTo('a'),
      _.bind('b', () => _.right('b'))
    )
      .pipe(bufferTime(10))
      .toPromise()

    assert.deepStrictEqual(t, [E.right({ a: 1, b: 'b' })])
  })
})
