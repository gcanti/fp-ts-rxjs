import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as T from 'fp-ts/Task'
import { flow } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import { lastValueFrom } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import { observable as OB, observableEither as OBE, readerObservableEither as _ } from '../src'

// test helper to dry up LOC.
export const buffer = flow(R.map(bufferTime(10)), R.map(OB.toTask))

describe('ReaderObservable', () => {
    it('map', async () => {
        const double = (n: number): number => n * 2

        const robe = pipe(_.of(3), _.map(double), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(6)])
    })

    it('ap', async () => {
        const double = (n: number): number => n * 2
        const mab = _.of(double)
        const ma = _.of(1)
        const robe = pipe(mab, _.ap(ma), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(2)])
    })

    it('chain', async () => {
        const f = (a: string) => _.of(a.length)
        const robe = pipe(_.of('foo'), _.chain(f), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(3)])
    })

    describe('bimap', () => {
        it('right', async () => {
            const double = (n: number): number => n * 2
            const doubleup = flow(double, double)

            const robe = pipe(_.of<unknown, number, number>(3), _.bimap(doubleup, double), buffer)
            const x = await robe({})()
            assert.deepStrictEqual(x, [E.right(6)])
        })

        it('left', async () => {
            const double = (n: number): number => n * 2
            const doubleup = flow(double, double)

            const robe = pipe(_.throwError<unknown, number, number>(3), _.bimap(doubleup, double), buffer)
            const x = await robe({})()
            assert.deepStrictEqual(x, [E.left(12)])
        })
    })

    it('mapLeft', async () => {
        const double = (n: number): number => n * 2
        const doubleup = flow(double, double)

        const robe = pipe(_.throwError<unknown, number, number>(3), _.mapLeft(doubleup), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.left(12)])
    })

    it('of', async () => {
        const robe = pipe(_.of('foo'), buffer)
        const x = await robe('')()
        assert.deepStrictEqual(x, [E.right('foo')])
    })

    it('ask', async () => {
        const robe = pipe(_.ask<string, any>(), buffer)
        const x = await robe('foo')()
        return assert.deepStrictEqual(x, [E.right('foo')])
    })

    it('asks', async () => {
        const robe = pipe(
            _.asks((s: string) => s.length),
            buffer
        )
        const x = await robe('foo')()
        return assert.deepStrictEqual(x, [E.right(3)])
    })

    it('local', async () => {
        const len = (s: string): number => s.length

        const robe = pipe(
            _.asks((n: number) => n + 1),
            _.local(len),
            buffer
        )
        const e = await robe('foo')()

        assert.deepStrictEqual(e, [E.right(4)])
    })

    it('fromTask', async () => {
        const robe = pipe(_.fromTask(T.of(1)), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(1)])
    })

    it('fromObservableEither', async () => {
        const robe = pipe(_.fromObservableEither(OBE.of(1)), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(1)])
    })

    it('fromReader', async () => {
        const robe = pipe(_.fromReader(R.of(1)), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(1)])
    })

    it('fromIO', async () => {
        const robe = pipe(_.fromIO(IO.of(1)), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(1)])
    })

    it('fromObservable', async () => {
        const robe = pipe(_.fromObservable(OB.of(1)), buffer)
        const x = await robe({})()
        assert.deepStrictEqual(x, [E.right(1)])
    })

    // robe should expose right
    it('do notation', async () => {
        const t = await lastValueFrom(
            pipe(
                _.of(1),
                _.bindTo('a'),
                _.bind('b', () => _.of('b'))
            )(undefined).pipe(bufferTime(10))
        )

        assert.deepStrictEqual(t, [E.right({ a: 1, b: 'b' })])
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.of(1), _.apFirst(_.of(2)))(undefined).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [E.right(1)])
        })
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.of(1), _.apSecond(_.of(2)))(undefined).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [E.right(2)])
        })
    })

    it('chainFirst', async () => {
        const f = (a: string) => _.of(a.length)
        const e1 = await lastValueFrom(pipe(_.of('foo'), _.chainFirst(f))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e1, [E.right('foo')])
    })

    it('fromOption', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.fromOption(() => 'a')(O.some(1))({}).pipe(bufferTime(10))), [
            E.right(1),
        ])
        assert.deepStrictEqual(await lastValueFrom(_.fromOption(() => 'a')(O.none)({}).pipe(bufferTime(10))), [
            E.left('a'),
        ])
    })

    it('fromEither', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.fromEither(E.right(1))({}).pipe(bufferTime(10))), [E.right(1)])
        assert.deepStrictEqual(await lastValueFrom(_.fromEither(E.left('a'))({}).pipe(bufferTime(10))), [E.left('a')])
    })

    it('filterOrElse', async () => {
        assert.deepStrictEqual(
            await lastValueFrom(
                _.filterOrElse(
                    (n: number) => n > 0,
                    () => 'a'
                )(_.of(1))({}).pipe(bufferTime(10))
            ),
            [E.right(1)]
        )
        assert.deepStrictEqual(
            await lastValueFrom(
                _.filterOrElse(
                    (n: number) => n > 0,
                    () => 'a'
                )(_.of(-1))({}).pipe(bufferTime(10))
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
                )(1)(undefined).pipe(bufferTime(10))
            ),
            [E.right(1)]
        )
        assert.deepStrictEqual(
            await lastValueFrom(
                _.fromPredicate(
                    (n: number) => n > 0,
                    () => 'a'
                )(-1)(undefined).pipe(bufferTime(10))
            ),
            [E.left('a')]
        )
    })
})
