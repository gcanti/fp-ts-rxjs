import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { of as rxOf, Observable, throwError as rxThrowError, lastValueFrom } from 'rxjs'
import { bufferTime } from 'rxjs/operators'
import * as assert from 'assert'
import * as _ from '../src/ObservableEither'

describe('ObservableEither', () => {
    it('rightIO', async () => {
        const e = await lastValueFrom(_.rightIO(IO.of(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.right(1)])
    })
    it('leftIO', async () => {
        const e = await lastValueFrom(_.leftIO(IO.of(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.left(1)])
    })

    it('fromTaskEither', async () => {
        const e = await lastValueFrom(_.fromTaskEither(TE.right(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.right(1)])
    })

    it('toTaskEither', async () => {
        const e = await _.toTaskEither(_.right(1))()
        assert.deepStrictEqual(e, E.right(1))
    })

    it('fromTask', async () => {
        const e = await lastValueFrom(_.fromTask(T.of(1)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.right(1)])
    })

    it('tryCatch', async () => {
        assert.deepStrictEqual(await lastValueFrom(pipe(rxOf(1), _.tryCatch).pipe(bufferTime(10))), [E.right(1)])
        assert.deepStrictEqual(
            await lastValueFrom(
                pipe(
                    rxThrowError(() => new Error('Uncaught Error')),
                    _.tryCatch,
                    _.mapLeft(() => 'Caught Error')
                ).pipe(bufferTime(10))
            ),
            [E.left('Caught Error')]
        )
    })

    it('fold left', async () => {
        const f = (n: number): Observable<number> => rxOf(n * 2)
        const g = (n: number): Observable<number> => rxOf(n * 3)
        const e = await lastValueFrom(pipe(_.left(2), _.fold(f, g)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [4])
    })

    it('fold right', async () => {
        const f = (n: number): Observable<number> => rxOf(n * 2)
        const g = (n: number): Observable<number> => rxOf(n * 3)
        const e = await lastValueFrom(pipe(_.right(3), _.fold(f, g)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [9])
    })

    it('getOrElse (left)', async () => {
        const onLeft = (s: string): Observable<number> => rxOf(s.length)
        const e = await lastValueFrom(pipe(_.left('four'), _.getOrElse(onLeft)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [4])
    })

    it('getOrElse (right)', async () => {
        const onLeft = (s: string): Observable<number> => rxOf(s.length)
        const e = await lastValueFrom(pipe(_.right(1), _.getOrElse(onLeft)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [1])
    })

    it('orElse (left)', async () => {
        const onLeft = (s: string): _.ObservableEither<number, number> => _.left(s.length)
        const e = await lastValueFrom(pipe(_.left('four'), _.orElse(onLeft)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.left(4)])
    })

    it('orElse (right)', async () => {
        const onLeft = (s: string): _.ObservableEither<number, number> => _.left(s.length)
        const e = await lastValueFrom(pipe(_.right(1), _.orElse(onLeft)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.right(1)])
    })

    it('swap left to right', async () => {
        const e = await lastValueFrom(pipe(_.left(1), _.swap).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.right(1)])
    })

    it('swap right to left', async () => {
        const e = await lastValueFrom(pipe(_.right(1), _.swap).pipe(bufferTime(10)))
        assert.deepStrictEqual(e, [E.left(1)])
    })

    describe('Monad', () => {
        it('of', async () => {
            const fea = _.of(1)
            const x = await lastValueFrom(fea.pipe(bufferTime(10)))
            assert.deepStrictEqual(x, [E.right(1)])
        })

        it('map', async () => {
            const double = (n: number): number => n * 2
            const x = await lastValueFrom(pipe(_.right(1), _.map(double)).pipe(bufferTime(10)))
            assert.deepStrictEqual(x, [E.right(2)])
        })

        it('ap', async () => {
            const double = (n: number): number => n * 2
            const mab = _.right(double)
            const ma = _.right(1)
            const x = await lastValueFrom(pipe(mab, _.ap(ma)).pipe(bufferTime(10)))
            assert.deepStrictEqual(x, [E.right(2)])
        })

        it('chain', async () => {
            const f = (a: string): _.ObservableEither<string, number> =>
                a.length > 2 ? _.right(a.length) : _.left('text')
            const e1 = await lastValueFrom(pipe(_.right('four'), _.chain(f)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, [E.right(4)])
            const e2 = await lastValueFrom(pipe(_.right('a'), _.chain(f)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e2, [E.left('text')])
            const e3 = await lastValueFrom(pipe(_.left('b'), _.chain(f)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e3, [E.left('b')])
        })

        it('left identity', async () => {
            const f = (s: string): _.ObservableEither<string, number> =>
                s.length > 2 ? _.right(s.length) : _.left('text')
            const a = 'text'
            const e1 = await lastValueFrom(pipe(_.of<string, string>(a), _.chain(f)).pipe(bufferTime(10)))
            const e2 = await lastValueFrom(f(a).pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, e2)
        })

        it('right identity', async () => {
            const fa = _.of(1)
            const e1 = await lastValueFrom(pipe(fa, _.chain(_.of)).pipe(bufferTime(10)))
            const e2 = await lastValueFrom(fa.pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, e2)
        })
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.right(1), _.apFirst(_.right(2))).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [E.right(1)])
        })
    })

    it('apFirst', () => {
        return lastValueFrom(pipe(_.right(1), _.apSecond(_.right(2))).pipe(bufferTime(10))).then(events => {
            assert.deepStrictEqual(events, [E.right(2)])
        })
    })

    it('chainFirst', async () => {
        const f = (a: string): _.ObservableEither<string, number> => (a.length > 2 ? _.right(a.length) : _.left('b'))
        const e1 = await lastValueFrom(pipe(_.right('aaaa'), _.chainFirst(f)).pipe(bufferTime(10)))
        assert.deepStrictEqual(e1, [E.right('aaaa')])
    })

    describe('Bifunctor', () => {
        it('bimap', async () => {
            const f = (s: string): number => s.length
            const g = (n: number): boolean => n > 2

            const e1 = await lastValueFrom(pipe(_.right(1), _.bimap(f, g)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, [E.right(false)])
            const e2 = await lastValueFrom(pipe(_.left('foo'), _.bimap(f, g)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e2, [E.left(3)])
        })

        it('mapLeft', async () => {
            const double = (n: number): number => n * 2
            const e = await lastValueFrom(pipe(_.left(1), _.mapLeft(double)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e, [E.left(2)])
        })
    })

    describe('Alt', () => {
        it('alt right right', async () => {
            const fx = _.right(1)
            const fy = () => _.right(2)
            const e1 = await lastValueFrom(pipe(fx, _.alt(fy)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, [E.right(1)])
        })

        it('alt left right', async () => {
            const fx = _.left<number, number>(1)
            const fy = () => _.right<number, number>(2)
            const e1 = await lastValueFrom(pipe(fx, _.alt(fy)).pipe(bufferTime(10)))
            assert.deepStrictEqual(e1, [E.right(2)])
        })

        it('associativity', async () => {
            const fa = _.left<number, number>(1)
            const ga = () => _.right<number, number>(2)
            const ha = () => _.right<number, number>(3)

            const e1 = await lastValueFrom(pipe(pipe(fa, _.alt(ga)), _.alt(ha)).pipe(bufferTime(10)))

            const e2 = await lastValueFrom(
                pipe(
                    fa,
                    _.alt(() => pipe(ga(), _.alt(ha)))
                ).pipe(bufferTime(10))
            )

            assert.deepStrictEqual(e1, e2)
        })

        it('distributivity', async () => {
            const double = (n: number): number => n * 2
            const fx = _.left<string, number>('left')
            const fy = () => _.right<string, number>(1)

            const e1 = await lastValueFrom(pipe(fx, _.alt(fy), _.map(double)).pipe(bufferTime(10)))

            const e2 = await lastValueFrom(
                pipe(
                    pipe(fx, _.map(double)),
                    _.alt(() => pipe(fy(), _.map(double)))
                ).pipe(bufferTime(10))
            )

            assert.deepStrictEqual(e1, e2)
        })
    })

    it('do notation', async () => {
        const t = await lastValueFrom(
            pipe(
                _.right(1),
                _.bindTo('a'),
                _.bind('b', () => _.right('b'))
            ).pipe(bufferTime(10))
        )

        assert.deepStrictEqual(t, [E.right({ a: 1, b: 'b' })])
    })

    it('fromOption', async () => {
        assert.deepStrictEqual(await lastValueFrom(_.fromOption(() => 'a')(O.some(1)).pipe(bufferTime(10))), [
            E.right(1),
        ])
        assert.deepStrictEqual(await lastValueFrom(_.fromOption(() => 'a')(O.none).pipe(bufferTime(10))), [E.left('a')])
    })

    it('fromEither', async () => {
        assert.deepStrictEqual(await _.fromEither(E.right(1)).pipe(bufferTime(10)).toPromise(), [E.right(1)])
        assert.deepStrictEqual(await _.fromEither(E.left('a')).pipe(bufferTime(10)).toPromise(), [E.left('a')])
    })

    it('filterOrElse', async () => {
        assert.deepStrictEqual(
            await lastValueFrom(
                _.filterOrElse(
                    (n: number) => n > 0,
                    () => 'a'
                )(_.of(1)).pipe(bufferTime(10))
            ),
            [E.right(1)]
        )
        assert.deepStrictEqual(
            await lastValueFrom(
                _.filterOrElse(
                    (n: number) => n > 0,
                    () => 'a'
                )(_.of(-1)).pipe(bufferTime(10))
            ),
            [E.left('a')]
        )
    })

    it('filterOrElse', async () => {
        assert.deepStrictEqual(
            await lastValueFrom(
                _.fromPredicate(
                    (n: number) => n > 0,
                    () => 'a'
                )(1).pipe(bufferTime(10))
            ),
            [E.right(1)]
        )
        assert.deepStrictEqual(
            await lastValueFrom(
                _.fromPredicate(
                    (n: number) => n > 0,
                    () => 'a'
                )(-1).pipe(bufferTime(10))
            ),
            [E.left('a')]
        )
    })
})
