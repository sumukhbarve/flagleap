import React from 'react'
import { store, useStore } from '../store'
import { Form } from 'react-bootstrap'

export const FlagSearchbox: React.VFC = function () {
  const { flagSearchText } = useStore('flagSearchText')
  const style = {
    fontFamily: 'monospace'
  } as const
  return (
    <Form.Control
      type='search' placeholder='Filter flags by ID ...'
      value={flagSearchText} style={style}
      onChange={evt => store.flagSearchText.set(evt.target.value)}
    />
  )
}
