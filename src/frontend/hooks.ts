import React from 'react'
import type { Lookable } from 'monoduck'
import { roqsduck } from 'monoduck'
import * as store from './store'

const useAsyncEffect = function (
  effect?: () => void, cleanup?: () => void, deps?: unknown[]
): void {
  React.useEffect(function () {
    effect?.()
    return function () {
      cleanup?.()
    }
  }, deps)
}

const useOnMount = function (fn: () => unknown): void {
  useAsyncEffect(fn, undefined, [])
}
const useOnUnmount = function (fn: () => unknown): void {
  useAsyncEffect(undefined, fn, [])
}

const makeUseMountExpectsElseRedir = function<T> (
  lookable: Lookable<T>, expectedVal: T, redirToId: string
): () => void {
  const useMountExpectsElseRedir = function (): void {
    const val = store.use(lookable)
    useOnMount(function () {
      if (val !== expectedVal) {
        roqsduck.setRouteInfo({ id: redirToId })
      }
    })
  }
  return useMountExpectsElseRedir
}

const useMountExpectsLoggedIn = makeUseMountExpectsElseRedir(
  store.loggedIn, true, 'login'
)
const useMountExpectsLoggedOut = makeUseMountExpectsElseRedir(
  store.loggedIn, false, 'flagLister'
)

export {
  useOnMount,
  useOnUnmount,
  useMountExpectsLoggedIn,
  useMountExpectsLoggedOut
}
