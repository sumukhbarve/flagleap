import { tapiduck } from 'monoduck'
import type { ZModeEnum, ZRule } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { io } from './api-base'

const emitFlagNotif = function (flagId: string, mode: ZModeEnum): void {
  tapiduck.sockEmit(io, api.external.sock.flagNotifFromServer, {
    flag_id: flagId, mode: mode
  })
}

const getModeFromRule = function (rule: ZRule): ZModeEnum {
  if (rule.live_exists === 1 && rule.test_exists === 0) { return 'live' }
  if (rule.live_exists === 0 && rule.test_exists === 1) { return 'test' }
  // TODO: Improve upfront validation for rule w.r.t. modes
  throw new Error('Unexpected rule encountered')
}

export { emitFlagNotif, getModeFromRule }
