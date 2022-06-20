import React from 'react'
import { store } from '../store'
import { SetupRoute } from './SetupRoute'
import { LoginRoute } from './LoginRoute'
import { FlagListerRoute } from './FlagListerRoute'
import { FlagEditorRoute } from './FlagEditorRoute'
import { Link } from './Link'
import { roqsduck } from 'monoduck'
import { NotifListerRoute } from './NotifListerRoute'

const DefaultBlankIdRoute: React.VFC = function () {
  const defaultRouteId = store.use(store.defaultRouteId)
  React.useEffect(() => roqsduck.setRouteInfo({ id: defaultRouteId }), [])
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
  notifLister: NotifListerRoute,
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
  return <RouteComponent />
}
