import React from 'react'
import { tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { Button } from 'react-bootstrap'

interface Props {
  flagId: string
  newRank: number
}
export const CreateRuleButton: React.VFC<Props> = function (props) {
  const { flagId, newRank } = props
  const onCreate = async function (): Promise<void> {
    store.loadingMsg.set('Creating Rule ...')
    const rule = await tapiduck.fetch(api.internal.createRule, {
      flag_id: flagId,
      mode: store.mode.get(),
      rank: newRank,
      inapiToken: store.inapiToken.get()
    })
    store.setRules([rule])
    store.loadingMsg.set('')
  }
  return <Button onClick={onCreate}>Create Rule</Button>
}
