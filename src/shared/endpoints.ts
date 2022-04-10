import { z } from 'zod'
import { tapiduck } from 'monoduck'
import { zSettings, zEndUser, zEndUserExtras, zFlag, zRule } from './z-models'

// Prelims:
const zOk = z.object({ ok: z.literal(true) })
const zKVPairStrStr = z.object({ key: z.string(), value: z.string() })
const zRecordStrStr = z.record(z.string())

const zInapiToken = z.object({ inapiToken: z.string() })
const zExapiToken = z.object({ api_key: z.string() })

const ping = tapiduck.endpoint({
  path: '/inapi/ping',
  zReq: z.object({ ping: z.string() }),
  zRes: z.object({ pong: z.string() })
})

// Internal - Settings: //////////////////////////////////////////////////////////////
const zSetupReq = z.object({
  admin_username: z.string(),
  admin_password: z.string(),
  mode_lines: z.string()
})
const setup = tapiduck.endpoint({
  path: '/inapi/setup',
  zReq: zSetupReq,
  zRes: zOk
})
const login = tapiduck.endpoint({
  path: '/inapi/login',
  zReq: zSetupReq.pick({ admin_username: true, admin_password: true }),
  zRes: zInapiToken
})
const updateSettings = tapiduck.endpoint({
  path: '/inapi/updateModes',
  zReq: zInapiToken.merge(zSettings.pick({
    admin_username: true,
    mode_lines: true
  }).partial()),
  zRes: zOk
})
const regenerateApiKey = tapiduck.endpoint({
  path: '/inapi/regenerateApiKey',
  zReq: zInapiToken,
  zRes: z.object({ api_key_clear: z.string() })
})

// Internal - Flags: /////////////////////////////////////////////////////////////
const createFlag = tapiduck.endpoint({
  path: '/inapi/createFlag',
  zReq: zInapiToken.extend({ flag_key: z.string() }),
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
      id: true, default_value: true, enabled: true, description: true
    })
  }),
  zRes: zFlag
})
const archiveFlag = tapiduck.endpoint({
  path: '/inapi/archiveFlag',
  zReq: zInapiToken.extend({ flag_id: z.string() }),
  zRes: zFlag
})

// Internal - Rules: ///////////////////////////////////////////////////////////
const createRule = tapiduck.endpoint({
  path: '/inapi/createRule',
  zReq: zInapiToken.extend({ flag_id: z.string() }),
  zRes: zRule
})
const getRulesForFlag = tapiduck.endpoint({
  path: '/inapi/getFlagRules',
  zReq: zInapiToken.extend({ flag_id: z.string() }),
  zRes: z.array(zRule)
})
const updateRule = tapiduck.endpoint({
  path: '/inapi/updateRule',
  zReq: zInapiToken.extend({
    rule: zRule.pick({
      id: true,
      enabled: true,
      rank: true,
      value: true,
      // user_key related:
      user_key_matcher: true,
      user_key_negate: true,
      user_key_rhs: true,
      //  group_key related:
      group_key_matcher: true,
      group_key_negate: true,
      group_key_rhs: true
    })
  }),
  zRes: zRule
})
const archiveRule = tapiduck.endpoint({
  path: '/inapi/archiveRule',
  zReq: zInapiToken.extend({ rule_id: z.string() }),
  zRes: zRule
})

// External - End Users: ///////////////////////////////////////////////////////
const exapiIdentifyEndUser = tapiduck.endpoint({
  path: '/exapi/identifyEndUser',
  zReq: zExapiToken
    .merge(zEndUser.pick({ user_key: true }))
    .merge(zEndUserExtras.partial()),
  zRes: zKVPairStrStr
})

// External - Flags: ///////////////////////////////////////////////////////////
const exapiReadFlag = tapiduck.endpoint({
  path: '/exapi/readFlag',
  zReq: zExapiToken.extend({
    flag_key: z.string(),
    user_key: z.string(),
    mode: z.string()
  }),
  zRes: zKVPairStrStr
})
const exapiReadFlags = tapiduck.endpoint({
  path: '/exapi/readFlags',
  zReq: zExapiToken.extend({
    flag_keys: z.array(z.string()).optional(),
    user_key: z.string(),
    mode: z.string()
  }),
  zRes: zRecordStrStr
})

export const api = {
  ping,
  // internal - settings etc:
  setup,
  login,
  updateSettings,
  regenerateApiKey,
  // internal - flags:
  createFlag,
  getFlags,
  updateFlag,
  archiveFlag,
  // internal - rules:
  createRule,
  getRulesForFlag,
  updateRule,
  archiveRule,
  // external:
  exapiIdentifyEndUser,
  exapiReadFlag,
  exapiReadFlags
}
