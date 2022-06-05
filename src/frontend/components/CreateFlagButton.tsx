import React from 'react'
import { roqsduck, tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { Button, Modal, Form } from 'react-bootstrap'

export const CreateFlagButton: React.VFC = function () {
  const [show, setShow] = React.useState(false)
  const [flagId, setFlagId] = React.useState('')
  const onHide = React.useCallback(() => setShow(false), [])
  const inapiToken = store.use(store.inapiToken)
  const onCreate = async function (): Promise<void> {
    store.loadingMsg.set('Creating Flag ...')
    const flag = await tapiduck.fetch(api.internal.createFlag, {
      inapiToken, flag_id: flagId
    })
    store.setFlags([flag])
    store.loadingMsg.set('')
    setShow(false)
    roqsduck.setRouteInfo({ id: 'flagEditor', flagId: flag.id })
  }
  return (
    <>
      <Button onClick={() => setShow(true)}>Create Flag</Button>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Create Flag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type='text' value={flagId} onChange={e => setFlagId(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>Cancel</Button>
          <Button variant='primary' onClick={onCreate}>Create</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
