import { Op as SqlOp } from 'sequelize'
import { _, tapiduck } from 'monoduck'
import type { ZFlagReadoutMap, ZRule } from '../../shared/z-models'
import { getModeRing } from '../../shared/helpers'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { ruleMatcher } from '../rule-engine'

tapiduck.route(app, api.external.evalFlag, async function (reqdata) {
  const flagId = reqdata.flag_id
  const modeRing = getModeRing(reqdata.mode)
  const flag = await models.flag.findOne({ where: { id: flagId } })
  if (_.not(flag)) {
    return { flag_id: reqdata.flag_id, enabled: false, value: '' }
  }
  const rules: ZRule[] = await models.rule.findAll({
    where: { flag_id: flag.id, [modeRing.exists]: 1 }
  })
  const mRule = ruleMatcher(rules, reqdata.traits)
  return {
    flag_id: flag.id,
    enabled: flag[modeRing.enabled] === 1,
    value: mRule === null ? '' : mRule.result_value
  }
})

tapiduck.route(app, api.external.evalFlags, async function (reqdata) {
  const iFlagIds = reqdata.flag_ids
  const flagWhere = _.bool(iFlagIds) ? { id: { [SqlOp.in]: iFlagIds } } : {}
  const flags = await models.flag.findAll({ where: flagWhere })
  const enFlags = _.filter(flags, f => f[modeRing.enabled] === 1)
  const enFlagIds = _.map(enFlags, f => f.id)
  const modeRing = getModeRing(reqdata.mode)
  const ruleWhere = { flag_id: { [SqlOp.in]: enFlagIds }, [modeRing.exists]: 1 }
  const rules: ZRule[] = await models.rule.findAll({ where: ruleWhere })
  const flagRulesMap = _.groupBy(rules, r => r.flag_id)
  const output: ZFlagReadoutMap = {}
  _.each(flags, function (flag) {
    const flagRules = flagRulesMap[flag.id] ?? []
    const flagEnabled = flag[modeRing.enabled] === 1
    const mRule = flagEnabled ? ruleMatcher(flagRules, reqdata.traits) : null
    output[flag.id] = {
      flag_id: flag.id,
      enabled: flag[modeRing.enabled] === 1,
      value: mRule === null ? '' : mRule.result_value
    }
  })
  return output
})
