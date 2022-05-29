import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { RouteInfo } from 'monoduck'
import * as store from './store'
import { SetupRoute } from './components/SetupRoute'
import { LoginRoute } from './components/LoginRoute'
import { FlagListerRoute } from './components/FlagListerRoute'

const RoqsLink = store.RoqsLink
const Link: React.FC<{to: RouteInfo}> = function ({ to, children }) {
  return (
    <RoqsLink to={to}>
      <span style={{ color: 'navy', borderBottom: '2px solid blue' }}>
        {children}
      </span>
    </RoqsLink>
  )
}

const RouteAAA: React.VFC = function () {
  const [val, setVal] = React.useState('')
  return (
    <form onSubmit={e => { e.preventDefault(); alert(val) }}>
      <h4>Simple Form</h4>
      <input value={val} onChange={e => setVal(e.target.value)} required /> {' '}
      <button>Submit</button>
      <br />
      {val}
    </form>
  )
}

const RouteBBB: React.VFC = function () {
  return <h2>Ich bin Route BBB</h2>
}

const RouteCCC: React.VFC = function () {
  return <h2>Mein hun route CCC</h2>
}

const routeMap: Record<string, React.ReactElement> = {
  setup: <SetupRoute />,
  login: <LoginRoute />,
  flagLister: <FlagListerRoute />,
  aaa: <RouteAAA />,
  bbb: <RouteBBB />,
  ccc: <RouteCCC />
}

const RouteNotFound: React.VFC = function () {
  return <h2>Asa kuthlach route nahi (404ish)</h2>
}

const ClientRoot: React.VFC = function () {
  const routeInfo = store.useRouteInfo()
  const routeEl = routeMap[routeInfo.id] ?? <RouteNotFound />
  return (
    <div className='container'>
      <h1>FlagLeap</h1>
      <nav>
        <Link to={{ id: 'aaa' }}>aaa</Link> |{' '}
        <Link to={{ id: 'bbb' }}>bbb</Link> |{' '}
        <Link to={{ id: 'ccc' }}>ccc</Link> |{' '}
        <Link to={{ id: 'ddd' }}>ddd</Link> |{' '}
        <Link to={{ id: 'setup' }}>setup</Link> |{' '}
        <Link to={{ id: 'login' }}>login</Link> |{' '}
        <Link to={{ id: 'flagLister' }}>flags</Link> |{' '}
      </nav>
      <hr />
      {routeEl}
    </div>
  )
}

ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
