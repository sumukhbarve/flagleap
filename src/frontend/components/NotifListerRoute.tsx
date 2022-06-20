import React from 'react'
import { store } from '../store'

export const NotifListerRoute: React.VFC = function () {
  const flagNotifs = store.use(store.flagNotifs)
  return <pre>{JSON.stringify(flagNotifs, null, 4)}</pre>
}
