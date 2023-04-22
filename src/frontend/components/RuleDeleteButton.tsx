import React from 'react'
import { _, tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store } from '../store'
import { Button } from 'react-bootstrap'

export const RuleDeleteButton: React.VFC<{ruleId: string}> = function (props) {
  const onDelete = async function (): Promise<void> {
    if (_.not(window.confirm('Are you sure?'))) {
      return undefined
    }
    store.spinnerText.set('Deleting Rule ...')
    const resp = await tapiduck.fetch(api.internal.deleteRule, {
      rule_id: props.ruleId,
      inapiToken: store.inapiToken.get()
    })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const rule = resp.data;
    store.ruleMap.popByIds([rule.id])
  }
  return (
    <Button size='sm' variant='link' onClick={onDelete}>
      Delete
    </Button>
  )
}
