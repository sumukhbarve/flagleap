import { _, tapiduck } from 'monoduck'
import type { ZFlag } from '../../shared/z-models'
import { zModeEnum, defaultFlagRow } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { auth } from '../auth'
import { getModeRing } from '../../shared/helpers'
import { emitFlagNotif } from './sock-util'

tapiduck.route(app, api.internal.createFlag, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const flagId = reqdata.flag_id
  const existingFlag = await models.flag.findById(flagId)
  if (_.bool(existingFlag)) {
    return jsend.fail(`Flag with ID '${flagId}' already exists.`)
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
  return jsend.success(flag)
})

tapiduck.route(app, api.internal.getFlags, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const flags: ZFlag[] = await models.flag.findAll({})
  return jsend.success(flags)
})

tapiduck.route(app, api.internal.updateFlag, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const oldFlag = await models.flag.findOne({ where: { id: reqdata.flag.id } })
  if (_.not(oldFlag)) {
    return jsend.fail('No such flag.')
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
  return jsend.success(updatedFlag)
})

tapiduck.route(app, api.internal.deleteFlag, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const flag = await models.flag.findOne({ where: { id: reqdata.flag_id } })
  if (_.not(flag)) {
    return jsend.fail('No such flag.')
  }
  // Delete the flag, along with all linked rules (in either mode).
  const rules = await models.rule.findAll({ where: { flag_id: flag.id } })
  // TODO:? _Consider_ deleting multiple rules in a single DB roundtrip.
  await Promise.all(rules.map(async r => await models.rule.deleteById(r.id)))
  await models.flag.deleteById(flag.id)
  _.each(zModeEnum.options, function (mode) {
    const modeRing = getModeRing(mode)
    if (_.bool(flag[modeRing.enabled])) {
      // If was enabled, deleting effectively disables. Else no effective change
      emitFlagNotif(flag.id, mode)
    }
  })
  return jsend.success({ id: flag.id })
})
