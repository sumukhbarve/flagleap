import React from 'react'
import { _, tapiduck } from 'monoduck'
import type { ZRule } from '../../shared/z-models'
import { zOperatorEnum, zOperandTypeEnum } from '../../shared/z-models'
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
            <h5 className='mt-3'>Rank &amp; Description:</h5>{/* - - - - - - - - - - - - - - - */}
            <Row>
              <Col xs md={2}>
                <Form.Control
                  type='number'
                  value={ruleX.rank} min={0} step={1}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, rank: Number(evt.target.value) })
                  }}
                />
                <Form.Text>Rank</Form.Text>
              </Col>

              <Col xs md={10}>
                <Form.Control
                  type='text' placeholder='Description ...'
                  value={ruleX.description}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, description: evt.target.value })
                  }}

                />
                <Form.Text>Description</Form.Text>
              </Col>
            </Row>

            {/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */}
            <h5 className='mt-3'>Rule Condition:</h5>
            <Row>
              <Col xs md={2}>
                <Form.Select
                  value={`${ruleX.negated},${ruleX.operand_type}`}
                  onChange={function (evt) {
                    const [negatedStr, operandType] = evt.target.value.split(',')
                    setRuleX({
                      ...ruleX,
                      negated: Number(negatedStr === '1'),
                      operand_type: zOperandTypeEnum.parse(operandType)
                    })
                  }}
                >
                  {zOperandTypeEnum.options.map(operandType => (
                    <React.Fragment key={operandType}>
                      {[0, 1].map(negated => (
                        <option value={`${negated},${operandType}`} key={`${negated},${operandType}`}>
                          if {_.bool(negated) ? 'not' : ''} ({operandType})
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </Form.Select>
                <Form.Text>condition type</Form.Text>
              </Col>

              <Col xs md={4}>
                <Form.Control
                  type='text' placeholder='trait key (eg. user_id)'
                  value={ruleX.lhs_operand_key}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, lhs_operand_key: evt.target.value })
                  }}
                />
                <Form.Text>trait key, eg: <i>user_id</i></Form.Text>
              </Col>

              <Col xs md={2}>
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
                <Form.Text>operator, eg: <i>$endswith</i></Form.Text>
              </Col>

              <Col xs md={4}>
                <Form.Control
                  type='text'
                  value={ruleX.rhs_operand_value}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, rhs_operand_value: evt.target.value })
                  }}
                />
                <Form.Text>operand value, eg: <i>123</i></Form.Text>
              </Col>
            </Row>

            {/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */}
            <h5 className='mt-3'>Rule Result:</h5>
            <Row>
              <Col xs md={12}>
                <Form.Control
                  type='text'
                  value={ruleX.result_value}
                  onChange={function (evt) {
                    setRuleX({ ...ruleX, result_value: evt.target.value })
                  }}
                />
                <Form.Text>result value, served when condition is satisfied</Form.Text>
              </Col>
            </Row>

            <Form.Group className='mt-3'>
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
