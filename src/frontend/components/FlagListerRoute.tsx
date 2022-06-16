import React from 'react'
import { tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { useMountExpectsLoggedIn, useAsyncEffect } from '../hooks'
import { CreateFlagButton } from './CreateFlagButton'
import { FlagCard } from './FlagCard'
import { Col, Row } from 'react-bootstrap'
import { FlagSearchbox } from './FlagSearchbox'

export const FlagListerRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  const flagList = store.use(store.searchedFlagList)
  const inapiToken = store.use(store.inapiToken)
  const loggedIn = store.use(store.loggedIn)
  useAsyncEffect(async function () {
    if (loggedIn && flagList.length === 0) {
      store.loadingMsg.set('Fetching Flags ...')
      const fetchedFlags = await tapiduck.fetch(api.internal.getFlags, {
        inapiToken
      })
      store.flagMap.updateObjects(fetchedFlags)
      store.loadingMsg.set('')
    }
  }, [])
  return (
    <div>
      <h1 className='mb-3'>Flags</h1>
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
