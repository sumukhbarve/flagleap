import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthWall } from './AuthWall'
import { roqsduck, tapiduck, _ } from 'monoduck'
import { store } from '../store'
import { api } from '../../shared/endpoints'
import { useMountExpectsLoggedOut } from '../hooks'
import { autoLogin } from '../autoLogin'

export const LoginRoute: React.VFC = function () {
  useMountExpectsLoggedOut()
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)
  const [errMsg, setErrMsg] = React.useState('')
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.spinnerText.set('Logging in ...')
    const resp = await tapiduck.fetch(api.internal.login, {
      email, password: pw
    })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return setErrMsg(tapiduck.failMsg(resp, data => data))
    }
    const { inapiToken, member } = resp.data
    store.inapiToken.set(inapiToken)
    store.me.set(member)
    if (rememberMe) {
      autoLogin.rememberMe(inapiToken)
    }
    roqsduck.setRouteInfo({ id: 'flagLister' })
  }
  return (
    <AuthWall>
      <h2 className='mb-3'>Login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email' placeholder='' required
            value={email} onChange={e => setEmail(e.currentTarget.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password' placeholder='' required
            value={pw} onChange={e => setPw(e.currentTarget.value)}
          />
        </Form.Group>

        {autoLogin.availableIs() && (
          <Form.Group className='mb-3'>
            <Form.Check
              type='checkbox'
              checked={rememberMe}
              onChange={() => setRememberMe(bool => !bool)}
              id='remember-me-form-check'
              label='Remember me, this is a trusted device.'
            />
          </Form.Group>
        )}

        <Form.Group className='mb-3'>
          {_.bool(errMsg) && (
            <p className='text-danger'>Error: {errMsg}</p>
          )}
          <Button type='submit'>Submit</Button>
        </Form.Group>
      </Form>
    </AuthWall>
  )
}
