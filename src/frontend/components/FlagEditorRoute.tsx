import React from 'react'
import { _ } from 'monoduck'
import * as store from '../store'
import { useMountExpectsLoggedIn, useOnMount } from '../hooks'
import { FlagEditorForm } from './FlagEditorForm'

export const FlagEditorRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  const routeInfo = store.useRouteInfo()
  const flagId = routeInfo.flagId ?? ''
  const currentFlag = store.use(store.currentFlag)
  useOnMount(async function () {
    store.currentFlagId.set(routeInfo.flagId ?? '')
  })
  if (_.not(currentFlag)) {
    return <h3>No such flag with ID: <code>{flagId}</code></h3>
  }
  return (
    <div>
      <h2>Flag <code>{flagId}</code></h2>
      <FlagEditorForm flag={currentFlag} />
      <pre>{JSON.stringify(currentFlag, null, 4)}</pre>
    </div>
  )
}
