import { Op as SqlOp } from 'sequelize'
import { _, tapiduck } from 'monoduck'
import type { ZFlagReadoutMap, ZRule } from '../../shared/z-models'
import { getModeRing } from '../../shared/helpers'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'

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
  // TODO: Use reqdata.traits and rules to determine value.
  _.noop(rules)
  return { flag_id: flag.id, enabled: flag[modeRing.enabled] === 1, value: '' }
})

tapiduck.route(app, api.external.evalFlags, async function (reqdata) {
  const iFlagIds = reqdata.flag_ids
  const flagWhere = _.bool(iFlagIds) ? { id: { [SqlOp.in]: iFlagIds } } : {}
  const flags = await models.flag.findAll({ where: flagWhere })
  const modeRing = getModeRing(reqdata.mode)
  const ruleWhere = _.bool(iFlagIds)
    ? { flag_id: { [SqlOp.in]: iFlagIds }, [modeRing.exists]: 1 }
    : { [modeRing.exists]: 1 }
  const rules: ZRule[] = await models.rule.findAll({ where: ruleWhere })
  const flagRulesMap = _.groupBy(rules, r => r.flag_id)
  const output: ZFlagReadoutMap = {}
  _.each(flags, function (flag) {
    const flagRules = flagRulesMap[flag.id]
    // TODO: Use flag..enabled, reqdata.traits and flagRules to update output.
    _.noop(flagRules)
    output[flag.id] = {
      flag_id: flag.id,
      enabled: flag[modeRing.enabled] === 1,
      value: ''
    }
  })
  return output
})
