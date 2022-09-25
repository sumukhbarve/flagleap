import { api } from '../shared/endpoints'
import { ZTraits, ZModeEnum, ZFlagout, ZFlagoutMap } from '../shared/z-models'
import type { VoidFn } from 'monoduck'
import { _, tapiduck } from 'monoduck'

const injectIsomorphicFetch = tapiduck.injectIsomorphicFetch

interface FlagleapClientOptions {
  instanceUrl: string
  mode: ZModeEnum
  ttl?: number
  traits?: ZTraits
}

type FlagleapLoadingPhase = 'before' | 'during' | 'after'

interface FlagleapClient {
  getLoadingPhase: () => FlagleapLoadingPhase
  reset: () => void
  enforceTTL: () => void
  getTTL: () => number | undefined
  loadFlags: () => Promise<void>
  setTraits: (newTraits: ZTraits) => void
  getFlag: (flagId: string) => Promise<ZFlagout>
  subscribe: (fn: VoidFn) => void
  // setSingleFlagTTL: (ttl: number) => void
  // loadSingleFlag: (flagId: string) => Promise<ZFlagout>
}

const buildFlagleapClient = function (
  opt: FlagleapClientOptions
): FlagleapClient {
  const { instanceUrl, mode, ttl } = opt
  let traits = opt.traits ?? {}

  let flagoutMap: ZFlagoutMap = {}
  let flagoutMapLoadedAt = 0
  let loadingPhase: FlagleapLoadingPhase = 'before'
  const subscribers = new Set<VoidFn>()
  const subscribe = function (fn: VoidFn): VoidFn {
    subscribers.add(fn)
    return () => subscribers.delete(fn)
  }
  const getLoadingPhase = (): FlagleapLoadingPhase => loadingPhase
  const reset = function (): void {
    // flagoutMap = {} // <-- Don't do this, as it'll flick trues to falses
    flagoutMapLoadedAt = 0
    loadingPhase = 'before'
  }
  const enforceTTL = function (): void {
    // If TTL is undefined, then cache forever
    if (ttl === undefined) {
      return
    }
    if (loadingPhase === 'after' && Date.now() - flagoutMapLoadedAt > ttl) {
      reset()
      subscribers.forEach(fn => fn())
    }
  }
  if (ttl !== undefined) {
    setInterval(enforceTTL, ttl)
  }
  const getTTL = (): number => ttl

  const tapiFetch = tapiduck.fetchUsing(instanceUrl)
  const loadFlags = async function (): Promise<void> {
    if (loadingPhase === 'before') {
      loadingPhase = 'during'
      flagoutMap = await tapiFetch(api.external.evalFlags, { mode, traits })
      flagoutMapLoadedAt = Date.now()
      loadingPhase = 'after'
      subscribers.forEach(fn => fn())
    }
  }

  const setTraits = function (newTraits: ZTraits): void {
    if (!_.deepEquals(newTraits, traits)) {
      reset()
      traits = newTraits
    }
  }

  const getFlag = async function (flagId: string): Promise<ZFlagout> {
    enforceTTL()
    await loadFlags()
    if (flagoutMap[flagId] === undefined) {
      flagoutMap[flagId] = {
        id: flagId,
        enabled: false,
        value: ''
      }
    }
    return flagoutMap[flagId] as ZFlagout
  }

  return {
    getLoadingPhase,
    reset,
    enforceTTL,
    getTTL,
    loadFlags,
    setTraits,
    getFlag,
    subscribe
  }
}

export type { FlagleapClientOptions, FlagleapLoadingPhase, FlagleapClient }
export { injectIsomorphicFetch, buildFlagleapClient }
