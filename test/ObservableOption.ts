import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import { pipe } from 'fp-ts/function'
import { of as rxOf, Observable, throwError as rxThrowError } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import * as _ from '../src/ObservableOption'

describe('ObservableOption', () => {
    it('fromIO', async () => {
        const e = await _.fromIO(IO.of(1)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [O.some(1)])
    })

    it('fromTask', async () => {
        const e = await _.fromTask(T.of(1)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [O.some(1)])
    })

    it('tryCatch', async () => {
        assert.deepStrictEqual(await pipe(rxOf(1), _.tryCatch).pipe(bufferTime(10)).toPromise(), [O.some(1)])
        assert.deepStrictEqual(
            await pipe(rxThrowError(new Error('Uncaught Error')), _.tryCatch)
                .pipe(bufferTime(10))
                .toPromise(),
            [O.none]
        )
    })

    it('fold left', async () => {
        const f = (): Observable<number> => rxOf(2)
        const g = (n: number): Observable<number> => rxOf(n * 3)
        const e = await pipe(_.none, _.fold(f, g)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [2])
    })

    it('fold some', async () => {
        const f = (): Observable<number> => rxOf(2)
        const g = (n: number): Observable<number> => rxOf(n * 3)
        const e = await pipe(_.some(3), _.fold(f, g)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [9])
    })

    it('getOrElse (left)', async () => {
        const onLeft = (): Observable<number> => rxOf(4)
        const e = await pipe(_.none, _.getOrElse(onLeft)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [4])
    })

    it('getOrElse (some)', async () => {
        const onLeft = (): Observable<number> => rxOf(2)
        const e = await pipe(_.some(1), _.getOrElse(onLeft)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [1])
    })

    it('alt (left)', async () => {
        const onLeft = (): _.ObservableOption<number> => _.some(4)
        const e = await pipe(_.none, _.alt(onLeft)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [O.some(4)])
    })

    it('alt (some)', async () => {
        const onLeft = (): _.ObservableOption<number> => _.none
        const e = await pipe(_.some(1), _.alt(onLeft)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [O.some(1)])
    })

    describe('Monad', () => {
        it('of', async () => {
            const fea = _.of(1)
            const x = await fea.pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(x, [O.some(1)])
        })

        it('map', async () => {
            const double = (n: number): number => n * 2
            const x = await pipe(_.some(1), _.map(double)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(x, [O.some(2)])
        })

        it('ap', async () => {
            const double = (n: number): number => n * 2
            const mab = _.some(double)
            const ma = _.some(1)
            const x = await pipe(mab, _.ap(ma)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(x, [O.some(2)])
        })

        it('chain', async () => {
            const f = (a: string): _.ObservableOption<number> => (a.length > 2 ? _.some(a.length) : _.none)
            const e1 = await pipe(_.some('four'), _.chain(f)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e1, [O.some(4)])
            const e2 = await pipe(_.some('a'), _.chain(f)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e2, [O.none])
            const e3 = await pipe(_.none, _.chain(f)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e3, [O.none])
        })

        it('left identity', async () => {
            const f = (s: string): _.ObservableOption<number> => (s.length > 2 ? _.some(s.length) : _.none)
            const a = 'text'
            const e1 = await pipe(_.of<string>(a), _.chain(f)).pipe(bufferTime(10)).toPromise()
            const e2 = await f(a).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e1, e2)
        })

        it('some identity', async () => {
            const fa = _.of(1)
            const e1 = await pipe(fa, _.chain(_.of)).pipe(bufferTime(10)).toPromise()
            const e2 = await fa.pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e1, e2)
        })
    })

    it('apFirst', () => {
        return pipe(_.some(1), _.apFirst(_.some(2)))
            .pipe(bufferTime(10))
            .toPromise()
            .then(events => {
                assert.deepStrictEqual(events, [O.some(1)])
            })
    })

    it('apFirst', () => {
        return pipe(_.some(1), _.apSecond(_.some(2)))
            .pipe(bufferTime(10))
            .toPromise()
            .then(events => {
                assert.deepStrictEqual(events, [O.some(2)])
            })
    })

    it('chainFirst', async () => {
        const f = (a: string): _.ObservableOption<number> => (a.length > 2 ? _.some(a.length) : _.none)
        const e1 = await pipe(_.some('aaaa'), _.chainFirst(f)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e1, [O.some('aaaa')])
    })

    describe('Alt', () => {
        it('alt some some', async () => {
            const fx = _.some(1)
            const fy = () => _.some(2)
            const e1 = await pipe(fx, _.alt(fy)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e1, [O.some(1)])
        })

        it('alt left some', async () => {
            const fx = _.none
            const fy = () => _.some<number>(2)
            const e1 = await pipe(fx, _.alt(fy)).pipe(bufferTime(10)).toPromise()
            assert.deepStrictEqual(e1, [O.some(2)])
        })

        it('associativity', async () => {
            const fa = _.none
            const ga = () => _.some<number>(2)
            const ha = () => _.some<number>(3)

            const e1 = await pipe(pipe(fa, _.alt(ga)), _.alt(ha))
                .pipe(bufferTime(10))
                .toPromise()

            const e2 = await pipe(
                fa,
                _.alt(() => pipe(ga(), _.alt(ha)))
            )
                .pipe(bufferTime(10))
                .toPromise()

            assert.deepStrictEqual(e1, e2)
        })

        it('distributivity', async () => {
            const double = (n: number): number => n * 2
            const fx = _.none
            const fy = () => _.some<number>(1)

            const e1 = await pipe(fx, _.alt(fy), _.map(double)).pipe(bufferTime(10)).toPromise()

            const e2 = await pipe(
                pipe(fx, _.map(double)),
                _.alt(() => pipe(fy(), _.map(double)))
            )
                .pipe(bufferTime(10))
                .toPromise()

            assert.deepStrictEqual(e1, e2)
        })
    })

    it('do notation', async () => {
        const t = await pipe(
            _.some(1),
            _.bindTo('a'),
            _.bind('b', () => _.some('b'))
        )
            .pipe(bufferTime(10))
            .toPromise()

        assert.deepStrictEqual(t, [O.some({ a: 1, b: 'b' })])
    })

    it('fromOption', async () => {
        assert.deepStrictEqual(await _.fromOption(O.some(1)).pipe(bufferTime(10)).toPromise(), [O.some(1)])
        assert.deepStrictEqual(await _.fromOption(O.none).pipe(bufferTime(10)).toPromise(), [O.none])
    })

    it('filterOrElse', async () => {
        assert.deepStrictEqual(
            await _.filterOrElse((n: number) => n > 0)(_.of(1))
                .pipe(bufferTime(10))
                .toPromise(),
            [O.some(1)]
        )
        assert.deepStrictEqual(
            await _.filterOrElse((n: number) => n > 0)(_.of(-1))
                .pipe(bufferTime(10))
                .toPromise(),
            [O.none]
        )
    })

    it('filterOrElse', async () => {
        assert.deepStrictEqual(
            await _.fromPredicate((n: number) => n > 0)(1)
                .pipe(bufferTime(10))
                .toPromise(),
            [O.some(1)]
        )
        assert.deepStrictEqual(
            await _.fromPredicate((n: number) => n > 0)(-1)
                .pipe(bufferTime(10))
                .toPromise(),
            [O.none]
        )
    })
})
