import React from 'react'
import ReactDOM from 'react-dom'

const ClientRoot: React.VFC = function () {
  return (
    <div className='clientRoot'>
      <h1>FlagLeap</h1>
      <p>Leap forward with feature flags.</p>
    </div>
  )
}

ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
