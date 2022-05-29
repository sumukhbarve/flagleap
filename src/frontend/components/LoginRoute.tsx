import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthWall } from './AuthWall'
import { roqsduck, tapiduck } from 'monoduck'
import * as store from '../store'
import { api } from '../../shared/endpoints'

export const LoginRoute: React.VFC = function () {
  // TODO: Redirect to flag lister if already logged in.
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    const { inapiToken, member } = await tapiduck.fetch(api.internal.login, {
      email, password: pw
    })
    store.inapiToken.set(inapiToken)
    store.me.set(member)
    roqsduck.setRouteInfo({ id: 'flagLister' })
  }
  return (
    <AuthWall>
      <h2>Flagleap Login</h2>
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
