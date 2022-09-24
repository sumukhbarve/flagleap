import React from 'react'
import { ZFlagout } from '../shared/z-models'
import type { FlagleapClient } from './sdk-js'

type UseFlagFn = (flagId: string) => {
  loading: boolean
  ready: boolean
} & ZFlagout

export const makeUseFlag = function (
  flagleapClient: FlagleapClient
): UseFlagFn {
  const useFlag: UseFlagFn = function (flagId: string) {
    const [loading, setLoading] = React.useState(false)
    const [ready, setReady] = React.useState(false)
    const [flagout, setFlagout] = React.useState<ZFlagout>({
      id: flagId, enabled: false, value: ''
    })
    React.useEffect(function () {
      const asyncEffect = async function (): Promise<void> {
        setLoading(true)
        setFlagout(await flagleapClient.getFlag(flagId))
        setLoading(false)
        setReady(true)
      }
      asyncEffect().catch(e => { throw new Error(e) })
    }, [flagId])
    return { loading, ready, ...flagout }
  }
  return useFlag
}
