import { task as T, either as E, io as IO } from 'fp-ts'
import { stateReaderObservableEither as SROBE, observable as OB } from '../src'
import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/pipeable'
import { bufferTime } from 'rxjs/operators'
import { buffer as _buffer } from './ReaderObservableEither'

function buffer<S, R, E, A>(
  srobe: SROBE.StateReaderObservableEither<S, R, E, A>
): (s: S) => (r: R) => T.Task<Array<E.Either<E, [A, S]>>> {
  return s => r => pipe(srobe(s)(r), bufferTime(10), OB.toTask)
}

describe('stateReaderObservableEither', () => {
  test('right', async () => {
    const srobe = pipe(SROBE.right<number, number, number, number>(3), buffer)
    const x = await srobe(1)(2)()

    assert.deepStrictEqual(x, [E.right([3, 1])])
  })

  test('left', async () => {
    const srobe = pipe(SROBE.left<number, number, number, number>(3), buffer)
    const x = await srobe(1)(2)()

    assert.deepStrictEqual(x, [E.left(3)])
  })

  test('throwError', async () => {
    const srobe = pipe(SROBE.throwError<number, number, number, number>(3), buffer)
    const x = await srobe(1)(2)()

    assert.deepStrictEqual(x, [E.left(3)])
  })

  describe('bimap', () => {
    const square = (a: number) => a * a
    const doublesquare = (a: number) => a ** a
    const bimap = SROBE.bimap(doublesquare, square)

    test('map', async () => {
      const srobe = pipe(SROBE.right<number, number, number, number>(3), bimap, buffer)
      const x = await srobe(1)(2)()

      assert.deepStrictEqual(x, [E.right([9, 1])])
    })

    test('mapLeft', async () => {
      const srobe = pipe(SROBE.left<number, number, number, number>(3), bimap, buffer)
      const x = await srobe(1)(2)()

      assert.deepStrictEqual(x, [E.left(27)])
    })
  })

  test('fromIO', async () => {
    const srobe = pipe(SROBE.fromIO(IO.of(3)), buffer)
    const x = await srobe(1)(2)()
    assert.deepStrictEqual(x, [E.right([3, 1])])
  })

  test('fromTask', async () => {
    const srobe = pipe(SROBE.fromTask(T.of(3)), buffer)
    const x = await srobe(1)(2)()
    assert.deepStrictEqual(x, [E.right([3, 1])])
  })

  test('fromObservable', async () => {
    const srobe = pipe(SROBE.fromObservable(OB.of(3)), buffer)
    const x = await srobe(1)(2)()
    assert.deepStrictEqual(x, [E.right([3, 1])])
  })

  test('evaluate', async () => {
    const srobe = pipe(SROBE.right<number, number, number, number>(3), SROBE.evaluate(1), _buffer)
    const x = await srobe(2)()
    assert.deepStrictEqual(x, [E.right(3)])
  })

  test('execute', async () => {
    const srobe = pipe(SROBE.right<number, number, number, number>(3), SROBE.execute(1), _buffer)
    const x = await srobe(2)()
    assert.deepStrictEqual(x, [E.right(1)])
  })
})
