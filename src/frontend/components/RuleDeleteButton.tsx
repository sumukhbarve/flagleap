import React from 'react'
import { _, tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { Button } from 'react-bootstrap'

export const RuleDeleteButton: React.VFC<{ruleId: string}> = function (props) {
  const onDelete = async function (): Promise<void> {
    if (_.not(window.confirm('Are you sure?'))) {
      return undefined
    }
    store.loadingMsg.set('Deleting Rule ...')
    const rule = await tapiduck.fetch(api.internal.deleteRule, {
      rule_id: props.ruleId,
      inapiToken: store.inapiToken.get()
    })
    await _.sleep(1000)
    store.ruleMap.popByIds([rule.id])
    store.loadingMsg.set('')
  }
  return (
    <Button size='sm' variant='link' onClick={onDelete}>
      Delete
    </Button>
  )
}
