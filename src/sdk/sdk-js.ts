import { api } from '../shared/endpoints'
import { ZTraits, ZModeEnum, ZFlagout, ZFlagoutMap } from '../shared/z-models'
import { _, tapiduck } from 'monoduck'

interface FlagleapClient {
  init: () => Promise<void>
  reset: () => void
  setTraits: (newTraits: ZTraits) => void
  getFlag: (flagId: string) => Promise<ZFlagout>
}

const buildFlagleapClient = function (
  serverUrl: string,
  mode: ZModeEnum = 'test',
  traits: ZTraits = {}
): FlagleapClient {
  const tapiFetch = tapiduck.fetchUsing(serverUrl)

  let flagoutMap: ZFlagoutMap = {}
  let initDone = false
  const reset = function (): void {
    flagoutMap = {}
    initDone = false
  }

  const init = async function (): Promise<void> {
    if (!initDone) {
      flagoutMap = await tapiFetch(api.external.evalFlags, { mode, traits })
      initDone = true
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
    return flagoutMap[flagId] as ZFlagout
  }

  return {
    init, reset, setTraits, getFlag
  }
}

export type { FlagleapClient }
export { buildFlagleapClient }
