import React from 'react'
import * as store from '../store'
import { SetupRoute } from './SetupRoute'
import { LoginRoute } from './LoginRoute'
import { FlagListerRoute } from './FlagListerRoute'
import { FlagEditorRoute } from './FlagEditorRoute'

const routeMap: Record<string, React.VFC> = {
  setup: SetupRoute,
  login: LoginRoute,
  flagLister: FlagListerRoute,
  flagEditor: FlagEditorRoute
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
