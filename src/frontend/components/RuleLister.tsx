import React from 'react'
import { _ } from 'monoduck'
import { RuleCard } from './RuleCard'
import { RuleCreateButton } from './RuleCreateButton'
import { Col, Row } from 'react-bootstrap'
import type { ZRule, ZFlag } from '../../shared/z-models'

interface RuleListerProps {
  rules: ZRule[]
  flag: ZFlag
}
export const RuleLister: React.VFC<RuleListerProps> = function ({ rules, flag }) {
  return (
    <div>
      <Row>
        <Col>
          <h3>Rules</h3>
        </Col>
        <Col className='textAlignRight'>
          <RuleCreateButton
            flagId={flag.id}
            newRank={Math.max(...[0, ..._.map(rules, r => r.rank)]) + 10}
          />
        </Col>
      </Row>
      <div className='mb-2' />
      {rules.map(
        rule => <RuleCard rule={rule} key={JSON.stringify(rule)} />
      )}
      {rules.length === 0 && <div>This flag has no rules in this mode.</div>}
    </div>
  )
}
