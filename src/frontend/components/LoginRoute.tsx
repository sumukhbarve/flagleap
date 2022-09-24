import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthWall } from './AuthWall'
import { _, roqsduck, tapiduck } from 'monoduck'
import { store } from '../store'
import { api } from '../../shared/endpoints'
import { useMountExpectsLoggedOut } from '../hooks'

_.noop()

export const LoginRoute: React.VFC = function () {
  useMountExpectsLoggedOut()
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.spinnerText.set('Logging in ...')
    const { inapiToken, member } = await tapiduck.fetch(api.internal.login, {
      email, password: pw
    })
    store.spinnerText.set('')
    store.inapiToken.set(inapiToken)
    store.me.set(member)
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

        <Button type='submit'>Submit</Button>
      </Form>
    </AuthWall>
  )
}
