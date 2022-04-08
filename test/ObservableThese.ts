import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import * as TT from 'fp-ts/TaskThese'
import * as TH from 'fp-ts/These'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { of as rxOf, Observable, lastValueFrom } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import * as _ from '../src/ObservableThese'

describe('ObservableThese', () => {
    it('rightIO', async () => {
        const e = await lastValueFrom(_.rightIO(IO.of(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.right(1)])
    })
    it('leftIO', async () => {
        const e = await lastValueFrom(_.leftIO(IO.of(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.left(1)])
    })

    it('fromTaskThese', async () => {
        const e = await lastValueFrom(_.fromTaskThese(TT.right(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.right(1)])
    })

    it('toTaskThese', async () => {
        const e = await _.toTaskThese(_.right(1))()
        assert.deepStrictEqual(e, TH.right(1))
    })

    it('fromTask', async () => {
        const e = await lastValueFrom(_.fromTask(T.of(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.right(1)])
    })

    it('fold left', async () => {
        const f = (s: number): Observable<number> => rxOf(s * 2)
        const g = (s: number): Observable<number> => rxOf(s * 3)
        const n = (s: number, nn: number): Observable<number> => rxOf(s * nn * 4)
        const e = await lastValueFrom(pipe(_.left(2), _.fold(f, g, n)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [4])
    })

    it('fold right', async () => {
        const f = (s: number): Observable<number> => rxOf(s * 2)
        const g = (s: number): Observable<number> => rxOf(s * 3)
        const n = (s: number, nn: number): Observable<number> => rxOf(s * nn * 4)
        const e = await lastValueFrom(pipe(_.right(3), _.fold(f, g, n)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [9])
    })

    it('fold both', async () => {
        const f = (s: number): Observable<number> => rxOf(s * 2)
        const g = (s: number): Observable<number> => rxOf(s * 3)
        const n = (s: number, nn: number): Observable<number> => rxOf(s * nn * 4)
        const e = await lastValueFrom(pipe(_.both(5, 3), _.fold(f, g, n)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [60])
    })

    it('swap left to right', async () => {
        const e = await lastValueFrom(pipe(_.left(1), _.swap).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.right(1)])
    })

    it('swap right to left', async () => {
        const e = await lastValueFrom(pipe(_.right(1), _.swap).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.left(1)])
    })

    it('swap both to right and left', async () => {
        const e = await lastValueFrom(pipe(_.both(1, 2), _.swap).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [TH.both(2, 1)])
    })

    it('map', async () => {
        const f = (n: number): number => n * 2
        assert.deepStrictEqual(await lastValueFrom(pipe(_.right(1), _.map(f))), TH.right(2))
        assert.deepStrictEqual(await lastValueFrom(pipe(_.left('a'), _.map(f))), TH.left('a'))
        assert.deepStrictEqual(await lastValueFrom(pipe(_.both('a', 1), _.map(f))), TH.both('a', 2))
    })

    it('bimap', async () => {
        const f = (s: string): string => `${s}!`
        const g = (n: number): number => n * 2
        assert.deepStrictEqual(await lastValueFrom(pipe(_.right(1), _.bimap(f, g))), TH.right(2))
        assert.deepStrictEqual(await lastValueFrom(pipe(_.left('a'), _.bimap(f, g))), TH.left('a!'))
        assert.deepStrictEqual(await lastValueFrom(pipe(_.both('a', 1), _.bimap(f, g))), TH.both('a!', 2))
    })

    it('mapLeft', async () => {
        const f = (s: string): string => `${s}!`
        assert.deepStrictEqual(await lastValueFrom(pipe(_.right(1), _.mapLeft(f))), TH.right(1))
        assert.deepStrictEqual(await lastValueFrom(pipe(_.left('a'), _.mapLeft(f))), TH.left('a!'))
        assert.deepStrictEqual(await lastValueFrom(pipe(_.both('a', 1), _.mapLeft(f))), TH.both('a!', 1))
    })

    describe('getMonad', () => {
        const M = _.getMonad(S.Monoid)
        it('ap', async () => {
            const f = (n: number): number => n * 2
            assert.deepStrictEqual(await lastValueFrom(M.ap(_.right(f), _.right(1))), TH.right(2))
        })

        it('chain', async () => {
            // eslint-disable-next-line no-nested-ternary
            const f = (n: number) => (n > 2 ? _.both(`c`, n * 3) : n > 1 ? _.right(n * 2) : _.left(`b`))
            assert.deepStrictEqual(await lastValueFrom(M.chain(_.right(1), f)), TH.left('b'))
            assert.deepStrictEqual(await lastValueFrom(M.chain(_.right(2), f)), TH.right(4))

            assert.deepStrictEqual(await M.chain(_.left('a'), f).toPromise(), TH.left('a'))

            assert.deepStrictEqual(await lastValueFrom(M.chain(_.both('a', 1), f)), TH.left('ab'))
            assert.deepStrictEqual(await lastValueFrom(M.chain(_.both('a', 2), f)), TH.both('a', 4))
            assert.deepStrictEqual(await lastValueFrom(M.chain(_.both('a', 3), f)), TH.both('ac', 9))
        })
    })
})
