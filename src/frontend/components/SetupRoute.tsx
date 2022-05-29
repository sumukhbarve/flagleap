import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthWall } from './AuthWall'
import { roqsduck, tapiduck } from 'monoduck'
import * as store from '../store'
import { api } from '../../shared/endpoints'

export const SetupRoute: React.VFC = function () {
  // TODO: Redirect to flag lister if already logged in.
  const [fname, setFname] = React.useState('')
  const [lname, setLname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const [pw2, setPw2] = React.useState('')
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    const { inapiToken, member } = await tapiduck.fetch(api.internal.setup, {
      fname, lname, email, password: pw
    })
    store.inapiToken.set(inapiToken)
    store.me.set(member)
    roqsduck.setRouteInfo({ id: 'flagLister' })
  }
  return (
    <AuthWall>
      <h2>Flagleap Setup</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text' placeholder='First Name' required
            value={fname} onChange={e => setFname(e.currentTarget.value)}
          />
          {fname}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text' placeholder='Last Name' required
            value={lname} onChange={e => setLname(e.currentTarget.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email' placeholder='Email Address' required
            value={email} onChange={e => setEmail(e.currentTarget.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Create Password</Form.Label>
          <Form.Control
            type='password' placeholder='New Password' required
            value={pw} onChange={e => setPw(e.currentTarget.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            type='password' placeholder='New Password' required
            value={pw2} onChange={e => setPw2(e.currentTarget.value)}
          />
        </Form.Group>

        <Button type='submit'>Submit</Button>
      </Form>
    </AuthWall>
  )
}
