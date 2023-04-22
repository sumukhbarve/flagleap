import { z } from 'zod'
import { tapiduck } from 'monoduck'
import {
  zMemberWoHpass, zFlag, zRule, zFlagout,
  zFlagoutMap, zModeEnum, zTraits, zFlagNotif
  // zMember, zMemberWoHpass, zOperatorEnum
} from './z-models'

// Prelims: ////////////////////////////////////////////////////////////////////

const include = true // alias, useful for writing zFoo.pick({bar: include})

const zId = z.object({ id: z.string() })
const zInapiToken = z.object({ inapiToken: z.string() })
type ZInapiToken = z.infer<typeof zInapiToken>
const zExapiToken = z.object({}) // was: z.object({ api_key: z.string() })
const zAuthSuccess = zInapiToken.extend({ member: zMemberWoHpass })
type ZAuthSuccess = z.infer<typeof zAuthSuccess>

const ping = tapiduck.endpoint({
  path: '/coapi/ping',
  zRequest: z.object({ ping: z.string() }),
  zSuccess: z.object({ pong: z.string() }),
  zFail: z.string()
})

/// ////////////////////////////////////////////////////////////////////////////
// Internal API: ///////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Auth (internal):
const setup = tapiduck.endpoint({
  path: '/inapi/setup',
  zRequest: z.object({
    fname: z.string(),
    lname: z.string(),
    email: z.string(),
    password: z.string()
  }),
  zSuccess: zAuthSuccess,
  zFail: z.string()
})
const login = tapiduck.endpoint({
  path: '/inapi/login',
  zRequest: z.object({
    email: z.string(),
    password: z.string()
  }),
  zSuccess: zAuthSuccess,
  zFail: z.string()
})
const whoami = tapiduck.endpoint({
  path: '/inapi/whoami',
  zRequest: zInapiToken,
  zSuccess: zAuthSuccess,
  zFail: z.string()
})

// Flags (internal):
const createFlag = tapiduck.endpoint({
  path: '/inapi/createFlag',
  zRequest: zInapiToken.extend({ flag_id: z.string() }),
  zSuccess: zFlag,
  zFail: z.string()
})
const getFlags = tapiduck.endpoint({
  path: '/inapi/getFlags',
  zRequest: zInapiToken,
  zSuccess: z.array(zFlag),
  zFail: z.string()
})
const updateFlag = tapiduck.endpoint({
  path: '/inapi/updateFlag',
  zRequest: zInapiToken.extend({
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
  zSuccess: zFlag,
  zFail: z.string()
})
const deleteFlag = tapiduck.endpoint({
  path: '/inapi/deleteFlag',
  zRequest: zInapiToken.extend({ flag_id: z.string() }),
  zSuccess: zId,
  zFail: z.string()
})

// Rules (internal):
const createRule = tapiduck.endpoint({
  path: '/inapi/createRule',
  zRequest: zInapiToken.extend({
    flag_id: z.string(),
    mode: zModeEnum,
    rank: z.number()
  }),
  zSuccess: zRule,
  zFail: z.string()
})
const getFlagRules = tapiduck.endpoint({
  path: '/inapi/getFlagRules',
  zRequest: zInapiToken.extend({ flag_id: z.string() }),
  zSuccess: z.array(zRule),
  zFail: z.string()
})
const updateRule = tapiduck.endpoint({
  path: '/inapi/updateRule',
  zRequest: zInapiToken.extend({
    rule: zRule.pick({
      id: include,
      rank: include,
      description: include,
      negated: include,
      lhs_operand_key: include,
      operator: include,
      rhs_operand_value: include,
      result_value: include
    })
  }),
  zSuccess: zRule,
  zFail: z.string()
})
const deleteRule = tapiduck.endpoint({
  path: '/inapi/deleteRule',
  zRequest: zInapiToken.extend({ rule_id: z.string() }),
  zSuccess: zId,
  zFail: z.string()
})

/// ////////////////////////////////////////////////////////////////////////////
// External API: ///////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const evalFlag = tapiduck.endpoint({
  path: '/exapi/evalFlag',
  zRequest: zExapiToken.extend({
    flag_id: z.string(),
    mode: zModeEnum,
    traits: zTraits

  }),
  zSuccess: zFlagout,
  zFail: z.string()
})
const evalFlags = tapiduck.endpoint({
  path: '/exapi/evalFlags',
  zRequest: zExapiToken.extend({
    flag_ids: z.array(z.string()).optional(),
    mode: zModeEnum,
    traits: zTraits
  }),
  zSuccess: zFlagoutMap,
  zFail: z.string()
})

// Socket Related: /////////////////////////////////////////////////////////////

const flagNotifFromServer = tapiduck.sockpoint({
  name: 'flagNotifFromServer',
  zData: zFlagNotif
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
    whoami,
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
    evalFlags,
    sock: {
      flagNotifFromServer
    }
  }
}

export type { ZAuthSuccess, ZInapiToken }
export { api }
