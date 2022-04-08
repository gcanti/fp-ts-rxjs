import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import { lastValueFrom } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import { observable as OB, stateReaderObservableEither as _ } from '../src'
import * as ROE from '../src/ReaderObservableEither'
import { buffer as _buffer } from './ReaderObservableEither'

function buffer<S, R, E, A>(
    srobe: _.StateReaderObservableEither<S, R, E, A>
): (s: S) => (r: R) => T.Task<Array<E.Either<E, [A, S]>>> {
    return s => r => pipe(srobe(s)(r), bufferTime(10), OB.toTask)
}

describe('stateReaderObservableEither', () => {
    test('right', async () => {
        const srobe = pipe(_.right<number, number, number, number>(3), buffer)
        const x = await srobe(1)(2)()

        assert.deepStrictEqual(x, [E.right([3, 1])])
    })

    test('left', async () => {
        const srobe = pipe(_.left<number, number, number, number>(3), buffer)
        const x = await srobe(1)(2)()

        assert.deepStrictEqual(x, [E.left(3)])
    })

    test('chain', async () => {
        const fa = _.right<number, number, number, number>(3)
        const fab = _.right<number, number, number, number>(6)
        const srobe = pipe(
            fa,
            _.chain(() => fab),
            buffer
        )
        const x = await srobe(1)(2)()
        assert.deepStrictEqual(x, [E.right([6, 1])])
    })

    test('throwError', async () => {
        const srobe = pipe(_.throwError<number, number, number, number>(3), buffer)
        const x = await srobe(1)(2)()

        assert.deepStrictEqual(x, [E.left(3)])
    })

    describe('Bifunctor', () => {
        const square = (a: number) => a * a
        const doublesquare = (a: number) => a ** a
        const bimap = _.bimap(doublesquare, square)

        test('map', async () => {
            const srobe = pipe(_.right<number, number, number, number>(3), bimap, buffer)
            const x = await srobe(1)(2)()

            assert.deepStrictEqual(x, [E.right([9, 1])])
        })

        test('mapLeft', async () => {
            const srobe = pipe(_.left<number, number, number, number>(3), bimap, buffer)
            const x = await srobe(1)(2)()

            assert.deepStrictEqual(x, [E.left(27)])
        })
    })

    test('fromIO', async () => {
        const srobe = pipe(_.fromIO(IO.of(3)), buffer)
        const x = await srobe(1)(2)()
        assert.deepStrictEqual(x, [E.right([3, 1])])
    })

    test('fromTask', async () => {
        const srobe = pipe(_.fromTask(T.of(3)), buffer)
        const x = await srobe(1)(2)()
        assert.deepStrictEqual(x, [E.right([3, 1])])
    })

    test('fromObservable', async () => {
        const srobe = pipe(_.fromObservable(OB.of(3)), buffer)
        const x = await srobe(1)(2)()
        assert.deepStrictEqual(x, [E.right([3, 1])])
    })

    test('evaluate', async () => {
        const srobe = pipe(_.right<number, number, number, number>(3), _.evaluate(1), _buffer)
        const x = await srobe(2)()
        assert.deepStrictEqual(x, [E.right(3)])
    })

    test('execute', async () => {
        const srobe = pipe(_.right<number, number, number, number>(3), _.execute(1), _buffer)
        const x = await srobe(2)()
        assert.deepStrictEqual(x, [E.right(1)])
    })

    // should expose of
    it('do notation', async () => {
        const srobe = pipe(
            _.right(1),
            _.bindTo('a'),
            _.bind('b', () => _.right('b')),
            buffer
        )

        assert.deepStrictEqual(await srobe('state')('reader')(), [E.right([{ a: 1, b: 'b' }, 'state'])])
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.of(1), _.apFirst(_.of(2)))(undefined)({}).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [E.right([1, undefined])])
        })
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.of(1), _.apSecond(_.of(2)))(undefined)({}).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [E.right([2, undefined])])
        })
    })

    it('chainFirst', async () => {
        const f = (a: string) => _.of(a.length)
        const e1 = await lastValueFrom(pipe(_.of('foo'), _.chainFirst(f))({})({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e1, [E.right(['foo', {}])])
    })

    it('fromOption', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.fromOption(() => 'a')(O.some(1))({})({}).pipe(bufferTime(10))), [
            E.right([1, {}]),
        ])
        assert.deepStrictEqual(await lastValueFrom(_.fromOption(() => 'a')(O.none)({})({}).pipe(bufferTime(10))), [
            E.left('a'),
        ])
    })

    it('fromEither', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.fromEither(E.right(1))({})({}).pipe(bufferTime(10))), [
            E.right([1, {}]),
        ])
        assert.deepStrictEqual(await lastValueFrom(_.fromEither(E.left('a'))({})({}).pipe(bufferTime(10))), [
            E.left('a'),
        ])
    })

    it('filterOrElse', async () => {
        assert.deepStrictEqual(
            await lastValueFrom(
                _.filterOrElse(
                    (n: number) => n > 0,
                    () => 'a'
                )(_.of(1))({})({}).pipe(bufferTime(10))
            ),
            [E.right([1, {}])]
        )
        assert.deepStrictEqual(
            await lastValueFrom(
                _.filterOrElse(
                    (n: number) => n > 0,
                    () => 'a'
                )(_.of(-1))({})({}).pipe(bufferTime(10))
            ),
            [E.left('a')]
        )
    })

    it('fromPredicate', async () => {
        assert.deepStrictEqual(
            await lastValueFrom(
                _.fromPredicate(
                    (n: number) => n > 0,
                    () => 'a'
                )(1)({})({}).pipe(bufferTime(10))
            ),
            [E.right([1, {}])]
        )
        assert.deepStrictEqual(
            await lastValueFrom(
                _.fromPredicate(
                    (n: number) => n > 0,
                    () => 'a'
                )(-1)({})({}).pipe(bufferTime(10))
            ),
            [E.left('a')]
        )
    })

    it('fromReaderObservableEither', async () => {
        assert.deepStrictEqual(
            await lastValueFrom(_.fromReaderObservableEither(ROE.right(1))({})({}).pipe(bufferTime(10))),
            [E.right([1, {}])]
        )
    })

    it('get', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.get()(1)(undefined).pipe(bufferTime(10))), [E.right([1, 1])])
    })

    it('gets', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.gets((n: number) => n * 2)(1)(undefined).pipe(bufferTime(10))), [
            E.right([2, 1]),
        ])
    })

    it('modify', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.modify((n: number) => n * 2)(1)(undefined).pipe(bufferTime(10))), [
            E.right([undefined, 2]),
        ])
    })

    it('put', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.put(2)(1)(undefined).pipe(bufferTime(10))), [
            E.right([undefined, 2]),
        ])
    })
})
