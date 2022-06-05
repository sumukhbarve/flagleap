import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ActiveRoute } from './components/ActiveRoute'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LoadingIndicator } from './components/LoadingIndicator'

const ClientRoot: React.VFC = function () {
  return (
    <div className='container clientRoot'>
      <LoadingIndicator />
      <Header />
      <ActiveRoute />
      <Footer />
    </div>
  )
}

ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
