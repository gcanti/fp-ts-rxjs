import { Kind, URIS } from 'fp-ts/lib/HKT'
import { Alt1 } from 'fp-ts/lib/Alt'

/**
 * The `Plus` type class extends the `Alt` type class with a value that should be the left and right identity for `alt`.
 *
 * It is similar to `Monoid`, except that it applies to types of kind `* -> *`, like `Array` or `Option`, rather than
 * concrete types like `string` or `number`.
 *
 * `Plus` instances should satisfy the following laws:
 *
 * 1. Left identity: `A.alt(zero, fa) == fa`
 * 2. Right identity: `A.alt(fa, zero) == fa`
 * 3. Annihilation: `A.map(zero, f) == zero`
 *
 * @since 0.7.0
 */
export interface Plus1<F extends URIS> extends Alt1<F> {
  readonly zero: <A>() => Kind<F, A>
}
