# FlagLeap

## What is it?

- Simple and flexible solution for managing realtime feature flags.
- Meant to be deployed as a standalone service, and consumed via REST API.
- Supports rule-based flag evaluation (with support for multiple rule operators).
- Two modes: `live` and `test`.  (Rules in `test` mode don't affect `live` mode.)
- Currently includes SDKs for JavaScript (browser/node), TypeScript, and React (web).


### Screenshots:

| List of Flags | Flag-Specific Rules |
| --- | --- |
| <img alt="FlagLeap: List of Flags" src="/screenshots/2022-06-18-flagLister.png" width="450" /> | <img alt="FlagLeap: Flag-Specific Rules" src="/screenshots/2022-06-20-flagEditor.png" width="450" /> |

### !!! Pre-Alpha Software !!!

- FlagLeap is not currently suitable for production use.
- Large sections of it are being (re-)written every weekend.
- External & internal APIs are both likely to undergo rapid change.


## Quickstart:

### 1. Clone the repo and start the server:

- `git clone https://github.com/sumukhbarve/flagleap.git`
- `cd flagleap`
- `npm install`
- `npm run build`
- `npm start`

### 2. Set up your account and create your first flag:
- Visit http://localhost:3333 and complete account setup.
- Click 'Create Flag' and enter the an ID (eg. `enableFoo`) for the flag.
- (3333 is the default port. Set environment variable `PORT` to override.)

### 3. Use the API or an SDK to use feature flags in your app!

### 3A. Using the REST API:

- POST `/exapi/evalFlags` with below JSON request body, to evaluate all flags:
  -  `{"mode": "test", "traits": {}}`

CURL snippet for evaluating all flags:
```sh
curl --request POST \
  --url http://localhost:3000/exapi/evalFlags \
  --header 'content-type: application/json' \
  --data '{"mode": "test", "traits": {}}'
```

Quick Notes:
1. The `traits` object can be used to specify user-specific properties.
2. You can define flag-specific rules for trait-driven evaluations.
3. To evaluate a single flag, hit `/exapi/evalFlag` with below JSON request body:
    - `{"flag_id": "enableFoo", "mode": "test", "traits": {}}`


### 3B. Use the JavaScript (TypeScript) SDK:

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

### 3C. Use the React SDK:

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

### Isomorphic fetch() on Node.js:

- To use the JS/TS SDK on Node.js, `npm install node-fetch` (or another isomorphic `fetch`).
- And supply it (dependency injection) to flagleap via `flagleapSdk.injectIsomorphicFetch(fetch)`.

### Realtime Behavior:
- The React SDK is already realtime!
- To get realtime updates in plain JS/TS, use `.subscribe()`:
```ts
flagleap.subscribe(() => {
  // This will be called whenever a flag changes.
})
```
