import React from 'react'
import { roqsduck, tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'
import { store, useStore } from '../store'
import { Button, Modal, Form } from 'react-bootstrap'

export const CreateFlagButton: React.VFC = function () {
  const [show, setShow] = React.useState(false)
  const [flagId, setFlagId] = React.useState('')
  const onHide = React.useCallback(() => setShow(false), [])
  const { inapiToken } = useStore('inapiToken')
  const onCreate = async function (): Promise<void> {
    store.spinnerText.set('Creating Flag ...')
    const resp = await tapiduck.fetch(api.internal.createFlag, {
      inapiToken, flag_id: flagId
    })
    store.spinnerText.set('')
    setShow(false)
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const flag = resp.data
    store.flagMap.updateObjects([flag])
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
