import React from 'react'
import { tapiduck } from 'monoduck'
import type { ZRule } from '../../shared/z-models'
import { zOperatorEnum } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import * as store from '../store'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'

export const EditRuleButton: React.VFC<{rule: ZRule}> = function ({ rule }) {
  const [show, setShow] = React.useState(false)
  const [ruleX, setRuleX] = React.useState({ ...rule })
  const onHide = function (): void {
    setShow(false)
    setRuleX({ ...rule })
  }
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    store.loadingMsg.set('Saving Rule ...')
    const updatedRule = await tapiduck.fetch(api.internal.updateRule, {
      rule: ruleX, inapiToken: store.inapiToken.get()
    })
    store.setRules([updatedRule])
    store.loadingMsg.set('')
    alert('Rule saved.')
    setShow(false)
  }
  return (
    <>
      <Button size='sm' onClick={() => setShow(true)}>Edit Rule</Button>
      <Modal show={show} onHide={onHide} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Edit Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Row className='mb-3'>

              <Col xs md={4}>
                <Form.Label>Rule rank:</Form.Label>
                <Form.Control
                  type='number'
                  value={ruleX.rank} min={0} step={1}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, rank: Number(evt.target.value) })
                  }}
                />
              </Col>

              <Col xs md={4}>
                <Form.Label>IF trait:</Form.Label>
                <Form.Control
                  type='text'
                  value={ruleX.lhs_operand_key}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, lhs_operand_key: evt.target.value })
                  }}
                />
              </Col>

              <Col xs md={4}>
                <Form.Label>not?</Form.Label>
                <Form.Select
                  value={ruleX.negated}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, negated: Number(evt.target.value) })
                  }}
                >
                  <option value={0}>is/does{/* not negated */}</option>
                  <option value={1}>is/does NOT{/* negated */}</option>
                </Form.Select>
              </Col>

              <Col xs md={4}>
                <Form.Label>what?</Form.Label>
                <Form.Select
                  value={ruleX.operator}
                  onChange={function (evt) {
                    setRuleX({
                      ...ruleX, operator: zOperatorEnum.parse(evt.target.value)
                    })
                  }}
                >
                  {zOperatorEnum.options.map(
                    op => <option value={op} key={op}>{op}</option>
                  )}
                </Form.Select>
              </Col>

              <Col xs md={4}>
                <Form.Label>than/to/with?</Form.Label>
                <Form.Control
                  type='text'
                  value={ruleX.rhs_operand_value}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, rhs_operand_value: evt.target.value })
                  }}
                />
              </Col>

              <Col xs md={4}>
                <Form.Label>THEN result:</Form.Label>
                <Form.Control
                  type='text'
                  value={ruleX.result_value}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, result_value: evt.target.value })
                  }}
                />
              </Col>
            </Row>

            <Form.Group className='mb-3'>
              <Button type='submit' variant='primary'>Save</Button>{' '}
              <Button variant='secondary' onClick={onHide}>Cancel</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <pre>ruleX:{JSON.stringify(ruleX, null, 4)}</pre> */}
        </Modal.Footer>
      </Modal>
    </>
  )
}
