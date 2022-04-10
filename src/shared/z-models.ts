import { z } from 'zod'

const zBoolish = z.number() // Using numbers (not bools) for SQLite compat

const zBase = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number()
})

const zSettings = zBase.extend({
  admin_username: z.string(),
  admin_pw_hash: z.string(),
  mode_lines: z.string(),
  api_key_hash: z.string()
})
type ZSettings = z.infer<typeof zSettings>

const zEndUserExtras = z.object({
  group_key: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string()
})
const zEndUser = zBase.extend({
  user_key: z.string()
}).merge(zEndUserExtras)
type ZEndUser = z.infer<typeof zEndUser>

const zFlag = zBase.extend({
  flag_key: z.string(),
  default_value: z.string(),
  enabled: zBoolish,
  description: z.string(),
  archived: zBoolish
})
type ZFlag = z.infer<typeof zFlag>

const zNotlessMatcherEnum = z.enum([
  '$none', '$eq', '$gt', '$gte', '$lte', '$lt',
  '$in', '$startswith', '$endswith', '$contains'
])
type ZNotlessMatcherEnum = z.infer<typeof zNotlessMatcherEnum>

const zRule = zBase.extend({
  flag_id: z.string(),
  enabled: zBoolish,
  rank: z.number(),
  value: z.string(),
  // mode rule:
  mode: z.string(),
  // user_key related:
  user_key_matcher: zNotlessMatcherEnum,
  user_key_negate: zBoolish,
  user_key_rhs: z.string(),
  // group_key related:
  group_key_matcher: zNotlessMatcherEnum,
  group_key_negate: zBoolish,
  group_key_rhs: z.string()
})
type ZRule = z.infer<typeof zRule>

export type { ZSettings, ZEndUser, ZFlag, ZNotlessMatcherEnum, ZRule }
export {
  zSettings, zEndUserExtras, zEndUser, zFlag, zNotlessMatcherEnum, zRule
}
