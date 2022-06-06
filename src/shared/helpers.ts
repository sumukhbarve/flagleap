import type { ZModeEnum, ZFlag } from './z-models'
import { _ } from 'monoduck'

interface ModeRing {
  enabled: 'live_enabled' | 'test_enabled'
  exists: 'live_exists' | 'test_exists'
}
const getModeRing = function (mode: ZModeEnum): ModeRing {
  return { enabled: `${mode}_enabled`, exists: `${mode}_exists` }
}

const flagEnabledIs = function (
  flag: ZFlag,
  moder: ZModeEnum | ModeRing
): boolean {
  const modeRing = typeof moder === 'string' ? getModeRing(moder) : moder
  return _.bool(flag[modeRing.enabled])
}

export type { ModeRing }
export { getModeRing, flagEnabledIs }
