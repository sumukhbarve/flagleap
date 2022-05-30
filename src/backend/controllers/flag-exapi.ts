import { _, tapiduck } from 'monoduck'
import type { ZFlagReadoutMap } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'

tapiduck.route(app, api.external.evalFlag, async function (reqdata) {
  const flagId = reqdata.flag_id
  const enKey: 'live_enabled' | 'test_enabled' =
    `${reqdata.mode}_enabled`
  const flag = await models.flag.findOne({ where: { id: flagId } })
  if (_.not(flag)) {
    return { flag_id: reqdata.flag_id, enabled: false, value: '' }
  }
  // TODO: Use reqdata.traits and rules to determine value.
  return { flag_id: flag.id, enabled: flag[enKey] === 1, value: '' }
})

tapiduck.route(app, api.external.evalFlags, async function (reqdata) {
  const flags = await models.flag.findAll({})
  const enKey: 'live_enabled' | 'test_enabled' =
    `${reqdata.mode}_enabled`
  const output: ZFlagReadoutMap = {}
  _.each(flags, function (flg) {
    // TODO: Use reqdata.traits and rules to determine value.
    output[flg.id] = { flag_id: flg.id, enabled: flg[enKey] === 1, value: '' }
  })
  return output
})
