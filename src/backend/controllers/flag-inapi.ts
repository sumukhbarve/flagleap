import { _, tapiduck, TapiError } from 'monoduck'
import type { ZFlag } from '../../shared/z-models'
import { defaultFlagRow } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { auth } from '../auth'

tapiduck.route(app, api.internal.createFlag, async function (reqdata) {
  const me = await auth.getMe(reqdata.inapiToken)
  const flagId = reqdata.flag_id
  // TODO: Use .findById?
  const existingFlag = await models.flag.findOne({ where: { id: flagId } })
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
    ...reqdata.flag, // Zod strips excess props, so this should be safe.
    updated_at: Date.now(),
    updater_id: me.id
  }
  await models.flag.replace(updatedFlag)
  return updatedFlag
})

tapiduck.route(app, api.internal.deleteFlag, async function (reqdata) {
  await auth.getMe(reqdata.inapiToken)
  const flag = await models.flag.findOne({ where: { id: reqdata.flag_id } })
  if (_.not(flag)) {
    throw new TapiError('No such flag.')
  }
  await models.flag.deleteById(flag.id)
  // TODO: Delete all rules associated with the flag (in either mode).
  return { id: flag.id }
})
