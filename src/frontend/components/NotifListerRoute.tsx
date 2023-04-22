import React from 'react'
import { useStore } from '../store'

export const NotifListerRoute: React.VFC = function () {
  const { flagNotifs } = useStore('flagNotifs')
  return <pre>{JSON.stringify(flagNotifs, null, 4)}</pre>
}
