import { api } from '../shared/endpoints'
import { ZTraits, ZModeEnum, ZFlagout, ZFlagoutMap } from '../shared/z-models'
import type { VoidFn } from 'monoduck'
import { _, tapiduck } from 'monoduck'
import { io } from 'socket.io-client'

const injectIsomorphicFetch = tapiduck.injectIsomorphicFetch

type FlagleapInitStatus = 'todo' | 'doing' | 'done'

interface FlagleapClientOptions {
  instanceUrl: string
  mode: ZModeEnum
  traits?: ZTraits
}

interface FlagleapClient {
  reset: () => void
  init: () => Promise<void>
  setTraits: (newTraits: ZTraits) => void
  getFlag: (flagId: string) => Promise<ZFlagout>
  subscribe: (fn: VoidFn) => void
}

const buildFlagleapClient = function (
  opt: FlagleapClientOptions
): FlagleapClient {
  const { instanceUrl, mode, traits: optTraits } = opt

  let traits = optTraits ?? {}
  let flagoutMap: ZFlagoutMap = {}
  let initStatus: FlagleapInitStatus = 'todo'

  const subscribers = new Set<VoidFn>()
  const subscribe = function (fn: VoidFn): VoidFn {
    subscribers.add(fn)
    return () => subscribers.delete(fn)
  }
  const reset = function (): void {
    flagoutMap = {}
    initStatus = 'todo' // TODO: Emit a warning if reset during 'doing'?
  }

  const tapiFetch = tapiduck.fetchUsing(instanceUrl)
  const init = async function (): Promise<void> {
    if (initStatus === 'todo') {
      initStatus = 'doing'
      const resp = await tapiFetch(api.external.evalFlags, { mode, traits })
      if (resp.status !== 'success') {
        console.error('FlagLeap API call did NOT succeed.')
        console.error(tapiduck.failMsg(resp, data => data))
        initStatus = 'todo' // revert status back to 'todo'
        return undefined
      }
      flagoutMap = resp.data
      initStatus = 'done'
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
    await init()
    if (flagoutMap[flagId] === undefined) {
      flagoutMap[flagId] = {
        id: flagId,
        enabled: false,
        value: ''
      }
    }
    return _.bang(flagoutMap[flagId])
  }

  const socket = io(instanceUrl, { transports: ['websocket'] })
  tapiduck.sockOn(
    socket,
    api.external.sock.flagNotifFromServer,
    function ({flag_id: flagId, mode}) {
      const asyncFn = async function (): Promise<void> {
        const resp = await tapiFetch(api.external.evalFlag, {
          flag_id: flagId, mode, traits
        })
        if (resp.status !== 'success') {
          console.error(`Evaluation did NOT succeed for flag: ${flagId}`)
          console.error(tapiduck.failMsg(resp, data => data))
          return undefined
        }
        const flagout = resp.data
        flagoutMap[flagout.id] = flagout
        subscribers.forEach(fn => fn())
      }
      asyncFn().catch(e => { throw new Error(e) })
    }
  )

  return {
    reset,
    init,
    setTraits,
    getFlag,
    subscribe
  }
}

export type { FlagleapClientOptions, FlagleapInitStatus, FlagleapClient }
export { injectIsomorphicFetch, buildFlagleapClient }
