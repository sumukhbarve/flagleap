import React from 'react'
import type { Lookable } from 'monoduck'
import { _, roqsduck } from 'monoduck'
import { store } from './store'

type VoidFn = () => void // TODO: Import this?

// Type is `() => (void | VoidFn | Promise<void | VoidFn>)`; ts-standard likes:
type FlexEffectFn = VoidFn | (() => VoidFn | Promise<void> | Promise<VoidFn>)

const useAsyncEffect = function (
  effect: FlexEffectFn,
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

const useMountedRef = function (): React.MutableRefObject<boolean> {
  const mountedRef = React.useRef(true)
  React.useEffect(function () {
    return () => { mountedRef.current = false } // cleanup fn
  }, [])
  return mountedRef
}

export {
  useAsyncEffect,
  useMountExpectsLoggedIn,
  useMountExpectsLoggedOut,
  useMountedRef
}
