import React from 'react'
import { _, lookduck, roqsduck, tapiduck } from 'monoduck'
import type {
  ZMemberWoHpass, ZFlag, ZRule, ZFlagNotif
} from '../shared/z-models'
import { getModeRing } from '../shared/helpers'
import { io } from 'socket.io-client'
import { api } from '../shared/endpoints'

export const loadingMsg = lookduck.observable('')

export const me = lookduck.observable<ZMemberWoHpass | null>(null)
export const inapiToken = lookduck.observable('')
export const loggedIn = lookduck.computed(function () {
  return _.bool(me.get()) && _.bool(inapiToken.get())
})
export const loggedOut = lookduck.computed(() => _.not(loggedIn.get()))
export const defaultRouteId = lookduck.computed(function () {
  return loggedOut.get() ? 'login' : 'flagLister'
})

export const mode = lookduck.observable<'live' | 'test'>('test')
export const modeRing = lookduck.computed(() => getModeRing(mode.get()))

export const flagMap = lookduck.observableIdMap<ZFlag>({})
export const flagList = lookduck.computed(function (): ZFlag[] {
  return _.sortBy(Object.values(flagMap.get()), flag => flag.id)
})
export const currentFlagId = lookduck.observable('')
export const currentFlag = lookduck.computed(function (): ZFlag | null {
  const _flagId = currentFlagId.get()
  const _flagMap = flagMap.get()
  return _flagMap[_flagId] ?? null
})
export const flagSearchText = lookduck.observable('')
export const searchedFlagList = lookduck.computed(function () {
  const _searchText = flagSearchText.get().trim().toLowerCase()
  const _flagList = flagList.get()
  if (_searchText === '') { return _flagList }
  return _.filter(_flagList, flg => flg.id.toLowerCase().includes(_searchText))
})

export const ruleMap = lookduck.observableIdMap<ZRule>({})
export const ruleList = lookduck.computed(function () {
  return _.sortBy(Object.values(ruleMap.get()), rule => rule.rank)
})

// NB: ids of rulesless flags aren't included in flagwiseRuleList..
export const flagwiseRuleList = lookduck.computed(function () {
  const _ruleList = ruleList.get()
  return _.groupBy(_ruleList, rule => rule.flag_id)
})
export const currentRules = lookduck.computed(function (): ZRule[] {
  const _flagId = currentFlagId.get()
  const _modeRing = modeRing.get()
  const _flagwiseRules = flagwiseRuleList.get()
  if (_.not(_flagId)) { return [] }
  const _rules = _flagwiseRules[_flagId]
  if (_.not(_rules)) { return [] }
  return _rules.filter(r => r[_modeRing.exists])
})

// Hooks/Components: ///////////////////////////////////////////////////////////
export const use = lookduck.makeUseLookable(React)
export const { useRouteInfo, Link: RoqsLink } = roqsduck.injectReact(React)

// Socket Related: /////////////////////////////////////////////////////////////
const socket = io()
export const flagNotifs = lookduck.observable<ZFlagNotif[]>([])
tapiduck.sockOn(socket, api.external.sock.flagNotifFromServer, function (data) {
  flagNotifs.set([data, ...flagNotifs.get()])
})
