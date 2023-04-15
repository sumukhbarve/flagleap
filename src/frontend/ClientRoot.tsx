// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootswatch/dist/cyborg/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ActiveRoute } from './components/ActiveRoute'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SpinnerIndicator } from './components/SpinnerIndicator'
import { autoLogin } from './autoLogin'

const ClientRoot: React.VFC = function () {
  return (
    <div className='container clientRoot'>
      <SpinnerIndicator />
      <Header />
      <ActiveRoute />
      <Footer />
    </div>
  )
}

// We currently hit whoami _before_ init'ing React. TODO: Reconsider?
autoLogin.autoInitMe().finally(function () {
  ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
})
