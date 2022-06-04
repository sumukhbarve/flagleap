import React from 'react'
import { _, tapiduck } from 'monoduck'
import * as store from '../store'
import { useMountExpectsLoggedIn, useOnMount } from '../hooks'
import { FlagEditorForm } from './FlagEditorForm'
import { api } from '../../shared/endpoints'
import { RuleCard } from './RuleCard'
import { CreateRuleButton } from './CreateRuleButton'
import { FlagDeleteButton } from './FlagDeleteButton'

export const FlagEditorRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  const routeInfo = store.useRouteInfo()
  const flagId = routeInfo.flagId ?? ''
  const currentFlag = store.use(store.currentFlag)
  const currentRules = store.use(store.currentRules)
  const loggedIn = store.use(store.loggedIn)
  useOnMount(async function () {
    store.currentFlagId.set(flagId)
    await _.sleep(0)
    if (_.bool(flagId) && loggedIn && _.not(currentRules.length)) {
      store.loadingMsg.set('Fetching Rules ...')
      const fetchedRules = await tapiduck.fetch(api.internal.getFlagRules, {
        inapiToken: store.inapiToken.get(),
        flag_id: store.currentFlagId.get()
      })
      store.setRules(fetchedRules)
      store.loadingMsg.set('')
    }
  })
  if (_.not(currentFlag)) {
    return <h3>No such flag with ID: <code>{flagId}</code></h3>
  }
  return (
    <div>
      <h2>Flag <code>{flagId}</code></h2>
      <FlagEditorForm flag={currentFlag} key={JSON.stringify(currentFlag)} />
      <FlagDeleteButton flagId={currentFlag.id} />
      <h4>Current Rules:</h4>
      {currentRules.map(
        rule => <RuleCard rule={rule} key={JSON.stringify(rule)} />
      )}
      <CreateRuleButton
        flagId={currentFlag.id}
        newRank={Math.max(...[0, ..._.map(currentRules, r => r.rank)]) + 10}
      />

    </div>
  )
}
