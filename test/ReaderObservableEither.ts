import * as assert from 'assert'
import { either as E, reader as R, task as T } from 'fp-ts'
import { flow, pipe } from 'fp-ts/lib/function'
import { bufferTime } from 'rxjs/operators'
import { readerObservableEither as ROBE, observable as OB } from '../src'

// test helper to dry up LOC.
const buffer = flow(R.map(bufferTime(10)), R.map(OB.toTask))

describe('ReaderObservable', () => {
  describe('Monad', () => {
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

  it('of', async () => {
    const robe = pipe(ROBE.of('foo'), buffer)
    const x = await robe('')()
    assert.deepStrictEqual(x, [E.right('foo')])
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
})
