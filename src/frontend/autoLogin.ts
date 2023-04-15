import { tapiduck, _ } from 'monoduck'
import { api } from '../shared/endpoints'
import { ZMemberWoHpass } from '../shared/z-models'
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
    let me: ZMemberWoHpass | null = null
    try {
      // Note: Not calling store.spinnerText.set(), as auto-login preceeds React init.
      me = (await tapiduck.fetch(api.internal.whoami, { inapiToken })).member
    } catch (e) {
      me = null
    }
    if (_.bool(me)) {
      store.inapiToken.set(inapiToken)
      store.me.set(me)
      _.assert(store.loggedIn.get(), 'must be logged in on autoLogin success')
    }
  }
}
