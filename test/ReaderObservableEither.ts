import * as assert from 'assert'
import { either as E, io as IO, reader as R, task as T } from 'fp-ts'
import { flow } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import { bufferTime } from 'rxjs/operators'
import { observable as OB, observableEither as OBE, readerObservableEither as ROBE } from '../src'

// test helper to dry up LOC.
export const buffer = flow(R.map(bufferTime(10)), R.map(OB.toTask))

describe('ReaderObservable', () => {
  it('map', async () => {
    const double = (n: number): number => n * 2

    const robe = pipe(ROBE.of(3), ROBE.map(double), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(6)])
  })

  it('ap', async () => {
    const double = (n: number): number => n * 2
    const mab = ROBE.of(double)
    const ma = ROBE.of(1)
    const robe = pipe(mab, ROBE.ap(ma), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(2)])
  })

  it('chain', async () => {
    const f = (a: string) => ROBE.of(a.length)
    const robe = pipe(ROBE.of('foo'), ROBE.chain(f), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(3)])
  })

  describe('bimap', () => {
    it('right', async () => {
      const double = (n: number): number => n * 2
      const doubleup = flow(double, double)

      const robe = pipe(ROBE.of<unknown, number, number>(3), ROBE.bimap(doubleup, double), buffer)
      const x = await robe({})()
      assert.deepStrictEqual(x, [E.right(6)])
    })

    it('left', async () => {
      const double = (n: number): number => n * 2
      const doubleup = flow(double, double)

      const robe = pipe(ROBE.throwError<unknown, number, number>(3), ROBE.bimap(doubleup, double), buffer)
      const x = await robe({})()
      assert.deepStrictEqual(x, [E.left(12)])
    })
  })

  it('mapLeft', async () => {
    const double = (n: number): number => n * 2
    const doubleup = flow(double, double)

    const robe = pipe(ROBE.throwError<unknown, number, number>(3), ROBE.mapLeft(doubleup), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.left(12)])
  })

  it('of', async () => {
    const robe = pipe(ROBE.of('foo'), buffer)
    const x = await robe('')()
    assert.deepStrictEqual(x, [E.right('foo')])
  })

  it('ask', async () => {
    const robe = pipe(ROBE.ask<string, any>(), buffer)
    const x = await robe('foo')()
    return assert.deepStrictEqual(x, [E.right('foo')])
  })

  it('asks', async () => {
    const robe = pipe(
      ROBE.asks((s: string) => s.length),
      buffer
    )
    const x = await robe('foo')()
    return assert.deepStrictEqual(x, [E.right(3)])
  })

  it('local', async () => {
    const len = (s: string): number => s.length

    const robe = pipe(
      ROBE.asks((n: number) => n + 1),
      ROBE.local(len),
      buffer
    )
    const e = await robe('foo')()

    assert.deepStrictEqual(e, [E.right(4)])
  })

  it('fromTask', async () => {
    const robe = pipe(ROBE.fromTask(T.of(1)), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(1)])
  })

  it('fromObservableEither', async () => {
    const robe = pipe(ROBE.fromObservableEither(OBE.of(1)), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(1)])
  })

  it('fromReader', async () => {
    const robe = pipe(ROBE.fromReader(R.of(1)), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(1)])
  })

  it('fromIO', async () => {
    const robe = pipe(ROBE.fromIO(IO.of(1)), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(1)])
  })

  it('fromObservable', async () => {
    const robe = pipe(ROBE.fromObservable(OB.of(1)), buffer)
    const x = await robe({})()
    assert.deepStrictEqual(x, [E.right(1)])
  })

  // robe should expose right
  it('do notation', async () => {
    const t = await pipe(
      ROBE.of(1),
      ROBE.bindTo('a'),
      ROBE.bind('b', () => ROBE.of('b'))
    )(undefined)
      .pipe(bufferTime(10))
      .toPromise()

    assert.deepStrictEqual(t, [E.right({ a: 1, b: 'b' })])
  })
})
