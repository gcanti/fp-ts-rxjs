import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RT from 'fp-ts/ReaderTask'
import * as T from 'fp-ts/Task'
import { identity } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import { from, lastValueFrom } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import * as OB from '../src/Observable'
import * as _ from '../src/ReaderObservable'

describe('ReaderObservable', () => {
    describe('Monad', () => {
        it('map', async () => {
            const double = (n: number): number => n * 2

            const x = await lastValueFrom(pipe(_.of(1), _.map(double))({}).pipe(bufferTime(10)))
            assert.deepStrictEqual(x, [2])
        })

        it('ap', async () => {
            const double = (n: number): number => n * 2
            const mab = _.of(double)
            const ma = _.of(1)
            const x = await lastValueFrom(pipe(mab, _.ap(ma))({}).pipe(bufferTime(10)))
            assert.deepStrictEqual(x, [2])
        })

        it('chain', async () => {
            const f = (a: string) => _.of(a.length)
            const e1 = await lastValueFrom(pipe(_.of('foo'), _.chain(f))({}).pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, [3])
        })
    })

    it('ask', async () => {
        const e = await lastValueFrom(_.ask<number>()(1).pipe(bufferTime(10)))
        return assert.deepStrictEqual(e, [1])
    })

    it('asks', async () => {
        const e = await lastValueFrom(_.asks((s: string) => s.length)('foo').pipe(bufferTime(10)))
        return assert.deepStrictEqual(e, [3])
    })

    it('local', async () => {
        const len = (s: string): number => s.length
        const e = await lastValueFrom(
            pipe(
                _.asks((n: number) => n + 1),
                _.local(len)
            )('aaa').pipe(bufferTime(10))
        )
        assert.deepStrictEqual(e, [4])
    })

    it('fromOption', async () => {
        const a = await lastValueFrom(_.fromOption(O.some(1))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(a, [1])
    })

    it('fromTask', async () => {
        const e = await lastValueFrom(_.fromTask(T.of(1))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [1])
    })

    it('fromReaderTask', async () => {
        const e = await lastValueFrom(_.fromReaderTask(RT.of(1))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [1])
    })

    it('fromReader', async () => {
        const e = await lastValueFrom(_.fromReader(R.of(1))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [1])
    })

    it('toReaderTask', async () => {
        const e = await _.toReaderTask(_.of(1))({})()
        assert.deepStrictEqual(e, 1)
    })

    it('toReaderTaskOption', async () => {
        const e1 = await _.toReaderTaskOption(_.of(1))({})()
        assert.deepStrictEqual(e1, O.some(1))
        const e2 = await _.toReaderTaskOption(_.of(undefined))({})()
        assert.deepStrictEqual(e2, O.some(undefined))
        const e3 = await _.toReaderTaskOption(_.zero())({})()
        assert.deepStrictEqual(e3, O.none)
    })

    it('filterMap', () => {
        const fa = from([1, 2, 3])
        const fb = pipe(fa, OB.filterMap(O.fromPredicate(n => n > 1)))
        return lastValueFrom(fb.pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [2, 3])
        })
    })

    it('compact', () => {
        const fa = () => from([1, 2, 3].map(O.fromPredicate(n => n > 1)))
        const fb = _.compact(fa)
        return lastValueFrom(fb({}).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [2, 3])
        })
    })

    it('filter', () => {
        const fa = () => from([1, 2, 3])
        const fb = pipe(
            fa,
            _.filter(n => n > 1)
        )
        return lastValueFrom(fb({}).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [2, 3])
        })
    })

    it('partitionMap', () => {
        const fa = () => from([1, 2, 3])
        const s = pipe(fa, _.partitionMap(E.fromPredicate(n => n > 1, identity)))
        return lastValueFrom(s.left({}).pipe(bufferTime(10)))
            .then(events => {
                assert.deepStrictEqual(events, [1])
            })
            .then(() =>
                lastValueFrom(s.right({}).pipe(bufferTime(10))).then(events => {
                    assert.deepStrictEqual(events, [2, 3])
                })
            )
    })

    it('separate', () => {
        const fa = () => from([1, 2, 3].map(E.fromPredicate(n => n > 1, identity)))
        const s = _.separate(fa)
        return lastValueFrom(s.left({}).pipe(bufferTime(10)))
            .then(events => {
                assert.deepStrictEqual(events, [1])
            })
            .then(() =>
                lastValueFrom(s.right({}).pipe(bufferTime(10))).then(events => {
                    assert.deepStrictEqual(events, [2, 3])
                })
            )
    })

    it('partition', () => {
        const fa = () => from([1, 2, 3])
        const s = pipe(
            fa,
            _.partition(n => n > 1)
        )
        return lastValueFrom(s.left({}).pipe(bufferTime(10)))
            .then(events => {
                assert.deepStrictEqual(events, [1])
            })
            .then(() =>
                lastValueFrom(s.right({}).pipe(bufferTime(10))).then(events => {
                    assert.deepStrictEqual(events, [2, 3])
                })
            )
    })

    it('zero', async () => {
        const events = await lastValueFrom(_.zero()({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(events, [])
    })

    it('alt', async () => {
        const events = await lastValueFrom(
            pipe(
                _.of(1),
                _.alt(() => _.of(2))
            )({}).pipe(bufferTime(10))
        )
        assert.deepStrictEqual(events, [1, 2])
    })

    it('getMonoid', async () => {
        const M = _.getMonoid()
        const e = await lastValueFrom(M.concat(_.of('a'), M.empty)({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, ['a'])
        const e2 = await lastValueFrom(M.concat(M.empty, _.of('b'))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e2, ['b'])
        const e3 = await lastValueFrom(M.concat(_.of('a'), _.of('b'))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e3, ['a', 'b'])
    })

    it('reader', async () => {
        const e = await lastValueFrom(_.fromReader(R.of(1))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [1])
    })

    it('sequence parallel', async () => {
        const log: Array<string> = []
        const append = (message: string): _.ReaderObservable<unknown, number> =>
            _.fromTask(() => Promise.resolve(log.push(message)))
        const t1 = pipe(
            append('start 1'),
            _.chain(() => append('end 1'))
        )
        const t2 = pipe(
            append('start 2'),
            _.chain(() => append('end 2'))
        )
        const sequenceParallel = A.sequence(_.Applicative)
        const ns = await lastValueFrom(sequenceParallel([t1, t2])({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(ns, [[3, 4]])
        assert.deepStrictEqual(log, ['start 1', 'start 2', 'end 1', 'end 2'])
    })

    describe('MonadIO', () => {
        it('fromIO', async () => {
            const e = await lastValueFrom(_.fromIO(() => 1)({}).pipe(bufferTime(10)))
            assert.deepStrictEqual(e, [1])
        })
    })

    it('chainIOK', async () => {
        const f = (s: string) => I.of(s.length)
        const x = await _.run(pipe(_.of('a'), _.chainIOK(f)), undefined)
        assert.deepStrictEqual(x, 1)
    })

    it('chainTaskK', async () => {
        const f = (s: string) => OB.of(s.length)
        const x = await _.run(pipe(_.of('a'), _.chainTaskK(f)), undefined)
        assert.deepStrictEqual(x, 1)
    })

    it('do notation', async () => {
        const t = await lastValueFrom(
            pipe(
                _.of(1),
                _.bindTo('a'),
                _.bind('b', () => _.of('b'))
            )(undefined).pipe(bufferTime(10))
        )

        assert.deepStrictEqual(t, [{ a: 1, b: 'b' }])
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.of(1), _.apFirst(_.of(2)))(undefined).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [1])
        })
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.of(1), _.apSecond(_.of(2)))(undefined).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [2])
        })
    })

    it('chainFirst', async () => {
        const f = (a: string) => _.of(a.length)
        const e1 = await lastValueFrom(pipe(_.of('foo'), _.chainFirst(f))({}).pipe(bufferTime(10)))
        assert.deepStrictEqual(e1, ['foo'])
    })
})
