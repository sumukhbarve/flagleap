import { z } from 'zod'

// Prelims: ////////////////////////////////////////////////////////////////////

const zBoolish = z.number() // Using numbers (not bools) for SQLite compat

const zBase = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  creator_id: z.string(),
  updater_id: z.string()
})
type ZBase = z.infer<typeof zBase>
const defaultBaseRow: ZBase = {
  id: '', created_at: 0, updated_at: 0, creator_id: '', updater_id: ''
}

// DB-bound Models: ////////////////////////////////////////////////////////////

const zMember = zBase.extend({
  fname: z.string(),
  lname: z.string(),
  email: z.string(),
  hpass: z.string()
})
type ZMember = z.infer<typeof zMember>
const defaultMemberRow: ZMember = {
  ...defaultBaseRow, fname: '', lname: '', email: '', hpass: ''
}

const zMemberWoHpass = zMember.omit({
  hpass: true
})
type ZMemberWoHpass = z.infer<typeof zMemberWoHpass>

const zFlag = zBase.extend({
  key: z.string(),
  live_enabled: zBoolish,
  test_enabled: zBoolish,
  description: z.string(),
  archived: zBoolish
})
type ZFlag = z.infer<typeof zFlag>
const defaultFlagRow: ZFlag = {
  ...defaultBaseRow,
  key: '',
  live_enabled: 0,
  test_enabled: 0,
  description: '',
  archived: 0
}

const zOperatorEnum = z.enum([
  '$eq', '$gt', '$gte', '$lte', '$lt', '$in',
  '$startswith', '$endswith', '$contains', '$divisibleby'
])
type ZOperatorEnum = z.infer<typeof zOperatorEnum>

const zRule = zBase.extend({
  flag_id: z.string(),
  live_exists: zBoolish,
  test_exists: zBoolish,
  enabled: zBoolish,
  rank: z.number(),
  lhs_operand_key: z.string(),
  operator: zOperatorEnum,
  rhs_operand_value: z.string(),
  negated: zBoolish,
  result_value: z.string()
})
type ZRule = z.infer<typeof zRule>
const defaultRuleRow: ZRule = {
  ...defaultBaseRow,
  flag_id: '',
  live_exists: 0,
  test_exists: 0,
  enabled: 0,
  rank: 0,
  lhs_operand_key: '',
  operator: '$eq',
  rhs_operand_value: '',
  negated: 0,
  result_value: ''
}

// Other API-specific Models: //////////////////////////////////////////////////

const zFlagReadout = z.object({
  key: z.string(),
  enabled: z.boolean(),
  value: z.string()
})
type ZFlagReadout = z.infer<typeof zFlagReadout>

const zFlagReadoutMap = z.record(zFlagReadout)
type ZFlagReadoutMap = z.infer<typeof zFlagReadoutMap>

const zModeEnum = z.enum(['live', 'test'])
type ZModeEnum = z.infer<typeof zModeEnum>

const zTraits = z.record(z.union([z.string(), z.number(), z.boolean()]))
type ZTraits = z.infer<typeof zTraits>

// Export: /////////////////////////////////////////////////////////////////////

export type {
  ZMember, ZMemberWoHpass, ZFlag, ZOperatorEnum, ZRule,
  ZFlagReadout, ZFlagReadoutMap, ZModeEnum, ZTraits
}
export {
  zMember, defaultMemberRow, zMemberWoHpass, zFlag, defaultFlagRow,
  zOperatorEnum, zRule, defaultRuleRow, zFlagReadout, zFlagReadoutMap,
  zModeEnum, zTraits
}
