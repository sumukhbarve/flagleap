import React from 'react'
import { store } from '../store'
import { Form } from 'react-bootstrap'

export const FlagSearchbox: React.VFC = function () {
  const searchText = store.use(store.flagSearchText)
  const style = {
    fontFamily: 'monospace'
  } as const
  return (
    <Form.Control
      type='search' placeholder='Filter flags by ID ...'
      value={searchText} style={style}
      onChange={evt => store.flagSearchText.set(evt.target.value)}
    />
  )
}
