# Changelog

> **Tags:**
>
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]

**Note**: Gaps between patch versions are faulty/broken releases. **Note**: A feature tagged as Experimental is in a
high state of flux, you're at risk of it changing without notice.

# 0.6.12

- **Deprecations**
  - `Observable`
    - deprecate `observable` (@gcanti)
  - `ObservableEither`
    - deprecate `observableEither` (@gcanti)
  - `ReaderObservable`
    - deprecate `readerObservable` (@gcanti)
  - `ReaderObservable`
    - deprecate `readerObservable` (@gcanti)
  - `ReaderObservableEither`
    - deprecate `readerObservableEither` (@gcanti)
  - `StateReaderObservableEither`
    - deprecate `stateReaderObservableEither` (@gcanti)
- **New Feature**
  - add `ObservableThese`, #44 (@siuvdlec)
  - expose `fp-ts-rxjs` modules without lib/es6 prefix, closes #40 (@gcanti)
  - `Observable`
    - add `Do` (@gcanti)
    - add `Functor` instance (@gcanti)
    - add `Apply` instance (@gcanti)
    - add `Applicative` instance (@gcanti)
    - add `Monad` instance (@gcanti)
    - add `Alt` instance (@gcanti)
    - add `zero` (@gcanti)
    - add `Alternative` instance (@gcanti)
    - add `Compactable` instance (@gcanti)
    - add `Filterable` instance (@gcanti)
    - add `MonadIO` instance (@gcanti)
    - add `MonadTask` instance (@gcanti)
    - add `MonadObservable` instance (@gcanti)
  - `ObservableEither`
    - add `Do` (@gcanti)
    - add `of` (@gcanti)
    - add `bindW` (@gcanti)
    - add `Functor` instance (@gcanti)
    - add `Apply` instance (@gcanti)
    - add `Applicative` instance (@gcanti)
    - add `Monad` instance (@gcanti)
    - add `Bifunctor` instance (@gcanti)
    - add `Alt` instance (@gcanti)
    - add `MonadIO` instance (@gcanti)
    - add `MonadTask` instance (@gcanti)
    - add `MonadObservable` instance (@gcanti)
    - add `MonadThrow` instance (@gcanti)
  - `ReaderObservable`
    - add `Do` (@gcanti)
    - add `bindW` (@gcanti)
    - add `Functor` instance (@gcanti)
    - add `Apply` instance (@gcanti)
    - add `Applicative` instance (@gcanti)
    - add `Monad` instance (@gcanti)
    - add `Alt` instance (@gcanti)
    - add `zero` (@gcanti)
    - add `Alternative` instance (@gcanti)
    - add `Compactable` instance (@gcanti)
    - add `Filterable` instance (@gcanti)
    - add `MonadIO` instance (@gcanti)
    - add `MonadTask` instance (@gcanti)
    - add `MonadObservable` instance (@gcanti)
  - `ReaderObservableEither`
    - add `Do` (@gcanti)
    - add `bindW` (@gcanti)
    - add `Functor` instance (@gcanti)
    - add `Apply` instance (@gcanti)
    - add `Applicative` instance (@gcanti)
    - add `Monad` instance (@gcanti)
    - add `Bifunctor` instance (@gcanti)
    - add `MonadIO` instance (@gcanti)
    - add `MonadTask` instance (@gcanti)
    - add `MonadObservable` instance (@gcanti)
    - add `MonadThrow` instance (@gcanti)
  - `StateReaderObservableEither`
    - add `of` (@gcanti)
    - add `bindW` (@gcanti)
    - add `Functor` instance (@gcanti)
    - add `Apply` instance (@gcanti)
    - add `Applicative` instance (@gcanti)
    - add `Monad` instance (@gcanti)
    - add `Bifunctor` instance (@gcanti)
    - add `MonadIO` instance (@gcanti)
    - add `MonadTask` instance (@gcanti)
    - add `MonadObservable` instance (@gcanti)
    - add `MonadThrow` instance (@gcanti)
- **Polish**
  - export `MonadObservable` from `index.ts` (@canti)
- **Internal**
  - `Observable`
    - make `fromIO` synchronous, #43 (@anthonyjoeseph)

# 0.6.11

- **New Feature**
  - add `bind` and `bindTo` for all modules, #36 (@waynevanson)

# 0.6.10

- **New Feature**
  - add `ReaderObservableEither` module, #34 (@waynevanson )
  - add `StateReaderObservableEither` module, #34 (@waynevanson )
  - add `MonadObservable4` interface, #34 (@waynevanson )

# 0.6.9

- **Polish**
  - add `fromReaderTask` to `ReaderObservable`, #26 (@mlegenhausen)

# 0.6.8

- **New Feature**
  - add `ObservableEither` module, #25 (@pheis)

# 0.6.7

- **New Feature**
  - `ReaderObservable`
    - add `Alternative` and `Filterable` instances (@mlegenhausen)

# 0.6.6

- **New Feature**
  - add `ReaderObservable` module (@mlegenhausen)
  - add `MonadObservable` module (@mlegenhausen)
  - `Observable`
    - add `of` function (@mlegenhausen)
- **Internal**
  - upgrade to `fp-ts@2.4.3` (@mlegenhausen)
- **Bug Fix**
  - don't set `target: es6` in `tsconfig.build-es6.json` (@gcanti)

# 0.6.5

- **New Feature**
  - add `fromOption`, `fromIO` and `fromTask`, #20 (@mlegenhausen)

# 0.6.4

- **Bug Fix**
  - add sideEffects field to package.json (@gcanti)

# 0.6.3

- **Bug Fix**
  - rewrite es6 imports (@gcanti)

# 0.6.2

- **New Feature**
  - Provide version with ES modules (@OliverJAsh)

# 0.6.0

- **Breaking Change**
  - upgrade to `fp-ts@2.x` (@gcanti)
  - move `fp-ts` and `rxjs` to `peerDependencies` (@gcanti)

# 0.5.1

- **New Feature**
  - add `Filterable` instance (@giogonzo)

# 0.5.0

- **Breaking Change**
  - upgrade to `rxjs@6` (@marcinwadon)
- **Internal**
  - upgrade to `typescript@2.8.3` (@marcinwadon)

# 0.4.0

- **Breaking Change**
  - upgrade to `fp-ts@1.x.x` (@gcanti)

# 0.3.0

- **Breaking Change**
  - upgrade to latest fp-ts (0.6) and latest TypeScript (2.6) (@gcanti)

# 0.2.0

- **Breaking Change**
  - upgrade to latest fp-ts (0.5.1) and latest TypeScript (2.5.2) (@gcanti)

# 0.1.1

- **Internal**
  - upgrade to latest fp-ts (0.4.3) (@gcanti)

# 0.1.0

- **Breaking Change**
  - upgrade to latest fp-ts (@gcanti)

# 0.0.1

Initial release
