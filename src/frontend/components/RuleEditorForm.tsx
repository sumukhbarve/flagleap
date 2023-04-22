import React from 'react'
import { tapiduck } from 'monoduck'
import type { ZRule } from '../../shared/z-models'
import { zOperatorEnum } from '../../shared/z-models'
import { api } from '../../shared/endpoints'
import { store, useStore } from '../store'
import { Button, Form, Row, Col } from 'react-bootstrap'

interface RuleEditorFormProps {
  rule: ZRule
  close: () => void
}
export const RuleEditorForm: React.VFC<RuleEditorFormProps> = function (props) {
  const { rule, close } = props
  const [ruleX, setRuleX] = React.useState({ ...rule })
  const { isSpinning } = useStore('isSpinning')
  const onSubmit = async function (event: React.FormEvent): Promise<void> {
    event.preventDefault()
    if (isSpinning) { return undefined }
    store.spinnerText.set('Saving Rule ...')
    const resp = await tapiduck.fetch(api.internal.updateRule, {
      rule: ruleX, inapiToken: store.inapiToken.get()
    })
    store.spinnerText.set('')
    if (resp.status !== 'success') {
      return window.alert(tapiduck.failMsg(resp, data => data))
    }
    const updatedRule = resp.data;
    store.ruleMap.updateObjects([updatedRule])

    close()
  }
  const setPropX = function (k: keyof ZRule, v: ZRule[typeof k]): void {
    setRuleX({ ...ruleX, [k]: v })
  }
  return (
    <Form onSubmit={onSubmit}>
      <h5 className='mt-3'>Rank &amp; Description:</h5>{/* - - - - - - - - - - - - - - - */}
      <Row>
        <Col xs md={2}>
          <Form.Control
            type='number'
            value={ruleX.rank} min={0} step={1}
            onChange={evt => setPropX('rank', Number(evt.target.value))}
            disabled={isSpinning}
          />
          <Form.Text>Rank</Form.Text>
        </Col>

        <Col xs md={10}>
          <Form.Control
            type='text' placeholder='Description ...'
            value={ruleX.description}
            onChange={evt => setPropX('description', evt.target.value)}
            disabled={isSpinning}
          />
          <Form.Text>Description</Form.Text>
        </Col>
      </Row>

      {/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */}
      <h5 className='mt-3'>Rule Condition:</h5>
      <Row>
        <Col xs md={2}>
          <Form.Select
            value={ruleX.negated}
            onChange={evt => setPropX('negated', Number(evt.target.value))}
            disabled={isSpinning}
          >
            <option value={0}>If</option>
            <option value={1}>If not</option>
          </Form.Select>
          <Form.Text>condition type</Form.Text>
        </Col>

        <Col xs md={3}>
          <Form.Control
            type='text' placeholder='trait key (eg. user_id)'
            value={ruleX.lhs_operand_key}
            onChange={evt => setPropX('lhs_operand_key', evt.target.value)}
            disabled={isSpinning}
          />
          <Form.Text>trait key, eg: <i>user_id</i></Form.Text>
        </Col>

        <Col xs md={3}>
          <Form.Select
            value={ruleX.operator}
            onChange={function (evt) {
              setPropX('operator', zOperatorEnum.parse(evt.target.value))
            }}
            disabled={isSpinning}
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
            disabled={isSpinning}
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
            onChange={evt => setPropX('result_value', evt.target.value)}
            disabled={isSpinning}
          />
          <Form.Text>result value, served when condition is satisfied</Form.Text>
        </Col>
      </Row>

      <Form.Group className='mt-4'>
        <Button type='submit' variant='primary' disabled={isSpinning}>
          {!isSpinning ? 'Save' : 'Processing ...'}
        </Button> &nbsp;
        <Button variant='secondary' onClick={close}>Cancel</Button>
      </Form.Group>
    </Form>
  )
}
