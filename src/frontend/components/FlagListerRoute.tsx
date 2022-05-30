import React from 'react'
import { tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { useMountExpectsLoggedIn, useOnMount } from '../hooks'
import { CreateFlagButton } from './CreateFlagButton'
import { FlagCard } from './FlagCard'

export const FlagListerRoute: React.VFC = function () {
  useMountExpectsLoggedIn()
  const flagList = store.use(store.flagList)
  const inapiToken = store.use(store.inapiToken)
  const loggedIn = store.use(store.loggedIn)
  useOnMount(async function () {
    if (loggedIn && flagList.length === 0) {
      store.loadingMsg.set('Fetching Flags ...')
      const fetchedFlags = await tapiduck.fetch(api.internal.getFlags, {
        inapiToken
      })
      store.setFlags(fetchedFlags)
      store.loadingMsg.set('')
    }
  })
  return (
    <div>
      <h2>Flags</h2>
      <div className='mb-3'>
        <CreateFlagButton />
      </div>
      {flagList.map(flag => <FlagCard flag={flag} key={flag.id} />)}
    </div>
  )
}
