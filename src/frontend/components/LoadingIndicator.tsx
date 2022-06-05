import React from 'react'
import * as store from '../store'
import { Spinner } from 'react-bootstrap'
import { _ } from 'monoduck'

export const LoadingIndicator: React.VFC = function () {
  const loadingMsg = store.use(store.loadingMsg)
  const divStyle = {
    position: 'fixed', top: 70, left: 0, width: '100%', textAlign: 'center'
  } as const
  const spanStyle = {
    border: '1px solid black',
    borderRadius: 10,
    backgroundColor: 'lightyellow',
    padding: 15,
    fontSize: 'large'
  } as const
  if (_.not(loadingMsg)) {
    return null
  }
  return (
    <div style={divStyle}>
      <span style={spanStyle}>
        <Spinner animation='border' role='status' size='sm' />{' '}&nbsp;
        {loadingMsg}
      </span>
    </div>
  )
}
