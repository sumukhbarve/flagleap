import { z } from 'zod'

// Prelims: ////////////////////////////////////////////////////////////////////

const zBoolish = z.number() // Using numbers (not bools) for SQLite compat

const zBase = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number()
})

// DB-bound Models: ////////////////////////////////////////////////////////////

const zDevUser = zBase.extend({
  email: z.string(),
  hpass: z.string(),
  name: z.string()
})
type ZDevUser = z.infer<typeof zDevUser>

const zDevUserWoHpass = zDevUser.omit({
  hpass: true
})
type ZDevUserWoHpass = z.infer<typeof zDevUserWoHpass>

const zFlag = zBase.extend({
  key: z.string(),
  live_enabled: zBoolish,
  test_enabled: zBoolish,
  description: z.string(),
  archived: zBoolish
})
type ZFlag = z.infer<typeof zFlag>

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
  ZDevUser, ZDevUserWoHpass, ZFlag, ZOperatorEnum, ZRule,
  ZFlagReadout, ZFlagReadoutMap, ZModeEnum, ZTraits
}
export {
  zDevUser, zDevUserWoHpass, zFlag, zOperatorEnum, zRule,
  zFlagReadout, zFlagReadoutMap, zModeEnum, zTraits
}
