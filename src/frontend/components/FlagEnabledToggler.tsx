import { tapiduck, _ } from 'monoduck'
import React from 'react'
import { Form } from 'react-bootstrap'
import type { ZFlag } from '../../shared/z-models'
import { store, useStore } from '../store'
import { api } from '../../shared/endpoints'

export const FlagEnabledToggler: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  const { modeRing } = useStore('modeRing')
  // TODO: Use React.useCallback
  const onChange = async function (): Promise<void> {
    store.spinnerText.set('Toggling Flag ...')
    const resp = await tapiduck.fetch(api.internal.updateFlag, {
      inapiToken: store.inapiToken.get(),
      flag: {
        id: flag.id,
        [modeRing.enabled]: Number(_.not(flag[modeRing.enabled]))
      }
    })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const updatedFlag = resp.data
    store.flagMap.updateObjects([updatedFlag])
  }
  return (
    <Form.Check
      type='switch'
      checked={_.bool(flag[modeRing.enabled])}
      onChange={onChange}
    />
  )
}
