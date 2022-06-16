import React from 'react'
import type { ZRule } from '../../shared/z-models'
import { _ } from 'monoduck'
import { RuleEditButton } from './RuleEditButton'
import { RuleDeleteButton } from './RuleDeleteButton'
import { Col, Row } from 'react-bootstrap'

const Codelet: React.VFC<{str: string}> = function ({ str }) {
  const style = {
    display: 'inline-block',
    padding: '2px 5px',
    margin: '2px 5px',
    border: '1px solid dimgray',
    borderRadius: 5,
    backgroundColor: 'darkgray',
    color: 'black',
    fontFamily: 'monospace'
  } as const
  return <span style={style}>{str === '' ? <i>(blank)</i> : str}</span>
}

export const RuleCard: React.VFC<{rule: ZRule}> = function ({ rule }) {
  const style = {
    border: '1px solid slategray',
    borderRadius: 5,
    padding: 15
  } as const
  return (
    <div className='mb-3' style={style}>
      <Row>
        <Col md={9}>
          If {_.bool(rule.negated) ? 'NOT' : ''}{' '}
          trait <Codelet str={rule.lhs_operand_key} />{' '}
          <Codelet str={rule.operator} />{' '}
          <Codelet str={rule.rhs_operand_value} />{' '}
          <div className='ps-3'>
            then serve <Codelet str={rule.result_value} />
          </div>
        </Col>
        <Col md={3} className='textAlignRight'>
          <RuleEditButton rule={rule} />{' '}
          <RuleDeleteButton ruleId={rule.id} />
        </Col>
      </Row>
    </div>
  )
}
