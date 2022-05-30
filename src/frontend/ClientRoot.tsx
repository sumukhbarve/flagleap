import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { _ } from 'monoduck'
import * as store from './store'
import { Link } from './components/Link'
import { SetupRoute } from './components/SetupRoute'
import { LoginRoute } from './components/LoginRoute'
import { FlagListerRoute } from './components/FlagListerRoute'
import { FlagEditorRoute } from './components/FlagEditorRoute'

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

const routeMap: Record<string, React.VFC> = {
  setup: SetupRoute,
  login: LoginRoute,
  flagLister: FlagListerRoute,
  flagEditor: FlagEditorRoute,
  aaa: RouteAAA,
  bbb: RouteBBB,
  ccc: RouteCCC
}
const RouteNotFound: React.VFC = function () {
  return <h2>Asa kuthlach route nahi (404ish)</h2>
}
const ActiveRoute: React.VFC = function () {
  const routeInfo = store.useRouteInfo()
  const RouteComponent = routeMap[routeInfo.id] ?? RouteNotFound
  console.log(routeInfo, RouteComponent)
  return <RouteComponent />
}

const LoadingIndicator: React.VFC = function () {
  const loadingMsg = store.use(store.loadingMsg)
  return _.bool(loadingMsg) ? <h3>{loadingMsg}</h3> : null
}

const ClientRoot: React.VFC = function () {
  const routeInfo = store.useRouteInfo()
  return (
    <div className='container'>
      <LoadingIndicator />
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
      <pre>nav routeInfo: {JSON.stringify(routeInfo)}</pre>
      <hr />
      <ActiveRoute />
    </div>
  )
}

ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
