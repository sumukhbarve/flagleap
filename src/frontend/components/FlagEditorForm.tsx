import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { tapiduck } from 'monoduck'
import * as store from '../store'
import type { ZFlag } from '../../shared/z-models'
import { api } from '../../shared/endpoints'

export const FlagEditorForm: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  const [flagX, setFlagX] = React.useState({ ...flag })
  const modeEnabledKey = store.use(store.modeEnabledKey)
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.loadingMsg.set('Saving Flag ...')
    const updatedFlag = await tapiduck.fetch(api.internal.updateFlag, {
      flag: flagX, inapiToken: store.inapiToken.get()
    })
    store.setFlags([updatedFlag])
    store.loadingMsg.set('')
    alert('Flag saved.')
  }
  return (
    <Form onSubmit={onSubmit}>
      <Row>

        <Col md={2}>
          <Form.Label>Enabled (y/n)</Form.Label>
          <Form.Control
            type='text' placeholder='y/n' required pattern='y|n'
            value={flagX[modeEnabledKey] === 1 ? 'y' : 'n'}
            onChange={e => setFlagX({
              ...flagX, [modeEnabledKey]: e.target.value === 'y' ? 1 : 0
            })}
          />
        </Col>

        <Col md={8}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type='text' placeholder='Description'
            value={flagX.description}
            onChange={e => setFlagX({
              ...flagX, description: e.target.value
            })}
          />
        </Col>
      </Row>

      <Button type='submit' className='mt-3'>Save</Button>
    </Form>
  )
}
