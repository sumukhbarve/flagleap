import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { _, tapiduck } from 'monoduck'
import { store, useStore } from '../store'
import type { ZFlag } from '../../shared/z-models'
import { api } from '../../shared/endpoints'

export const FlagEditorForm: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  const [flagX, setFlagX] = React.useState({ ...flag })
  const { modeRing, spinnerText } = useStore('modeRing', 'spinnerText')
  const computeSaved = function (): boolean {
    return _.all([
      flagX.description === flag.description,
      // Note: otherModeRing.enabled is not considered here, on purpose.
      flagX[modeRing.enabled] === flag[modeRing.enabled]
    ])
  }
  const [isSaved, setIsSaved] = React.useState(computeSaved())
  React.useEffect(() => setIsSaved(computeSaved())) // On every render
  const isSaving = spinnerText !== ''
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.spinnerText.set('Saving Flag ...')
    const resp = await tapiduck.fetch(api.internal.updateFlag, {
      inapiToken: store.inapiToken.get(),
      flag: {
        id: flag.id,
        [modeRing.enabled]: flagX[modeRing.enabled],
        description: flagX.description
      }
    })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const updatedFlag = resp.data
    store.flagMap.updateObjects([updatedFlag])
  }
  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Col md={3} className=''>
          <Form.Group>
            <Button
              variant='secondary' onClick={() => {
                setFlagX({
                  ...flagX,
                  [modeRing.enabled]: Number(_.not(flagX[modeRing.enabled]))
                })
              }}
            >
              <Form.Check
                type='switch'
                checked={flagX[modeRing.enabled] === 1}
                onChange={evt => setFlagX({
                  ...flagX, [modeRing.enabled]: Number(evt.target.checked)
                })}
                inline
              />
              <span style={{ minWidth: 30, display: 'inline-block' }}>
                {_.bool(flagX[modeRing.enabled]) ? 'ON' : 'OFF'}
              </span>
            </Button>
            <br />
            <Form.Text>Status</Form.Text>

          </Form.Group>
        </Col>

        <Col md={7}>
          <Form.Group>
            <Form.Control
              type='text'
              placeholder='Description'
              value={flagX.description}
              onChange={evt => setFlagX({
                ...flagX, description: evt.target.value
              })}
            />
            <Form.Text>Description</Form.Text>
          </Form.Group>
        </Col>

        <Col md={2} className='textAlignRight'>
          <Button
            type='submit'
            variant={isSaved ? 'secondary' : 'primary'}
            disabled={isSaved || isSaving}
          >
            <span style={{ display: 'inline-block', minWidth: 45 }}>
              {isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save'}
            </span>
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
