import React from 'react'
import type { ZRule } from '../../shared/z-models'
import { _ } from 'monoduck'
import { EditRuleButton } from './EditRuleButton'
import { DeleteRuleButton } from './DeleteRuleButton'

const Codelet: React.VFC<{str: string}> = function ({ str }) {
  return <code>{str === '' ? <i>(blank)</i> : str}</code>
}

export const RuleCard: React.VFC<{rule: ZRule}> = function ({ rule }) {
  return (
    <div className='mb-3'>
      Rank {rule.rank}:{' '}
      IF trait <Codelet str={rule.lhs_operand_key} />{' '}
      does/is {_.bool(rule.negated) ? 'NOT' : ''}{' '}
      <Codelet str={rule.operator} />{' '}
      than/to/with the value{' '}
      <Codelet str={rule.rhs_operand_value} />,{' '}
      THEN{' '}
      serve result value <Codelet str={rule.result_value} />{' '}
      <EditRuleButton rule={rule} />.{' '}
      <DeleteRuleButton ruleId={rule.id} />
      {/* <pre>{JSON.stringify(_.pick(rule,
        ['rank', 'lhs_operand_key', 'operator', 'rhs_operand_value',
        'negated', 'result_value']))}</pre>
      */}
    </div>
  )
}
