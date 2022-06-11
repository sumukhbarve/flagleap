import { _, tapiduck, TapiError } from 'monoduck'
import type { ZFlag } from '../../shared/z-models'
import { zModeEnum, defaultFlagRow } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { auth } from '../auth'
import { getModeRing } from '../../shared/helpers'
import { emitFlagNotif } from './sock-util'

tapiduck.route(app, api.internal.createFlag, async function (reqdata) {
  const me = await auth.getMe(reqdata.inapiToken)
  const flagId = reqdata.flag_id
  const existingFlag = await models.flag.findById(flagId)
  if (_.bool(existingFlag)) {
    throw new TapiError(`Flag with ID '${flagId}' already exists.`)
  }
  const flag: ZFlag = {
    ...defaultFlagRow,
    id: reqdata.flag_id,
    created_at: _.now(),
    creator_id: me.id
  }
  await models.flag.create(flag)
  _.each(zModeEnum.options, function (mode) {
    emitFlagNotif(flag.id, mode)
  })
  return flag
})

tapiduck.route(app, api.internal.getFlags, async function (reqdata) {
  await auth.getMe(reqdata.inapiToken)
  return await models.flag.findAll({})
})

tapiduck.route(app, api.internal.updateFlag, async function (reqdata) {
  const me = await auth.getMe(reqdata.inapiToken)
  const oldFlag = await models.flag.findOne({ where: { id: reqdata.flag.id } })
  if (_.not(oldFlag)) {
    throw new TapiError('No such flag.')
  }
  const updatedFlag: ZFlag = {
    ...oldFlag,
    ...reqdata.flag, // Zod strips extra props, & JSON.parse() is sans-undefined
    updated_at: Date.now(),
    updater_id: me.id
  }
  await models.flag.replace(updatedFlag)
  _.each(zModeEnum.options, function (mode) {
    const modeRing = getModeRing(mode)
    if (oldFlag[modeRing.enabled] !== updatedFlag[modeRing.enabled]) {
      emitFlagNotif(updatedFlag.id, mode)
    }
  })
  return updatedFlag
})

tapiduck.route(app, api.internal.deleteFlag, async function (reqdata) {
  await auth.getMe(reqdata.inapiToken)
  const flag = await models.flag.findOne({ where: { id: reqdata.flag_id } })
  if (_.not(flag)) {
    throw new TapiError('No such flag.')
  }
  // Delete the flag, along with all linked rules (in either mode).
  const rules = await models.rule.findAll({ where: { flag_id: flag.id } })
  // TODO:? _Consider_ deleting multiple flags in a single DB roundtrip.
  await Promise.all(rules.map(async r => await models.rule.deleteById(r.id)))
  await models.flag.deleteById(flag.id)
  _.each(zModeEnum.options, function (mode) {
    const modeRing = getModeRing(mode)
    if (_.bool(flag[modeRing.enabled])) {
      // If was enabled, deleting effectively disables. Else no effective change
      emitFlagNotif(flag.id, mode)
    }
  })
  return { id: flag.id }
})
