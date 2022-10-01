import React from 'react'
import { _, lookduck, roqsduck, tapiduck } from 'monoduck'
import type {
  ZMemberWoHpass, ZFlag, ZRule, ZFlagNotif
} from '../shared/z-models'
import type { ModeRing } from '../shared/helpers'
import { getModeRing } from '../shared/helpers'
import { io } from 'socket.io-client'
import { api } from '../shared/endpoints'

const { useRouteInfo, Link: RoqsLink } = roqsduck.injectReact(React)

const store = {
  //
  // Spinner:
  spinnerText: lookduck.observable(''),
  isSpinning: lookduck.computed((): boolean => store.spinnerText.get() !== ''),
  //
  // Auth/me:
  me: lookduck.observable<ZMemberWoHpass | null>(null),
  inapiToken: lookduck.observable(''),
  loggedIn: lookduck.computed(function (): boolean {
    return _.bool(store.me.get()) && _.bool(store.inapiToken.get())
  }),
  loggedOut: lookduck.computed((): boolean => _.not(store.loggedIn.get())),
  defaultRouteId: lookduck.computed(function (): 'login' | 'flagLister' {
    return store.loggedOut.get() ? 'login' : 'flagLister'
  }),
  //
  // Mode (live/test):
  mode: lookduck.observable<'live' | 'test'>('test'),
  modeRing: lookduck.computed((): ModeRing => getModeRing(store.mode.get())),
  //
  // Flags:
  flagMap: lookduck.observableIdMap<ZFlag>({}),
  flagList: lookduck.computed(function (): ZFlag[] {
    return _.sortBy(Object.values(store.flagMap.get()), flag => flag.id)
  }),
  currentFlagId: lookduck.observable(''),
  currentFlag: lookduck.computed(function (): ZFlag | null {
    const flagId = store.currentFlagId.get()
    const flagMap = store.flagMap.get()
    return flagMap[flagId] ?? null
  }),
  flagSearchText: lookduck.observable(''),
  searchedFlagList: lookduck.computed(function (): ZFlag[] {
    const searchText = store.flagSearchText.get().trim().toLowerCase()
    const flagList = store.flagList.get()
    if (searchText === '') { return flagList }
    return _.filter(flagList, flg => flg.id.toLowerCase().includes(searchText))
  }),
  //
  // Rules:
  ruleMap: lookduck.observableIdMap<ZRule>({}),
  ruleList: lookduck.computed(function (): ZRule[] {
    return _.sortBy(Object.values(store.ruleMap.get()), rule => rule.rank)
  }),
  // NB: ids of rule-less flags aren't included in flagwiseRuleList..
  flagwiseRuleList: lookduck.computed(function (): Record<string, ZRule[]> {
    const ruleList = store.ruleList.get()
    return _.groupBy(ruleList, rule => rule.flag_id)
  }),
  currentRules: lookduck.computed(function (): ZRule[] {
    const flagId = store.currentFlagId.get()
    const modeRing = store.modeRing.get()
    const flagwiseRules = store.flagwiseRuleList.get()
    if (_.not(flagId)) { return [] }
    const rules = flagwiseRules[flagId]
    if (_.not(rules)) { return [] }
    return rules.filter(rule => rule[modeRing.exists])
  }),
  //
  // Flag notifs:
  flagNotifs: lookduck.observable<ZFlagNotif[]>([]),
  //
  // Hooks/components for backward compat:
  use: lookduck.makeUseLookable(React),
  useRouteInfo: useRouteInfo,
  RoqsLink: RoqsLink
}

// Socket Related: /////////////////////////////////////////////////////////////
const socket = io({ transports: ['websocket'] })
tapiduck.sockOn(socket, api.external.sock.flagNotifFromServer, function (data) {
  store.flagNotifs.set([data, ...store.flagNotifs.get()])
})

// Export:
export { store }
