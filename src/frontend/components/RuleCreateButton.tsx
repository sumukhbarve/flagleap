import React from 'react'
import { tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store } from '../store'
import { Button } from 'react-bootstrap'
import { getIdForRuleEditButton } from '../helpers'

interface Props {
  flagId: string
  newRank: number
}
export const RuleCreateButton: React.VFC<Props> = function (props) {
  const { flagId, newRank } = props
  const onCreate = async function (): Promise<void> {
    store.loadingMsg.set('Creating Rule ...')
    const rule = await tapiduck.fetch(api.internal.createRule, {
      flag_id: flagId,
      mode: store.mode.get(),
      rank: newRank,
      inapiToken: store.inapiToken.get()
    })
    store.ruleMap.updateObjects([rule])
    store.loadingMsg.set('')
    setTimeout(function () {
      document.getElementById(getIdForRuleEditButton(rule.id))?.click()
    }, 10)
  }
  return <Button onClick={onCreate}>Create Rule</Button>
}
