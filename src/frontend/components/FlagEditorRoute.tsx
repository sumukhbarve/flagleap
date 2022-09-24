import React from 'react'
import { _, tapiduck } from 'monoduck'
import { store } from '../store'
import { useMountExpectsLoggedIn, useAsyncEffect } from '../hooks'
import { FlagEditorForm } from './FlagEditorForm'
import { api } from '../../shared/endpoints'
import { FlagDeleteButton } from './FlagDeleteButton'
import { Col, Row } from 'react-bootstrap'
import { RuleLister } from './RuleLister'

export const FlagEditorRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  const routeInfo = store.useRouteInfo()
  const flagId = routeInfo.flagId ?? ''
  const currentFlag = store.use(store.currentFlag)
  const currentRules = store.use(store.currentRules)
  const loggedIn = store.use(store.loggedIn)
  useAsyncEffect(async function () {
    store.currentFlagId.set(flagId)
    if (_.bool(flagId) && loggedIn && _.not(currentRules.length)) {
      store.spinnerText.set('Fetching Rules ...')
      const fetchedRules = await tapiduck.fetch(api.internal.getFlagRules, {
        inapiToken: store.inapiToken.get(),
        flag_id: store.currentFlagId.get()
      })
      store.ruleMap.updateObjects(fetchedRules)
      store.spinnerText.set('')
    }
  }, [])
  if (_.not(currentFlag)) {
    return <h3>No such flag with ID: <code>{flagId}</code></h3>
  }
  return (
    <div>
      <Row>
        <Col>
          <h3><code>{flagId}</code></h3>
        </Col>
        <Col className='alignRight'>
          <FlagDeleteButton flagId={currentFlag.id} />
        </Col>
      </Row>
      <div className='mb-4' />
      <FlagEditorForm flag={currentFlag} key={JSON.stringify(currentFlag)} />
      <div className='mb-4' />
      <div style={{ borderBottom: '1px solid slategray' }} />
      <div className='mb-4' />
      <RuleLister rules={currentRules} flag={currentFlag} />

    </div>
  )
}
