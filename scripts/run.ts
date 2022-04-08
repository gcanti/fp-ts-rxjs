import { fold } from 'fp-ts/Either'
import type { TaskEither } from 'fp-ts/TaskEither'

export function run<A>(eff: TaskEither<Error, A>): void {
    eff()
        .then(
            fold(
                e => {
                    throw e
                },
                _ => {
                    process.exitCode = 0
                }
            )
        )
        .catch(e => {
            // eslint-disable-next-line no-console
            console.error(e)

            process.exitCode = 1
        })
}
