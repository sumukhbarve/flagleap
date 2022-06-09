import React from 'react'
import * as store from '../store'
import { SetupRoute } from './SetupRoute'
import { LoginRoute } from './LoginRoute'
import { FlagListerRoute } from './FlagListerRoute'
import { FlagEditorRoute } from './FlagEditorRoute'
import { Link } from './Link'
import { roqsduck } from 'monoduck'

const DefaultBlankIdRoute: React.VFC = function () {
  const defaultRouteId = store.use(store.defaultRouteId)
  React.useEffect(function () {
    // Timeout ensures update occurs _after_ parent(s)' subscription(s)
    setTimeout(() => roqsduck.setRouteInfo({ id: defaultRouteId }), 0)
  }, [])
  return (
    <div>
      <h2>Redirecting ...</h2>
      <p>
        <Link to={{ id: defaultRouteId }}>
          If you aren't redirected, please click <u>here</u>.
        </Link>
      </p>
    </div>
  )
}

const routeMap: Record<string, React.VFC> = {
  setup: SetupRoute,
  login: LoginRoute,
  flagLister: FlagListerRoute,
  flagEditor: FlagEditorRoute,
  '': DefaultBlankIdRoute
}
const NoSuchRoute: React.VFC = function () {
  return (
    <div style={{ paddingBlock: 100 }}>
      <h3>404: Page Not Found</h3>
      <p>The page you were looking for could not be found.</p>
    </div>
  )
}
export const ActiveRoute: React.VFC = function () {
  const routeInfo = store.useRouteInfo()
  const RouteComponent = routeMap[routeInfo.id] ?? NoSuchRoute
  console.log(routeInfo, RouteComponent)
  return <RouteComponent />
}
