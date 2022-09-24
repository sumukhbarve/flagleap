import React from 'react'
import { _, lookduck, roqsduck, tapiduck } from 'monoduck'
import type {
  ZMemberWoHpass, ZFlag, ZRule, ZFlagNotif
} from '../shared/z-models'
import { getModeRing } from '../shared/helpers'
import { io } from 'socket.io-client'
import { api } from '../shared/endpoints'

// Using a function-based namespace to pacify @typescript-eslint/no-namespace
const store = (_: never): never => { throw new Error('never') }

store.spinnerText = lookduck.observable('')
store.isSpinning = lookduck.computed(() => store.spinnerText.get() !== '')

store.me = lookduck.observable<ZMemberWoHpass | null>(null)
store.inapiToken = lookduck.observable('')
store.loggedIn = lookduck.computed(function () {
  return _.bool(store.me.get()) && _.bool(store.inapiToken.get())
})
store.loggedOut = lookduck.computed(() => _.not(store.loggedIn.get()))
store.defaultRouteId = lookduck.computed(function () {
  return store.loggedOut.get() ? 'login' : 'flagLister'
})

store.mode = lookduck.observable<'live' | 'test'>('test')
store.modeRing = lookduck.computed(() => getModeRing(store.mode.get()))

store.flagMap = lookduck.observableIdMap<ZFlag>({})
store.flagList = lookduck.computed(function (): ZFlag[] {
  return _.sortBy(Object.values(store.flagMap.get()), flag => flag.id)
})
store.currentFlagId = lookduck.observable('')
store.currentFlag = lookduck.computed(function (): ZFlag | null {
  const flagId = store.currentFlagId.get()
  const flagMap = store.flagMap.get()
  return flagMap[flagId] ?? null
})
store.flagSearchText = lookduck.observable('')
store.searchedFlagList = lookduck.computed(function () {
  const searchText = store.flagSearchText.get().trim().toLowerCase()
  const flagList = store.flagList.get()
  if (searchText === '') { return flagList }
  return _.filter(flagList, flag => flag.id.toLowerCase().includes(searchText))
})

store.ruleMap = lookduck.observableIdMap<ZRule>({})
store.ruleList = lookduck.computed(function () {
  return _.sortBy(Object.values(store.ruleMap.get()), rule => rule.rank)
})

// NB: ids of rulesless flags aren't included in flagwiseRuleList..
store.flagwiseRuleList = lookduck.computed(function () {
  const ruleList = store.ruleList.get()
  return _.groupBy(ruleList, rule => rule.flag_id)
})
store.currentRules = lookduck.computed(function (): ZRule[] {
  const flagId = store.currentFlagId.get()
  const modeRing = store.modeRing.get()
  const flagwiseRules = store.flagwiseRuleList.get()
  if (_.not(flagId)) { return [] }
  const rules = flagwiseRules[flagId]
  if (_.not(rules)) { return [] }
  return rules.filter(rule => rule[modeRing.exists])
})

// Flag notifs:
store.flagNotifs = lookduck.observable<ZFlagNotif[]>([])

// Hooks/Components: ///////////////////////////////////////////////////////////
store.use = lookduck.makeUseLookable(React)
const { useRouteInfo, Link: RoqsLink } = roqsduck.injectReact(React)
store.useRouteInfo = useRouteInfo
store.RoqsLink = RoqsLink

// Socket Related: /////////////////////////////////////////////////////////////
const socket = io({ transports: ['websocket'] })
tapiduck.sockOn(socket, api.external.sock.flagNotifFromServer, function (data) {
  store.flagNotifs.set([data, ...store.flagNotifs.get()])
})

// Export:
const nonCallableStore = { ...store }
export { nonCallableStore as store }
