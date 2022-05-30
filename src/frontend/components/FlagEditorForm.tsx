import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { tapiduck } from 'monoduck'
import * as store from '../store'
import type { ZFlag } from '../../shared/z-models'
import { api } from '../../shared/endpoints'

export const FlagEditorForm: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  // const flag = store.use(store.currentFlag) as ZFlag
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
          <Form.Label>Enabled</Form.Label>
          <Form.Select
            value={flagX[modeEnabledKey]}
            onChange={evt => setFlagX({
              ...flagX, [modeEnabledKey]: Number(evt.target.value)
            })}
          >
            <option value={0}>False</option>
            <option value={1}>True</option>
          </Form.Select>
        </Col>

        <Col md={8}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type='text' placeholder='Description'
            value={flagX.description}
            onChange={evt => setFlagX({
              ...flagX, description: evt.target.value
            })}
          />
        </Col>

        <Col md={2}>
          <Form.Label>Archived</Form.Label>
          <Form.Select
            value={flagX.archived}
            onChange={evt => setFlagX({
              ...flagX, archived: Number(evt.target.value)
            })}
          >
            <option value={0}>False</option>
            <option value={1}>True</option>
          </Form.Select>
        </Col>
      </Row>

      <Button type='submit' className='mt-3 mb-3'>Save</Button>
      {/* <pre>flagX: {JSON.stringify(flagX, null, 4)}</pre> */}
    </Form>
  )
}
