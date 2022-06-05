import React from 'react'
import type { Observable } from 'monoduck'
import { _, lookduck, roqsduck } from 'monoduck'
import type { ZMemberWoHpass, ZFlag, ZRule } from '../shared/z-models'
import { getModeRing } from '../shared/helpers'

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

const makeSetObjs = function <T extends {id: string}>(
  objMap: Observable<Record<string, T>>
): (_newObjs: T[]) => void {
  const setObjs = function (_newObjs: T[]): void {
    const _oldObjMap = objMap.get()
    let _changeDetected = false
    const _objChangeMap: Record<string, T> = {}
    _.each(_newObjs, function (_newObj) {
      const _oldObj = _oldObjMap[_newObj.id]
      if (!_.deepEquals(_oldObj, _newObj)) {
        _changeDetected = true
        _objChangeMap[_newObj.id] = _newObj
      }
    })
    if (_changeDetected) {
      objMap.set({ ..._oldObjMap, ..._objChangeMap })
    }
  }

  return setObjs
}
const makeDeleteObjsById = function <T extends {id: string}>(
  objMap: Observable<Record<string, T>>
): (_idsToDel: string[]) => void {
  const deleteObjsById = function (_idsToDel: string[]): void {
    const _idsToDelSet = new Set(_idsToDel)
    const _oldObjMap = objMap.get()
    const _newObjMap: (typeof _oldObjMap) = {}
    let _deleteDetected = false
    _.each(Object.entries(_oldObjMap), function ([id, obj]) {
      if (_idsToDelSet.has(id)) {
        _deleteDetected = true
      } else {
        _newObjMap[id] = obj
      }
    })
    if (_deleteDetected) {
      objMap.set(_newObjMap)
    }
  }
  return deleteObjsById
}

export const flagMap = lookduck.observable<Record<string, ZFlag>>({})
export const setFlags = makeSetObjs(flagMap)
export const deleteFlagsById = makeDeleteObjsById(flagMap)
export const flagList = lookduck.computed(function (): ZFlag[] {
  return _.sortBy(Object.values(flagMap.get()), flag => flag.id)
})
export const currentFlagId = lookduck.observable('')
export const currentFlag = lookduck.computed(function (): ZFlag | null {
  const _flagId = currentFlagId.get()
  const _flagMap = flagMap.get()
  return _flagMap[_flagId] ?? null
})

export const ruleMap = lookduck.observable<Record<string, ZRule>>({})
export const setRules = makeSetObjs(ruleMap)
export const deleteRulesById = makeDeleteObjsById(ruleMap)
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

export const use = lookduck.makeUseLookable(React)
export const { useRouteInfo, Link: RoqsLink } = roqsduck.injectReact(React)
