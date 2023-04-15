import React from 'react'
import { tapiduck, _ } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store } from '../store'
import { useAsyncEffect, useMountExpectsLoggedIn } from '../hooks'
import { CreateFlagButton } from './CreateFlagButton'
import { FlagCard } from './FlagCard'
import { Col, Row } from 'react-bootstrap'
import { FlagSearchbox } from './FlagSearchbox'

const flagListerRouteLoader = async function (): Promise<void> {
  const inapiToken = store.inapiToken.get()
  if (_.bool(inapiToken) && store.flagList.get().length === 0) {
    store.spinnerText.set('Fetching Flags ...')
    const flags = await tapiduck.fetch(api.internal.getFlags, { inapiToken })
    store.flagMap.updateObjects(flags)
    store.spinnerText.set('')
  }
}

export const FlagListerRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  useAsyncEffect(async function () {
    await flagListerRouteLoader()
  }, [])
  const flagList = store.use(store.searchedFlagList)
  return (
    <div>
      <h2 className='mb-3'>Flags</h2>
      <Row>
        <Col>
          <FlagSearchbox />
        </Col>
        <Col className='alignRight'>
          <CreateFlagButton />
        </Col>
      </Row>
      <div className='mb-4' />
      {flagList.map(flag => <FlagCard flag={flag} key={flag.id} />)}
    </div>
  )
}
