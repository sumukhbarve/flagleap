import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { _, tapiduck } from 'monoduck'
import { store } from '../store'
import type { ZFlag } from '../../shared/z-models'
import { api } from '../../shared/endpoints'

export const FlagEditorForm: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  const [flagX, setFlagX] = React.useState({ ...flag })
  const modeRing = store.use(store.modeRing)
  const computeSaved = function (): boolean {
    return _.all([
      flagX.description === flag.description,
      // Note: otherModeRing.enabled is not considered here, on purpose.
      flagX[modeRing.enabled] === flag[modeRing.enabled]
    ])
  }
  const [saved, setSaved] = React.useState(computeSaved())
  React.useEffect(() => setSaved(computeSaved())) // On every render
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.loadingMsg.set('Saving Flag ...')
    const updatedFlag = await tapiduck.fetch(api.internal.updateFlag, {
      inapiToken: store.inapiToken.get(),
      flag: {
        id: flag.id,
        [modeRing.enabled]: flagX[modeRing.enabled],
        description: flagX.description
      }
    })
    store.flagMap.updateObjects([updatedFlag])
    store.loadingMsg.set('')
    alert('Flag saved.')
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
            variant={saved ? 'secondary' : 'primary'}
            disabled={saved}
          >
            <span style={{ display: 'inline-block', minWidth: 45 }}>
              Save{saved ? 'd' : ''}
            </span>
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
