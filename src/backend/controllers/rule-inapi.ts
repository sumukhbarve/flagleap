import { v4 as uuidv4 } from 'uuid'
import { _, tapiduck } from 'monoduck'
import type { ZRule } from '../../shared/z-models'
import { defaultRuleRow } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { auth } from '../auth'
import { emitFlagNotif, getModeFromRule } from './sock-util'

tapiduck.route(app, api.internal.createRule, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const flag = await models.flag.findOne({ where: { id: reqdata.flag_id } })
  if (_.not(flag)) {
    return jsend.fail('No such flag.') // Can't create rule for missing flag
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
  emitFlagNotif(rule.flag_id, reqdata.mode)
  return jsend.success(rule)
})

tapiduck.route(app, api.internal.getFlagRules, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const rules: ZRule[] = await models.rule.findAll(
    { where: { flag_id: reqdata.flag_id } }
  )
  return jsend.success(rules)
})

tapiduck.route(app, api.internal.updateRule, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const oldRule = await models.rule.findOne({ where: { id: reqdata.rule.id } })
  if (_.not(oldRule)) {
    return jsend.fail('No such rule.')
  }
  const updatedRule: ZRule = {
    ...oldRule,
    ...reqdata.rule, // Zod strips excess props, so this should be safe.
    updated_at: Date.now(),
    updater_id: me.id
  }
  await models.rule.replace(updatedRule)
  emitFlagNotif(updatedRule.flag_id, getModeFromRule(updatedRule))
  return jsend.success(updatedRule)
})

tapiduck.route(app, api.internal.deleteRule, async function (reqdata, jsend) {
  const me = await auth.getMe(reqdata.inapiToken)
  if (_.not(me)) {
    return jsend.fail(auth.generalFailText)
  }
  const rule = await models.rule.findOne({ where: { id: reqdata.rule_id } })
  if (_.not(rule)) {
    return jsend.fail('No such rule.')
  }
  await models.rule.deleteById(rule.id)
  emitFlagNotif(rule.flag_id, getModeFromRule(rule))
  return jsend.success({ id: rule.id })
})
