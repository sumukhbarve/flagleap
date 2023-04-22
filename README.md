# FlagLeap

### Table Of Contents

- [Introduction](#introduction)
- [Screenshots](#screenshots)
- [Not Ready for Production](#not-ready-for-production)
- [Quickstart](#quickstart)
- [Server Setup](#server-setup)
- [Rest API](#rest-api)
- [JS/TS/Node SDK](#jstsnode-sdk)
- [React SDK](#react-sdk)

## Introduction

- FlagLeap is a simple & flexible solution for managing realtime feature flags.
- It is meant to be deployed as a standalone service, and can be consumed via a REST API.
- SDKs for JavaScript (browser and node), TypeScript, and React (web) are included.
- FlagLeap supports rule-based, user-specific flag evaluations (with multiple rule types).
- It has 2 modes: `live` and `test`.  (Rules in `test` mode don't affect `live` mode.)


## Screenshots

| List of Flags | Flag-Specific Rules |
| --- | --- |
| <img alt="FlagLeap: List of Flags" src="/screenshots/2022-06-18-flagLister.png" width="450" /> | <img alt="FlagLeap: Flag-Specific Rules" src="/screenshots/2022-06-20-flagEditor.png" width="450" /> |

## Not Ready for Production

- FlagLeap is not yet ready for production use.
- External & internal APIs are both likely change.
- However, it is ready for POCs and non-critical internal apps.

## Quickstart

1. Please complete the [Server Setup](#server-setup) steps.
2. And use any (one or more) of the following to interact with the server:
    - [React SDK](#react-sdk):
    - [JS/TS/Node SDK](#jstsnode-sdk)
    - [REST API](#rest-api)

## Server Setup

### 1. Clone the repo and start the server:

- `git clone https://github.com/sumukhbarve/flagleap.git`
- `cd flagleap`
- `npm install`
- `npm run build`
- `npm start`

### 2. Set up your account and create your first flag:
- Visit http://localhost:3333 and complete account setup.
- Click 'Create Flag' and enter the an ID (eg. `enableFoo`) for the flag.

### Set Environment Variables if deploying to the web:
- `PORT` (defaults to 3333)
- `DATABASE_URL` (defaults to repo/local-sqlite.db)
- `SECRET_KEY` (defaults to not-really-a-secret--just-the-fallback)

## Flag Shape

A flag, as returned by the REST API (and SDKs) has the following shape:
```ts
interface Flag {
  id: string
  enabled: boolean
  value: string
}
```

#### FlagMap

A `FlagMap` is a mapping from flag IDs to corresponding flag objects.
```ts
type FlagMap = Record<string, Flag>
```

**`.enabled` vs `.value`**
- If a flag is disabled, the `.value` will always be `''` (empty string).
- If a flag is enabled, the value will be the result value of the first rule that is satisfied.
- If a flag has no rules, the `.value` will be `''` (empty string).


## Rest API

Only `POST` requests of type `application/json` are expected.

### 1. Evaluating all flags

Endpoint: `/exapi/evalFlags`

Request Data:
-  `mode`: `"test"` or `"live"`
-  `traits`: A plain object describing the user, with only string or number values.
    - Eg: `{"userId": "00c13408a...", "plan": "premium", "projectCount": 10}`

Successful Response Shape:
- `{status: "success", data: FlagMap}` (See [FlagMap](#flagmap) shape above)



CURL snippet:
```sh
curl --request POST \
  --url http://localhost:3333/exapi/evalFlags \
  --header 'content-type: application/json' \
  --data '{"mode": "test", "traits": {}}'
```


### 2. Evaluating a single flag

Endpoint: `/exapi/evalFlag`

Request Data:
- `flag_id`: string
- `mode`: `"test"` or `"live"`
- `traits`: A plain object describing the user, with only string or number values.
    - Eg: `{"userId": "00c13408a...", "plan": "premium", "projectCount": 10}`

Successful Response Shape:
- `{status: "success", data: Flag}` (See [Flag](#flag-shape) shape above)

### 3. Socket.IO API

- To subscribe to realtime updates, you can point a Socket.IO client to your FlagLeap server (`instanceUrl`).
- Whenever a flag (potentially) changes, the server emits a `'flagNotifFromServer'` event.
- The associated data has two properties:
    - `flag_id`: string ID of the flag
    - `mode`: either 'test' or 'live'

- Upon receiving a `flagNotifFromServer`, you should use the `/exapi/evalFlag` endpoint to re-evaluate that flag.
- If you're using one of the SDKs, then there's you needn't do this manually. The SDK will handle this for you.

## JS/TS/Node SDK

`npm install flagleap` in your app, and then:

```ts
import { flagleapSdk } from 'flagleap'

// Create a flagleap client:
const flagleap = flagleapSdk.flagleapClient({
  instanceUrl: "http://localhost:3333",
  mode: "test",
})

// Optionally set user-traits for user-specific flag evaluations.
// This may be done right away, or as/when a user logs in.
flagleap.setTraits({
  userId: 'user_1234',
  plan: 'premium',
  // ... etc ...
})

// Initialize the client and call `.getFlag()` for getting flags!
flagleap.init().then(function () {
  const isFooEnabled = flagleap.getFlag('enableFoo').enabled
})

// When the user logs out, you may want to:
flagleap.setTraits({})
```

### Isomorphic fetch() on Node.js:

- To use the JS/TS SDK on Node, `npm install node-fetch` (or another isomorphic `fetch` function).
- And supply it (dependency injection) to flagleap via `flagleapSdk.injectIsomorphicFetch(fetch)`.

### Realtime Behavior:
- To subscribe to realtime notifications regarding (potential) flag updates, use `.subscribe()`:
```ts
flagleap.subscribe(() => {
  // This will be called whenever a flag changes.
})
```

## React SDK

`npm install flagleap` in your app, and then:

`flag-store.ts`
```ts
import { React } from 'react'
import { flagleapSdk } from 'flagleap'

// Create a flagleap client:
const flagleap = flagleapSdk.flagleapClient({
  instanceUrl: "http://localhost:3333",
  mode: "test",
})

// Pass your version of React (>= 16.8) to generate a hook.
const useFlag = flagleapSdk.makeUseFlag(flagleap, React)

export { flagleap, useFlag }
```

And call `useFlag` in your components:

`Counter.tsx`
```tsx
import { React } from 'react'
import { useFlag } from './flag-store'

export const Counter: React.VFC = () => {
  const [count, setCount] = React.useState(0)
  const addTwoEnabled = useFlag('enableAddTwo').enabled
  return (
    <div>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>Add 1</button>
      {addTwoEnabled && (
        <button onClick={() => setCount(count + 2)}>Add 2</button>
      )}
    </div>
  )
}
```

Use the FlagLeap UI to (create and) enable the `enableAddTwo` flag. Toggling the flag will toggle the `Add 2` button in your app.
