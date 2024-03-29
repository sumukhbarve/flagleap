import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthWall } from './AuthWall'
import { roqsduck, tapiduck } from 'monoduck'
import { store } from '../store'
import { api } from '../../shared/endpoints'
import { useMountExpectsLoggedOut } from '../hooks'

export const SetupRoute: React.VFC = function () {
  useMountExpectsLoggedOut()
  const [fname, setFname] = React.useState('')
  const [lname, setLname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const [pw2, setPw2] = React.useState('')
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    const resp = await tapiduck.fetch(api.internal.setup, {
      fname, lname, email, password: pw
    })
    if (resp.status !== 'success') {
      return window.alert(resp.status === 'fail' ? resp.data : 'Unknown error')
    }
    const { inapiToken, member } = resp.data
    store.inapiToken.set(inapiToken)
    store.me.set(member)
    roqsduck.setRouteInfo({ id: 'flagLister' })
  }
  return (
    <AuthWall>
      <h2 className='mb-3'>Setup</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text' placeholder='First Name' required
            value={fname} onChange={e => setFname(e.currentTarget.value)}
          />
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
