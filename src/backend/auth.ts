import { z } from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { _ } from 'monoduck'
import { config } from './config'
import type { ZMember, ZMemberWoHpass } from '../shared/z-models'
import type { ZAuthSuccess } from '../shared/endpoints'
import { models } from './models'

const SECR = config.SECRET_KEY // short, module-local alias

const zTokenbox = z.object({
  text: z.string(),
  iat: z.number()
})

const textToJwt = function (text: string, secret = SECR): string {
  const tokenbox = { text, iat: _.now() }
  return jwt.sign(tokenbox, secret)
}

// Returns original text if verification successeds, else null.
const jwtToTextSafely = function (token: string, secret = SECR): string | null {
  try {
    // Either of the following two lines can throw an error
    const tokenboxy = jwt.verify(token, secret, { maxAge: '1 day' })
    return zTokenbox.parse(tokenboxy).text
  } catch (e) {
    return null
  }
}

const hashPw = async (pw: string): Promise<string> => {
  return await bcrypt.hash(pw, 12)
}

const checkPw = async (pw: string, hashedPw: string): Promise<boolean> => {
  return await bcrypt.compare(pw, hashedPw)
}

const woHpass = function (member: ZMember): ZMemberWoHpass {
  const { hpass, ...woHpass } = member
  return woHpass
}

const successResponse = function (member: ZMember): ZAuthSuccess {
  return {
    inapiToken: textToJwt(member.id),
    member: woHpass(member)
  }
}

const getMe = async function (inapiToken: string): Promise<ZMember | null> {
  const memberId = jwtToTextSafely(inapiToken)
  if (_.not(memberId)) {
    return null
  }
  const member = await models.member.findOne({ where: { id: memberId } })
  return member ?? null
}

const generalFailText = 'Session expired. Please log in and retry.'

export const auth = {
  hashPw, checkPw, woHpass, successResponse, getMe, generalFailText
}
