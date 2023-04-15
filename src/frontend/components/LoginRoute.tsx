import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthWall } from './AuthWall'
import { roqsduck, tapiduck } from 'monoduck'
import { store } from '../store'
import { api } from '../../shared/endpoints'
import { useMountExpectsLoggedOut } from '../hooks'
import { autoLogin } from '../autoLogin'

export const LoginRoute: React.VFC = function () {
  useMountExpectsLoggedOut()
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.spinnerText.set('Logging in ...')
    const { inapiToken, member } = await tapiduck.fetch(api.internal.login, {
      email, password: pw
    })
    store.spinnerText.set('')
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

        <Button type='submit'>Submit</Button>
      </Form>
    </AuthWall>
  )
}
