import { app } from './api-base'
import { tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'

tapiduck.route(app, api.internal.setup, async function (reqdata) {
  console.log(reqdata)
  return { inapiToken: Object.keys(reqdata).join(', ') }
})

tapiduck.route(app, api.internal.login, async function (reqdata) {
  console.log(reqdata)
  return { inapiToken: Object.keys(reqdata).join(', ') }
})
