import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import * as TT from 'fp-ts/TaskThese'
import * as TH from 'fp-ts/These'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { of as rxOf, Observable } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import * as _ from '../src/ObservableThese'

describe('ObservableThese', () => {
    it('rightIO', async () => {
        const e = await _.rightIO(IO.of(1)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.right(1)])
    })
    it('leftIO', async () => {
        const e = await _.leftIO(IO.of(1)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.left(1)])
    })

    it('fromTaskThese', async () => {
        const e = await _.fromTaskThese(TT.right(1)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.right(1)])
    })

    it('toTaskThese', async () => {
        const e = await _.toTaskThese(_.right(1))()
        assert.deepStrictEqual(e, TH.right(1))
    })

    it('fromTask', async () => {
        const e = await _.fromTask(T.of(1)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.right(1)])
    })

    it('fold left', async () => {
        const f = (s: number): Observable<number> => rxOf(s * 2)
        const g = (s: number): Observable<number> => rxOf(s * 3)
        const n = (s: number, nn: number): Observable<number> => rxOf(s * nn * 4)
        const e = await pipe(_.left(2), _.fold(f, g, n)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [4])
    })

    it('fold right', async () => {
        const f = (s: number): Observable<number> => rxOf(s * 2)
        const g = (s: number): Observable<number> => rxOf(s * 3)
        const n = (s: number, nn: number): Observable<number> => rxOf(s * nn * 4)
        const e = await pipe(_.right(3), _.fold(f, g, n)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [9])
    })

    it('fold both', async () => {
        const f = (s: number): Observable<number> => rxOf(s * 2)
        const g = (s: number): Observable<number> => rxOf(s * 3)
        const n = (s: number, nn: number): Observable<number> => rxOf(s * nn * 4)
        const e = await pipe(_.both(5, 3), _.fold(f, g, n)).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [60])
    })

    it('swap left to right', async () => {
        const e = await pipe(_.left(1), _.swap).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.right(1)])
    })

    it('swap right to left', async () => {
        const e = await pipe(_.right(1), _.swap).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.left(1)])
    })

    it('swap both to right and left', async () => {
        const e = await pipe(_.both(1, 2), _.swap).pipe(bufferTime(10)).toPromise()
        assert.deepStrictEqual(e, [TH.both(2, 1)])
    })

    it('map', async () => {
        const f = (n: number): number => n * 2
        assert.deepStrictEqual(await pipe(_.right(1), _.map(f)).toPromise(), TH.right(2))
        assert.deepStrictEqual(await pipe(_.left('a'), _.map(f)).toPromise(), TH.left('a'))
        assert.deepStrictEqual(await pipe(_.both('a', 1), _.map(f)).toPromise(), TH.both('a', 2))
    })

    it('bimap', async () => {
        const f = (s: string): string => `${s}!`
        const g = (n: number): number => n * 2
        assert.deepStrictEqual(await pipe(_.right(1), _.bimap(f, g)).toPromise(), TH.right(2))
        assert.deepStrictEqual(await pipe(_.left('a'), _.bimap(f, g)).toPromise(), TH.left('a!'))
        assert.deepStrictEqual(await pipe(_.both('a', 1), _.bimap(f, g)).toPromise(), TH.both('a!', 2))
    })

    it('mapLeft', async () => {
        const f = (s: string): string => `${s}!`
        assert.deepStrictEqual(await pipe(_.right(1), _.mapLeft(f)).toPromise(), TH.right(1))
        assert.deepStrictEqual(await pipe(_.left('a'), _.mapLeft(f)).toPromise(), TH.left('a!'))
        assert.deepStrictEqual(await pipe(_.both('a', 1), _.mapLeft(f)).toPromise(), TH.both('a!', 1))
    })

    describe('getMonad', () => {
        const M = _.getMonad(S.Monoid)
        it('ap', async () => {
            const f = (n: number): number => n * 2
            assert.deepStrictEqual(await M.ap(_.right(f), _.right(1)).toPromise(), TH.right(2))
        })

        it('chain', async () => {
            // eslint-disable-next-line no-nested-ternary
            const f = (n: number) => (n > 2 ? _.both(`c`, n * 3) : n > 1 ? _.right(n * 2) : _.left(`b`))
            assert.deepStrictEqual(await M.chain(_.right(1), f).toPromise(), TH.left('b'))
            assert.deepStrictEqual(await M.chain(_.right(2), f).toPromise(), TH.right(4))

            assert.deepStrictEqual(await M.chain(_.left('a'), f).toPromise(), TH.left('a'))

            assert.deepStrictEqual(await M.chain(_.both('a', 1), f).toPromise(), TH.left('ab'))
            assert.deepStrictEqual(await M.chain(_.both('a', 2), f).toPromise(), TH.both('a', 4))
            assert.deepStrictEqual(await M.chain(_.both('a', 3), f).toPromise(), TH.both('ac', 9))
        })
    })
})
