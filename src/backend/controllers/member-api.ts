import { v4 as uuidv4 } from 'uuid'
import { tapiduck, _ } from 'monoduck'
import type { ZMember } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { app } from './api-base'
import { models } from '../models'
import { auth } from '../auth'

tapiduck.route(app, api.internal.setup, async function (reqdata, jsend) {
  const memberCount = await models.member.count({})
  if (memberCount !== 0) {
    return jsend.fail('Setup already complete. Please log in.')
  }
  const memberId = uuidv4()
  const hpass = await auth.hashPw(reqdata.password)
  const member: ZMember = {
    id: memberId,
    fname: reqdata.fname,
    lname: reqdata.lname,
    email: reqdata.email,
    hpass: hpass,
    created_at: Date.now(),
    updated_at: 0,
    creator_id: memberId, // this member is their own creator
    updater_id: ''
  }
  await models.member.create(member)
  return jsend.success(auth.successResponse(member))
})

tapiduck.route(app, api.internal.login, async function (reqdata, jsend) {
  const member = await models.member.findOne({
    where: { email: reqdata.email }
  })
  const failMsg = 'Invalid email or password. Please try again.'
  if (member === null) {
    return jsend.fail(failMsg)
  }
  const pwOk = await auth.checkPw(reqdata.password, member.hpass)
  if (!pwOk) {
    return jsend.fail(failMsg)
  }
  return jsend.success(auth.successResponse(member))
})

tapiduck.route(app, api.internal.whoami, async function (reqdata, jsend) {
  const member = await auth.getMe(reqdata.inapiToken)
  return _.bool(member)
    ? jsend.success(auth.successResponse(member))
    : jsend.fail(auth.generalFailText)
})
