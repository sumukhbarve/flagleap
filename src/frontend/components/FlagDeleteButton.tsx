import React from 'react'
import { _, tapiduck, roqsduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store } from '../store'
import { Button } from 'react-bootstrap'

export const FlagDeleteButton: React.VFC<{flagId: string}> = function (props) {
  const onDelete = async function (): Promise<void> {
    if (_.not(window.confirm('Are you sure?'))) {
      return undefined
    }
    store.spinnerText.set('Deleting Flag ...')
    const resdata = await tapiduck.fetch(api.internal.deleteFlag, {
      flag_id: props.flagId,
      inapiToken: store.inapiToken.get()
    })
    const flagToPop = _.bang(store.flagMap.getById(resdata.id))
    const rulesToPop = store.flagwiseRuleList.get()[flagToPop.id] ?? []
    store.flagMap.popByIds([flagToPop.id])
    store.ruleMap.popByIds(rulesToPop.map(r => r.id))
    store.spinnerText.set('')
    roqsduck.setRouteInfo({ id: 'flagLister' })
  }
  return (
    <Button size='sm' variant='secondary' onClick={onDelete}>
      Delete Flag
    </Button>
  )
}
