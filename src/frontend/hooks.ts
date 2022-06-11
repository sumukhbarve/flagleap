import React from 'react'
import type { Lookable } from 'monoduck'
import { _, roqsduck } from 'monoduck'
import * as store from './store'

type VoidFn = () => void // TODO: Import this?

// The following type is written in a way that conforms with ts-standard.
type EffectFn = VoidFn | (() => VoidFn | Promise<void> | Promise<VoidFn>)
// It is equivalent to::
//    () => (void | VoidFn | Promise<void | VoidFn>)
// But @typescript-eslint/no-invalid-void-type says:
//    If void is used as return type, it shouldn’t be a part of ... union ...

const useAsyncEffect = function (
  effect: EffectFn,
  deps: unknown[] | undefined // accepts undefined, but only explicitly
): void {
  React.useEffect(function () {
    const effectOut = effect()
    const cleanupAsync = Promise.resolve(effectOut)
    return function () {
      // TODO: Consider something stronger than _.noop()?
      cleanupAsync.then(cleanupSync => cleanupSync?.()).catch(_.noop)
    }
  }, deps)
}

const makeUseMountExpectsElseRedir = function<T> (
  lookable: Lookable<T>, expectedVal: T, redirToId: string
): () => void {
  const useMountExpectsElseRedir = function (): void {
    const val = store.use(lookable)
    React.useEffect(function () {
      if (val !== expectedVal) {
        roqsduck.setRouteInfo({ id: redirToId })
      }
    }, [])
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
  useAsyncEffect,
  useMountExpectsLoggedIn,
  useMountExpectsLoggedOut
}
