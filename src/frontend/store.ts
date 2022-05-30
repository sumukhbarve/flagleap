import React from 'react'
import type { Lookable, AcceptorFn } from 'monoduck'
import { _, lookduck, roqsduck } from 'monoduck'
import type { ZMemberWoHpass, ZFlag, ZRule } from '../shared/z-models'

export const loadingMsg = lookduck.observable('')

export const me = lookduck.observable<ZMemberWoHpass | null>(null)
export const inapiToken = lookduck.observable('')
export const loggedIn = lookduck.computed(function () {
  return _.bool(me.get()) && _.bool(inapiToken.get())
})
export const loggedOut = lookduck.computed(() => _.not(loggedIn.get()))

export const mode = lookduck.observable<'live' | 'test'>('test')
// export const inLiveMode = lookduck.computed(() => mode.get() === 'live')
// export const inTestMode = lookduck.computed(() => mode.get() === 'test')
export const modeEnabledKey = lookduck.computed(
  function (): 'live_enabled' | 'test_enabled' {
    return `${mode.get()}_enabled`
  }
)
export const modeExistsKey = lookduck.computed(
  function (): 'live_exists' | 'test_exists' {
    return `${mode.get()}_exists`
  }
)

// TODO: Import type Observable from monoduck (lookduck)
type Observable<T> = Lookable<T> & { set: AcceptorFn<T> }
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

export const flagMap = lookduck.observable<Record<string, ZFlag>>({})
export const setFlags = makeSetObjs(flagMap)
export const flagList = lookduck.computed(function (): ZFlag[] {
  // TODO: sort better?
  return Object.values(flagMap.get()).sort((a, b) => a.id <= b.id ? -1 : +1)
})
export const currentFlagId = lookduck.observable('')
export const currentFlag = lookduck.computed(function (): ZFlag | null {
  const _flagId = currentFlagId.get()
  const _flagMap = flagMap.get()
  return _flagMap[_flagId] ?? null
})

export const ruleMap = lookduck.observable<Record<string, ZRule>>({})
export const setRules = makeSetObjs(ruleMap)
export const ruleList = lookduck.computed(function () {
  // TODO: sort better?
  return Object.values(ruleMap.get()).sort((a, b) => a.rank <= b.rank ? -1 : +1)
})

// NB: ids of rulesless flags aren't included in flagwiseRuleList..
export const flagwiseRuleList = lookduck.computed(function () {
  const _ruleList = ruleList.get()
  const flagwiseRules: Record<string, ZRule[]> = {}
  _.each(_ruleList, function (_rule) {
    const _flagId = _rule.flag_id
    if (!_.keyHas(flagwiseRules, _flagId)) {
      flagwiseRules[_flagId] = []
    }
    flagwiseRules[_flagId].push(_rule)
  })
  return flagwiseRules
})
export const currentRules = lookduck.computed(function (): ZRule[] {
  const _flagId = currentFlagId.get()
  const _modeExistsKey = modeExistsKey.get()
  const _flagwiseRules = flagwiseRuleList.get()
  if (_.not(_flagId)) { return [] }
  const _rules = _flagwiseRules[_flagId]
  if (_.not(_rules)) { return [] }
  return _rules.filter(r => r[_modeExistsKey])
})

export const use = lookduck.makeUseLookable(React)
export const { useRouteInfo, Link: RoqsLink } = roqsduck.injectReact(React)
