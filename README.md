# FlagLeap

Leap forward with feature flags!

### Screenshot:

![Flag Lister Screenshot](/screenshots/2022-06-18-flagLister.png)

### What is it?

- Feature flag management, built with a bias toward simplicity & scalability.
- Includes rule-based flag evaluation, supports for multiple rule operators.
- Two modes: `live` and `test`. Rules in `test` mode don't affect `live` mode.

### Quickstart:
- `git clone https://github.com/sumukhbarve/flagleap.git`
- `cd flagleap`
- `npm install`
- `npm run build`
- `npm start`
- Visit http://localhost:3000, complete account setup, and create flags.
- POST `/exapi/evalFlags` with below JSON request body, to evaluate all flags:
  -  `{"mode": "test", "traits": {}}`

**CURL snippet for evaluating all flags:**
```sh
curl --request POST \
  --url http://localhost:3000/exapi/evalFlags \
  --header 'content-type: application/json' \
  --data '{"mode": "test", "traits": {}}'
```

**Quick Notes:**
- The `traits` object can be used to specify user-specific properties.
- You can define flag-specific rules for trait-driven evaluations.


### Pre-Alpha Software

- FlagLeap is not currently suitable for production use.
- Large sections of it are being (re-)written every weekend.
- External & internal APIs are both likely to undergo rapid change.
