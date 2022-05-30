import { v4 as uuidv4 } from 'uuid'
import { _, tapiduck, TapiError } from 'monoduck'
import type { ZRule } from '../../shared/z-models'
import { defaultRuleRow } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { auth } from '../auth'

tapiduck.route(app, api.internal.createRule, async function (reqdata) {
  const me = await auth.getMe(reqdata.inapiToken)
  const flag = await models.flag.findOne({ where: { id: reqdata.flag_id } })
  if (_.not(flag)) {
    throw new TapiError('No such flag.') // Can't create rule for missing flag
  }
  const rule: ZRule = {
    ...defaultRuleRow,
    id: uuidv4(),
    flag_id: reqdata.flag_id,
    rank: reqdata.rank,
    live_exists: Number(reqdata.mode === 'live'),
    test_exists: Number(reqdata.mode === 'test'),
    created_at: Date.now(),
    creator_id: me.id
  }
  await models.rule.create(rule)
  return rule
})

tapiduck.route(app, api.internal.getFlagRules, async function (reqdata) {
  await auth.getMe(reqdata.inapiToken)
  return await models.rule.findAll({ where: { flag_id: reqdata.flag_id } })
})

tapiduck.route(app, api.internal.updateRule, async function (reqdata) {
  const me = await auth.getMe(reqdata.inapiToken)
  const oldRule = await models.rule.findOne({ where: { id: reqdata.rule.id } })
  if (_.not(oldRule)) {
    throw new TapiError('No such rule.')
  }
  const updatedRule: ZRule = {
    ...oldRule,
    ...reqdata.rule, // Zod strips excess props, so this should be safe.
    updated_at: Date.now(),
    updater_id: me.id
  }
  await models.rule.replace(updatedRule)
  return updatedRule
})

tapiduck.route(app, api.internal.deleteRule, async function (reqdata) {
  await auth.getMe(reqdata.inapiToken)
  const rule = await models.rule.findOne({ where: { id: reqdata.rule_id } })
  if (_.not(rule)) {
    throw new TapiError('No such rule.')
  }
  await models.rule.deleteById(rule.id)
  return { id: rule.id }
})
