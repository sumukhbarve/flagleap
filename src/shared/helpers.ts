import type { ZModeEnum } from './z-models'

interface ModeRing {
  enabled: 'live_enabled' | 'test_enabled'
  exists: 'live_exists' | 'test_exists'
}
const getModeRing = function (mode: ZModeEnum): ModeRing {
  return { enabled: `${mode}_enabled`, exists: `${mode}_exists` }
}

export type { ModeRing }
export { getModeRing }
