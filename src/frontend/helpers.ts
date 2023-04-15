import { tapiduck, _ } from 'monoduck'
import { api } from '../shared/endpoints'
import { ZMemberWoHpass } from '../shared/z-models'
import { store } from './store'

export const getIdForRuleEditButton = (id: string): string => `ruleEditButton-${id}`

export const AUTO_LOGIN_STORAGE_KEY = 'flagleap_inapiToken'
export const tryAutoLogin = async function (): Promise<void> {
  _.assert(store.loggedOut.get(), 'assert initMe() called only when logged out')
  const inapiToken = localStorage.getItem(AUTO_LOGIN_STORAGE_KEY)
  if (_.not(inapiToken)) {
    return undefined
  }
  let me: ZMemberWoHpass | null = null
  try {
    me = (await tapiduck.fetch(api.internal.whoami, { inapiToken })).member
  } catch (e) {
    return undefined
  }
  _.assert(me, 'assert `me` as initMe/whoami succeeded')
  store.inapiToken.set(inapiToken)
  store.me.set(me)
  _.assert(store.loggedIn.get(), 'assert logged in as initMe/whoami succeeded')
}
