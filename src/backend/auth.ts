import { z } from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { _, TapiError } from 'monoduck'
import { config } from './config'
import type { ZMember, ZMemberWoHpass } from '../shared/z-models'
import type { ZAuthSuccess } from '../shared/endpoints'

const SECR = config.SECRET_KEY // short, module-local alias

const zTokenbox = z.object({
  text: z.string(),
  iat: z.number()
})

const createJwt = function (text: string, secret = SECR): string {
  const tokenbox = { text, iat: _.now() }
  return jwt.sign(tokenbox, secret)
}

// Returns original text if verification successeds, else null.
const verifyJwt = function (token: string, secret = SECR): string | null {
  try {
    // Either of the following two lines can throw an error
    const tokenboxy = jwt.verify(token, secret, { maxAge: '1 day' })
    return zTokenbox.parse(tokenboxy).text
  } catch (e) {
    throw new TapiError('Session expired. Please log in and retry.')
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
    inapiToken: createJwt(member.id),
    member: woHpass(member)
  }
}

export const auth = {
  createJwt, verifyJwt, hashPw, checkPw, woHpass, successResponse
}
