import { ZFlagout } from '../shared/z-models'
import type { FlagleapClient } from './sdk-js'
import type { VoidFn } from 'monoduck'

type UseFlagFn = (flagId: string) => {
  loading: boolean
  ready: boolean
  _ticker: number
} & ZFlagout

// Not importing from monoduck, as the below usage is shaped a bit differently
type CbFn<T> = (oldVal: T) => T
interface Reacty {
  useState: <T>(t: T) => [T, (newValOrCb: T | CbFn<T>) => void ]
  useEffect: (fn: (VoidFn | (() => VoidFn)), deps: unknown[]) => void
}

export const makeUseFlag = function (
  flagleapClient: FlagleapClient,
  React: Reacty
): UseFlagFn {
  const useFlag: UseFlagFn = function (flagId: string) {
    const [loading, setLoading] = React.useState(false)
    const [ready, setReady] = React.useState(false)
    const [flagout, setFlagout] = React.useState<ZFlagout>({
      id: flagId, enabled: false, value: ''
    })
    const [ticker, setTicker] = React.useState(0) // Helps force udpate
    React.useEffect(function () {
      const unsub = flagleapClient.subscribe(() => setTicker(t => (t + 1) % 2e9))
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
    }, [flagId, ticker])
    return { loading, ready, _ticker: ticker, ...flagout }
  }
  return useFlag
}
