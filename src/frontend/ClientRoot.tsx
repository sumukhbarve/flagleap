import React from 'react'
import ReactDOM from 'react-dom'

const ClientRoot: React.VFC = function () {
  return <h2>Hello World!</h2>
}

ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
