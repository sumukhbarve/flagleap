import React from 'react'
import * as store from '../store'

export const FlagListerRoute: React.VFC = function () {
  // TODO: Redirect to login if not already logged in.
  const value = JSON.stringify({
    inapiToken: store.use(store.inapiToken),
    me: store.use(store.me),
    loggedIn: store.use(store.loggedIn)
  }, null, 4)
  return <pre>{value}</pre>
}
