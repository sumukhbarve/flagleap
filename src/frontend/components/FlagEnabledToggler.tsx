import { tapiduck, _ } from 'monoduck'
import React from 'react'
import { Form } from 'react-bootstrap'
import type { ZFlag } from '../../shared/z-models'
import * as store from '../store'
import { api } from '../../shared/endpoints'

export const FlagEnabledToggler: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  const modeRing = store.use(store.modeRing)
  // TODO: Use React.useCallback
  const onChange = async function (): Promise<void> {
    const flagX = {
      ...flag,
      [modeRing.enabled]: Number(_.not(flag[modeRing.enabled]))
    }
    store.loadingMsg.set('Toggling Flag ...')
    await _.sleep(1000)
    const updatedFlag = await tapiduck.fetch(api.internal.updateFlag, {
      flag: flagX, inapiToken: store.inapiToken.get()
    })
    store.setFlags([updatedFlag])
    store.loadingMsg.set('')
  }
  return (
    <Form.Check
      type='switch'
      checked={_.bool(flag[modeRing.enabled])}
      onChange={onChange}
    />
  )
}
