import { tapiduck, _ } from 'monoduck'
import { api } from '../shared/endpoints'
import { store } from './store'

const AUTOLOGIN_STORAGE_KEY = 'flagleap_autoLogin_inapiToken'
const AUTOLOGIN_IS_AVAILABLE = _.bool(window.location.hostname === 'localhost')

export const autoLogin = {
  availableIs: () => AUTOLOGIN_IS_AVAILABLE,

  rememberMe: function (inapiToken: string): void {
    _.assert(AUTOLOGIN_IS_AVAILABLE)
    localStorage.setItem(AUTOLOGIN_STORAGE_KEY, inapiToken)
  },

  forgetMe: function (): void {
    localStorage.removeItem(AUTOLOGIN_STORAGE_KEY)
  },

  autoInitMe: async function (): Promise<void> {
    _.assert(store.loggedOut.get(), 'can autoLogin() only when logged out')
    if (!AUTOLOGIN_IS_AVAILABLE) {
      return undefined
    }
    const inapiToken = localStorage.getItem(AUTOLOGIN_STORAGE_KEY)
    if (_.not(inapiToken)) {
      return undefined
    }
    const resp = await tapiduck.fetch(api.internal.whoami, { inapiToken })
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    await tapiduck.fetch(api.internal.whoami, { inapiToken })
    const { member } = resp.data
    store.inapiToken.set(inapiToken)
    store.me.set(member)
    _.assert(store.loggedIn.get(), 'must be logged in on autoLogin success')
  }
}
