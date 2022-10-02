import { ZFlagout } from '../shared/z-models'
import type { FlagleapClient } from './sdk-js'
import type { VoidFn } from 'monoduck'

type UseFlagFn = (flagId: string) => {
  loading: boolean
  ready: boolean
  _tick: number
} & ZFlagout

// Not importing from monoduck, as the below usage is shaped a bit differently
type CbFn<T> = (oldVal: T) => T
interface FlagleapSdkReacty {
  useState: <T>(t: T) => [T, (newValOrCb: T | CbFn<T>) => void ]
  useEffect: (fn: (VoidFn | (() => VoidFn)), deps: unknown[]) => void
}

const makeUseFlag = function (
  flagleapClient: FlagleapClient,
  React: FlagleapSdkReacty
): UseFlagFn {
  const useFlag: UseFlagFn = function (flagId: string) {
    const [loading, setLoading] = React.useState(false)
    const [ready, setReady] = React.useState(false)
    const [flagout, setFlagout] = React.useState<ZFlagout>({
      id: flagId, enabled: false, value: ''
    })
    const [tick, setTick] = React.useState(0) // Helps force udpate
    React.useEffect(function () {
      const unsub = flagleapClient.subscribe(() => setTick(t => (t + 1) % 2e9))
      return unsub
    }, [])
    React.useEffect(function () {
      const asyncEffect = async function (): Promise<void> {
        setLoading(true)
        setFlagout(await flagleapClient.getFlag(flagId))
        setLoading(false)
        setReady(true)
      }
      asyncEffect().catch(e => { throw new Error(e) })
    }, [flagId, tick])
    return { loading, ready, _tick: tick, ...flagout }
  }
  return useFlag
}

export type { FlagleapSdkReacty }
export { makeUseFlag }
