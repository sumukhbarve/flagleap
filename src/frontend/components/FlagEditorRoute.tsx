import React from 'react'
import { _, tapiduck, roqsduck } from 'monoduck'
import { store, useStore } from '../store'
import { useAsyncEffect, useMountExpectsLoggedIn } from '../hooks'
import { FlagEditorForm } from './FlagEditorForm'
import { api } from '../../shared/endpoints'
import { FlagDeleteButton } from './FlagDeleteButton'
import { Col, Row } from 'react-bootstrap'
import { RuleLister } from './RuleLister'

const flagEditorRouteLoader = async function (flagId: string): Promise<void> {
  const inapiToken = store.inapiToken.get()
  if (_.not(inapiToken)) {
    return undefined
  }
  if (store.flagList.get().length === 0) {
    store.spinnerText.set('Fetching Flags ...')
    const resp = await tapiduck.fetch(api.internal.getFlags, { inapiToken })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const flags = resp.data;
    store.flagMap.updateObjects(flags)
  }
  const currentFlag = store.flagMap.get()[flagId] ?? null
  const rulesEmpty = _.not(store.flagwiseRuleList.get()[flagId]?.length)
  if (_.bool(currentFlag) && rulesEmpty) {
    store.spinnerText.set('Fetching Rules ...')
    const resp = await tapiduck.fetch(api.internal.getFlagRules, {
      inapiToken, flag_id: flagId
    })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const fetchedRules = resp.data
    store.ruleMap.updateObjects(fetchedRules)
  }
}

export const FlagEditorRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  const flagId = roqsduck.useRouteInfo().flagId ?? ''
  useAsyncEffect(async function () {
    store.currentFlagId.set(flagId)
    await flagEditorRouteLoader(flagId)
    return () => store.currentFlagId.reset()
  }, [flagId])
  const { currentFlag, currentRules } = useStore('currentFlag', 'currentRules')
  if (_.not(currentFlag)) {
    return <h3>No such flag with ID: <code>{flagId}</code></h3>
  }
  return (
    <div>
      <Row>
        <Col>
          <h3><code>{currentFlag.id}</code></h3>
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
