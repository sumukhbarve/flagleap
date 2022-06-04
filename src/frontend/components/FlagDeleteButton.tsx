import React from 'react'
import { _, tapiduck, roqsduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { Button } from 'react-bootstrap'

export const FlagDeleteButton: React.VFC<{flagId: string}> = function (props) {
  const onDelete = async function (): Promise<void> {
    if (_.not(window.confirm('Are you sure?'))) {
      return undefined
    }
    store.loadingMsg.set('Deleting Flag ...')
    const resdata = await tapiduck.fetch(api.internal.deleteFlag, {
      flag_id: props.flagId,
      inapiToken: store.inapiToken.get()
    })
    store.deleteFlagsById([resdata.id])
    // TODO: Remove flag-linked rules from store?
    store.loadingMsg.set('')
    roqsduck.setRouteInfo({ id: 'flagLister' })
  }
  return (
    <Button size='sm' variant='secondary' onClick={onDelete}>
      Delete Flag
    </Button>
  )
}
