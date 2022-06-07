import { z } from 'zod'
import { tapiduck } from 'monoduck'
import {
  zMemberWoHpass, zFlag, zRule, zFlagReadout,
  zFlagReadoutMap, zModeEnum, zTraits // zMember, zMemberWoHpass, zOperatorEnum
} from './z-models'

// Prelims: ////////////////////////////////////////////////////////////////////

const include = true

const zId = z.object({ id: z.string() })
const zInapiToken = z.object({ inapiToken: z.string() })
type ZInapiToken = z.infer<typeof zInapiToken>
const zExapiToken = z.object({ api_key: z.string() })
const zAuthSuccess = zInapiToken.extend({ member: zMemberWoHpass })
type ZAuthSuccess = z.infer<typeof zAuthSuccess>

const ping = tapiduck.endpoint({
  path: '/coapi/ping',
  zReq: z.object({ ping: z.string() }),
  zRes: z.object({ pong: z.string() })
})

/// ////////////////////////////////////////////////////////////////////////////
// Internal API: ///////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Auth (internal):
const setup = tapiduck.endpoint({
  path: '/inapi/setup',
  zReq: z.object({
    fname: z.string(),
    lname: z.string(),
    email: z.string(),
    password: z.string()
  }),
  zRes: zAuthSuccess
})
const login = tapiduck.endpoint({
  path: '/inapi/login',
  zReq: z.object({
    email: z.string(),
    password: z.string()
  }),
  zRes: zAuthSuccess
})

// Flags (internal):
const createFlag = tapiduck.endpoint({
  path: '/inapi/createFlag',
  zReq: zInapiToken.extend({ flag_id: z.string() }),
  zRes: zFlag
})
const getFlags = tapiduck.endpoint({
  path: '/inapi/getFlags',
  zReq: zInapiToken,
  zRes: z.array(zFlag)
})
const updateFlag = tapiduck.endpoint({
  path: '/inapi/updateFlag',
  zReq: zInapiToken.extend({
    flag: zId.and(
      // To allow surgical updates, all non-ID flag-props are optional.
      zFlag.pick({
        live_enabled: include,
        test_enabled: include,
        description: include,
        archived: include
      }).partial()
    )
  }),
  zRes: zFlag
})
const deleteFlag = tapiduck.endpoint({
  path: '/inapi/deleteFlag',
  zReq: zInapiToken.extend({ flag_id: z.string() }),
  zRes: zId
})

// Rules (internal):
const createRule = tapiduck.endpoint({
  path: '/inapi/createRule',
  zReq: zInapiToken.extend({
    flag_id: z.string(),
    mode: zModeEnum,
    rank: z.number()
  }),
  zRes: zRule
})
const getFlagRules = tapiduck.endpoint({
  path: '/inapi/getFlagRules',
  zReq: zInapiToken.extend({ flag_id: z.string() }),
  zRes: z.array(zRule)
})
const updateRule = tapiduck.endpoint({
  path: '/inapi/updateRule',
  zReq: zInapiToken.extend({
    rule: zRule.pick({
      id: include,
      rank: include,
      description: include,
      negated: include,
      operand_type: include,
      lhs_operand_key: include,
      operator: include,
      rhs_operand_value: include,
      result_value: include
    })
  }),
  zRes: zRule
})
const deleteRule = tapiduck.endpoint({
  path: '/inapi/deleteRule',
  zReq: zInapiToken.extend({ rule_id: z.string() }),
  zRes: zId
})

/// ////////////////////////////////////////////////////////////////////////////
// External API: ///////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const evalFlag = tapiduck.endpoint({
  path: '/exapi/evalFlag',
  zReq: zExapiToken.extend({
    flag_id: z.string(),
    mode: zModeEnum,
    traits: zTraits

  }),
  zRes: zFlagReadout
})
const evalFlags = tapiduck.endpoint({
  path: '/exapi/evalFlags',
  zReq: zExapiToken.extend({
    flag_ids: z.array(z.string()).optional(),
    mode: zModeEnum,
    traits: zTraits
  }),
  zRes: zFlagReadoutMap
})

// Export: /////////////////////////////////////////////////////////////////////

const api = {
  common: {
    ping
  },
  internal: {
    // auth:
    setup,
    login,
    // flags:
    createFlag,
    getFlags,
    updateFlag,
    deleteFlag,
    // rules:
    createRule,
    getFlagRules,
    updateRule,
    deleteRule
  },
  external: {
    evalFlag,
    evalFlags
  }
}

export type { ZAuthSuccess, ZInapiToken }
export { api }
