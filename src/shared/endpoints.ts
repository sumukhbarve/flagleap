import { z } from 'zod'
import { tapiduck } from 'monoduck'
import {
  zFlag, zRule, zFlagReadout, zFlagReadoutMap, zModeEnum, zTraits
  // zMember, zMemberWoHpass, zOperatorEnum
} from './z-models'

// Prelims: ////////////////////////////////////////////////////////////////////

const include = true

const zId = z.object({ id: z.string() })
const zInapiToken = z.object({ inapiToken: z.string() })
const zExapiToken = z.object({ api_key: z.string() })

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
  zRes: zInapiToken
})
const login = tapiduck.endpoint({
  path: '/inapi/login',
  zReq: z.object({
    email: z.string(),
    password: z.string()
  }),
  zRes: zInapiToken
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
    flag: zFlag.pick({
      id: include,
      live_enabled: include,
      test_enabled: include,
      description: include,
      archived: include
    })
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
  zReq: zInapiToken.extend({ flag_id: z.string() }),
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
      live_exists: include,
      test_exists: include,
      enabled: include,
      rank: include,
      lhs_operand_key: include,
      operator: include,
      rhs_operand_value: include,
      negated: include,
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

const exapiReadFlag = tapiduck.endpoint({
  path: '/exapi/readFlag',
  zReq: zExapiToken.extend({
    flag_id: z.string(),
    mode: zModeEnum,
    traits: zTraits

  }),
  zRes: zFlagReadout
})
const exapiReadFlags = tapiduck.endpoint({
  path: '/exapi/readFlags',
  zReq: zExapiToken.extend({
    flag_ids: z.array(z.string()).optional(),
    mode: z.string(),
    traits: zTraits
  }),
  zRes: zFlagReadoutMap
})

export const api = {
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
    exapiReadFlag,
    exapiReadFlags
  }
}
