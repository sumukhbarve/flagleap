import React from 'react'
import { tapiduck, _ } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store, useStore } from '../store'
import { useAsyncEffect, useMountExpectsLoggedIn } from '../hooks'
import { CreateFlagButton } from './CreateFlagButton'
import { FlagCard } from './FlagCard'
import { Col, Row } from 'react-bootstrap'
import { FlagSearchbox } from './FlagSearchbox'

const flagListerRouteLoader = async function (): Promise<void> {
  const inapiToken = store.inapiToken.get()
  if (_.bool(inapiToken) && store.flagList.get().length === 0) {
    store.spinnerText.set('Fetching Flags ...')
    const resp = await tapiduck.fetch(api.internal.getFlags, { inapiToken })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const flags = resp.data
    store.flagMap.updateObjects(flags)
  }
}

export const FlagListerRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  useAsyncEffect(async function () {
    await flagListerRouteLoader()
  }, [])
  const { searchedFlagList } = useStore('searchedFlagList')
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
      {searchedFlagList.map(flag => <FlagCard flag={flag} key={flag.id} />)}
    </div>
  )
}
