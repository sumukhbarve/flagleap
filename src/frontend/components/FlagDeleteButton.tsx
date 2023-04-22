import React from 'react'
import { _, tapiduck, roqsduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store } from '../store'
import { Button } from 'react-bootstrap'

const onDelete = async function (flagId: string): Promise<void> {
  if (_.not(window.confirm('Are you sure?'))) {
    return undefined
  }
  store.spinnerText.set('Deleting Flag ...')
  const resp = await tapiduck.fetch(api.internal.deleteFlag, {
    flag_id: flagId,
    inapiToken: store.inapiToken.get()
  })
  store.spinnerText.set('')
  if (resp.status !== 'success') {
    return window.alert(tapiduck.failMsg(resp, data => data))
  }
  const flagToPop = _.bang(store.flagMap.getById(resp.data.id))
  const rulesToPop = store.flagwiseRuleList.get()[flagToPop.id] ?? []
  store.flagMap.popByIds([flagToPop.id])
  store.ruleMap.popByIds(rulesToPop.map(r => r.id))
  roqsduck.setRouteInfo({ id: 'flagLister' })
}

export const FlagDeleteButton: React.VFC<{flagId: string}> = function ({flagId}) {
  return (
    <Button size='sm' variant='secondary' onClick={() => onDelete(flagId)}>
      Delete Flag
    </Button>
  )
}
