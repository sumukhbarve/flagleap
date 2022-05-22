import React from 'react'
import { _, lookduck } from 'monoduck'

// How it works:
//  - When the page initially loads, data flows from URL --> App
//  - As the user interacts with the app, data flows from App --> URL
//  - As the user clicks back/forward, data flows from URL --> App
//  - By `App`, we mean the observable `obQs` (and the linked `coRouteInfo`.)

type RouteInfoType = {id: string} & Record<string, string>

const windowLocation = globalThis.location
const windowHistory = globalThis.history
const windowAddEventListener = globalThis.addEventListener

const prefixQmark = function (s: string): string {
  if (s.startsWith('?')) { return s }
  return '?' + s
}
const unprefixQmark = function (s: string): string {
  if (s.startsWith('?')) { return s.slice(1) }
  return s
}

const parseQs = function (qs: string): RouteInfoType {
  const qsWoQmark = unprefixQmark(qs)
  const parts = qsWoQmark.split('&')
  const pairs = parts.map(s => s.split('=') as [string, string])
  const routeInfo = _.fromPairs(pairs)
  return { id: '', ...routeInfo }
}
const stringifyQs = function (routeInfo: RouteInfoType): string {
  return _.toPairs(routeInfo).map(pair => `${pair[0]}=${pair[1]}`).join('&')
}

// Handle initial data flow from URL --> App with proper initialization:
const obQs = lookduck.observable(unprefixQmark(windowLocation.search))
let qsPopInProgress: boolean = false
// Handle data flow from App --> URL as user interacts with the App:
obQs.subscribe(function () {
  // console.log(`setting ${obQs.get()} @ ${Date.now()}`)
  if (!qsPopInProgress) {
    // console.log(`pushing ${obQs.get()} @ ${Date.now()}`)
    windowHistory.pushState(null, '', prefixQmark(obQs.get()))
  } else {
    // console.log(`skip-pushing ${obQs.get()} @ ${Date.now()}`)
  }
})
// Handle data flow from URL --> App as the users navigates back/forward:
windowAddEventListener('popstate', function () {
  // console.log(`popping ${windowLocation.search} @ ${Date.now()}`)
  qsPopInProgress = true
  obQs.set(unprefixQmark(windowLocation.search))
  qsPopInProgress = false
})

const coRouteInfo = lookduck.computed(function (): RouteInfoType {
  const qs = obQs.get()
  return parseQs(unprefixQmark(qs))
})
const setRouteInfo = function (routeInfo: RouteInfoType): void {
  obQs.set(unprefixQmark(stringifyQs(routeInfo)))
}
const useLookable = lookduck.makeUseLookable(React.useState, React.useEffect)
const useRouteInfo = (): RouteInfoType => useLookable(coRouteInfo)

const Link: React.FC<{to: RouteInfoType}> = function ({ to, children }) {
  const href = prefixQmark(stringifyQs(to))
  const onClick = function (event: React.MouseEvent): void {
    event.preventDefault()
    setRouteInfo(to)
  }
  return <a href={href} onClick={onClick}>{children}</a>
}

// Note: `obQs` is _not_ exported, while `coRouteInfo` is.
export { coRouteInfo, useRouteInfo, setRouteInfo, Link }
