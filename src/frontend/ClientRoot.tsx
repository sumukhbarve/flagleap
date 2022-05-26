import React from 'react'
import ReactDOM from 'react-dom'
// import { coRouteInfo, Link } from './lookableQs'
import { roqsduck, RouteInfo } from 'monoduck'

const { useRouteInfo, Link: RoqsLink } = roqsduck.injectReact(React)

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
  return <h2>I am route AAA</h2>
}

const RouteBBB: React.VFC = function () {
  return <h2>Ich bin Route BBB</h2>
}

const RouteCCC: React.VFC = function () {
  return <h2>Mein hun route CCC</h2>
}

const routeMap: Record<string, React.ReactElement> = {
  aaa: <RouteAAA />,
  bbb: <RouteBBB />,
  ccc: <RouteCCC />
}

const RouteNotFound: React.VFC = function () {
  return <h2>Asa kuthlach route nahi (404ish)</h2>
}

const ClientRoot: React.VFC = function () {
  const routeInfo = useRouteInfo()
  const routeEl = routeMap[routeInfo.id] ?? <RouteNotFound />
  return (
    <div className='clientRoot'>
      <h1>FlagLeap</h1>
      <p>Mike check. Routing checking:</p>
      <nav>
        <Link to={{ id: 'aaa' }}>aaa</Link> |{' '}
        <Link to={{ id: 'bbb' }}>bbb</Link> |{' '}
        <Link to={{ id: 'ccc' }}>ccc</Link> |{' '}
        <Link to={{ id: 'ddd' }}>ddd</Link>
      </nav>
      <hr />
      {routeEl}
    </div>
  )
}

ReactDOM.render(<ClientRoot />, document.querySelector('#root'))
