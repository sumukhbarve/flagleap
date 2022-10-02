import { buildFlagleapClient, injectIsomorphicFetch } from './sdk/sdk-js'
import { makeUseFlag } from './sdk/sdk-react'

const flagleapSdk = {
  injectIsomorphicFetch,
  buildFlagleapClient,
  makeUseFlag
}

const firstFlag = true

export { firstFlag, flagleapSdk }
