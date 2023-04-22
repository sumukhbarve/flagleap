import React from 'react'
import { useStore } from '../store'
import { Spinner } from 'react-bootstrap'
import { _ } from 'monoduck'

export const SpinnerIndicator: React.VFC = function () {
  const { spinnerText } = useStore('spinnerText')
  const divStyle = {
    position: 'fixed', top: 70, left: 0, width: '100%', textAlign: 'center', zIndex: 1100
  } as const
  const spanStyle = {
    border: '1px solid black',
    borderRadius: 10,
    backgroundColor: 'lightyellow',
    color: 'black',
    padding: 15,
    fontSize: 'large'
  } as const
  if (_.not(spinnerText)) {
    return null
  }
  return (
    <div style={divStyle}>
      <span style={spanStyle}>
        <Spinner animation='border' role='status' size='sm' />{' '}&nbsp;
        {spinnerText}
      </span>
    </div>
  )
}
