import * as assert from 'assert'
import { from, Observable } from 'rxjs'
import { bufferTime, subscribeOn } from 'rxjs/operators'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import { constFalse, constTrue, identity } from 'fp-ts/lib/function'
import * as laws from 'fp-ts-laws'

import { observable as R } from '../src'
import { TestScheduler } from 'rxjs/testing'
import { Eq, eqNumber, eqString } from 'fp-ts/lib/Eq'
import { getEq } from 'fp-ts/lib/Array'

const liftE = <A>(E: Eq<A>): Eq<Observable<A>> => {
  const arrayE = getEq(E)
  return {
    equals: (x, y) => {
      const scheduler = new TestScheduler(assert.deepStrictEqual)
      const xas: Array<A> = []
      x.pipe(subscribeOn(scheduler)).subscribe(a => xas.push(a))
      const yas: Array<A> = []
      y.pipe(subscribeOn(scheduler)).subscribe(a => yas.push(a))
      scheduler.flush()
      assert.deepStrictEqual(xas, yas)
      return arrayE.equals(xas, yas)
    }
  }
}

describe('Observable', () => {
  describe('laws', () => {
    const f = (n: number): string => `map(${n})`
    const a = R.observable.of(1)
    const b = R.observable.of(2)
    const c = R.observable.of(3)
    it('Monad', () => {
      laws.monad(R.observable)(liftE)
    })
    describe('Alt', () => {
      it('associativity', () => {
        const left = R.observable.alt(
          R.observable.alt(a, () => b),
          () => c
        )
        const right = R.observable.alt(a, () => R.observable.alt(b, () => c))
        assert.ok(liftE(eqNumber).equals(left, right))
      })
      it('distributivity', () => {
        const left = R.observable.map(
          R.observable.alt(a, () => b),
          f
        )
        const right = R.observable.alt(R.observable.map(a, f), () => R.observable.map(b, f))
        assert.ok(liftE(eqString).equals(left, right))
      })
    })
    describe('Plus', () => {
      it('right identity', () => {
        const left = R.observable.alt(a, () => R.observable.zero())
        assert.ok(liftE(eqNumber).equals(left, a))
      })
      it('left identity', () => {
        const left = R.observable.alt(R.observable.zero<number>(), () => a)
        assert.ok(liftE(eqNumber).equals(left, a))
      })
      it('annihilation', () => {
        const left = R.observable.map(R.observable.zero<number>(), f)
        const right = R.observable.zero<string>()
        assert.ok(liftE(eqString).equals(left, right))
      })
    })
    describe('Observable is not an Alternative', () => {
      describe('no distributivity', () => {
        const a = 1
        const f = (n: number) => n + 1
        const g = (n: number) => n / 2
        const result = { b: f(a), c: g(a) }
        const success = {
          fa: '                             ------------a----------------|',
          fab: '                            ---f-------------------------|',
          gac: '                            ----------------g------------|',

          'LEFT SIDE': '',
          'alt(fab, gac)': '                ---f------------g------------|',
          'ap(alt(fab, gac), fa)': '        ------------b---c------------|',

          'RIGHT SIDE': '',
          'ap(fab, fa)': '                  ------------b----------------|',
          'ap(gac, fa)': '                  ----------------c------------|',
          'alt(ap(fab, fa), ap(gac, fa))': '------------b---c------------|'
        }
        const failure = {
          fa: '                             ------------a----------------|',
          fab: '                            ---f-------------------------|',
          gac: '                            --------g--------------------|',

          'LEFT SIDE': '',
          'alt(fab, gac)': '                ---f----g--------------------|',
          'ap(alt(fab, gac), fa)': '        ------------c----------------|',

          'RIGHT SIDE': '',
          'ap(fab, fa)': '                  ------------b----------------|',
          'ap(gac, fa)': '                  ----------------c------------|',
          'alt(ap(fab, fa), ap(gac, fa))': '------------b---c------------|'
        }
        it('left sides are not equal but they should be', () => {
          assert.notDeepStrictEqual(success['ap(alt(fab, gac), fa)'], failure['ap(alt(fab, gac), fa)'])
        })
        it('right sides should be equal', () => {
          assert.deepStrictEqual(success['alt(ap(fab, fa), ap(gac, fa))'], failure['alt(ap(fab, fa), ap(gac, fa))'])
        })
        it('success', () => {
          new TestScheduler(assert.deepStrictEqual).run(({ cold, expectObservable }) => {
            const fa = cold(success.fa, { a })
            const fab = cold(success.fab, { f })
            const gac = cold(success.gac, { g })
            const left = R.observable.ap(
              R.observable.alt(fab, () => gac),
              fa
            )
            const right = R.observable.alt(R.observable.ap(fab, fa), () => R.observable.ap(gac, fa))
            expectObservable(left).toBe(success['ap(alt(fab, gac), fa)'], result)
            expectObservable(right).toBe(success['alt(ap(fab, fa), ap(gac, fa))'], result)
          })
        })
        it('failure', () => {
          // use assert.notDeepStrictEqual as assert
          new TestScheduler(assert.notDeepStrictEqual).run(({ cold, expectObservable }) => {
            const fa = cold(failure.fa, { a })
            const fab = cold(failure.fab, { f })
            const gac = cold(failure.gac, { g })
            const left = R.observable.ap(
              R.observable.alt(fab, () => gac),
              fa
            )
            const right = R.observable.alt(R.observable.ap(fab, fa), () => R.observable.ap(gac, fa))
            expectObservable(left).toBe(success['ap(alt(fab, gac), fa)'], result)
            expectObservable(right).toBe(success['alt(ap(fab, fa), ap(gac, fa))'], result)
          })
        })
      })
    })
    describe('Filterable', () => {
      const p = (n: number) => n > 0
      const q = (n: number) => n < 10
      const v = from([-5, 5, 15])
      it('distributivity', () => {
        const left = R.observable.filter(v, x => p(x) && q(x))
        const right = R.observable.filter(R.observable.filter(v, p), q)
        assert.ok(liftE(eqNumber).equals(left, right))
      })
      it('identity', () => {
        const left = R.observable.filter(v, constTrue)
        assert.ok(liftE(eqNumber).equals(left, v))
      })
      it('annihilation', () => {
        const left = R.observable.filter(from([1, 2, 3]), constFalse)
        const right = R.observable.filter(from([-1,-2,-3]), constFalse)
        assert.ok(liftE(eqNumber).equals(left, right))
      })
    })
  })
  it('of', () => {
    const fa = R.observable.of(1)
    return fa
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
  })

  it('map', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const fb = R.observable.map(fa, double)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 4, 6])
      })
  })

  it('ap', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const triple = (n: number): number => n * 3
    const fab = from([double, triple])
    const fb = R.observable.ap(fab, fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [3, 6, 9])
      })
  })

  it('chain', () => {
    const fa = from([1, 2, 3])
    const fb = R.observable.chain(fa, a => from([a, a + 1]))
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1, 2, 2, 3, 3, 4])
      })
  })

  it('filterMap', () => {
    const fa = from([1, 2, 3])
    const fb = R.observable.filterMap(
      fa,
      O.fromPredicate(n => n > 1)
    )
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('compact', () => {
    const fa = from([1, 2, 3].map(O.fromPredicate(n => n > 1)))
    const fb = R.observable.compact(fa)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('filter', () => {
    const fa = from([1, 2, 3])
    const fb = R.observable.filter(fa, n => n > 1)
    return fb
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [2, 3])
      })
  })

  it('partitionMap', () => {
    const fa = from([1, 2, 3])
    const s = R.observable.partitionMap(
      fa,
      E.fromPredicate(n => n > 1, identity)
    )
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('separate', () => {
    const fa = from([1, 2, 3].map(E.fromPredicate(n => n > 1, identity)))
    const s = R.observable.separate(fa)
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('partition', () => {
    const fa = from([1, 2, 3])
    const s = R.observable.partition(fa, n => n > 1)
    return s.left
      .pipe(bufferTime(10))
      .toPromise()
      .then(events => {
        assert.deepStrictEqual(events, [1])
      })
      .then(() =>
        s.right
          .pipe(bufferTime(10))
          .toPromise()
          .then(events => {
            assert.deepStrictEqual(events, [2, 3])
          })
      )
  })

  it('zero', async () => {
    const events = await R.observable
      .zero()
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [])
  })

  it('alt', async () => {
    const events = await R.observable
      .alt(R.observable.of(1), () => R.observable.of(2))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('getMonoid', async () => {
    const M = R.getMonoid<number>()
    const events = await M.concat(R.observable.of(1), R.observable.of(2))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1, 2])
  })

  it('fromOption', async () => {
    const events = await R.fromOption(O.some(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])

    const noEvents = await R.fromOption(O.none)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(noEvents, [])
  })

  it('fromIO', async () => {
    const events = await R.fromIO(() => 1)
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])
  })

  it('fromTask', async () => {
    const events = await R.fromTask(T.of(1))
      .pipe(bufferTime(10))
      .toPromise()
    assert.deepStrictEqual(events, [1])
  })

  it('toTask', async () => {
    const t = await R.toTask(R.of(1))()
    assert.deepStrictEqual(t, 1)
  })
})
