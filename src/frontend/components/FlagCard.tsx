import { _ } from 'monoduck'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import type { ZFlag } from '../../shared/z-models'
import { Link } from './Link'
import { FlagEnabledToggler } from './FlagEnabledToggler'

export const FlagCard: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  const style = {
    border: '1px solid slategray',
    borderRadius: 5,
    padding: 15
  } as const
  const lastTouchedAt = flag.updated_at > 0 ? flag.updated_at : flag.created_at
  return (
    <div style={style} className='mb-3'>
      <Row>
        <Col>
          <div className='large bold'>
            <Link to={{ id: 'flagEditor', flagId: flag.id }}>
              {flag.id}
            </Link>
          </div>
          <div className='gray small'>
            {_.bool(flag.description) ? <>{flag.description}<br /></> : ''}
            Updated: {new Date(lastTouchedAt).toUTCString()}
          </div>
        </Col>
        <Col>
          <div className='alignRight'>
            <FlagEnabledToggler flag={flag} />
          </div>
        </Col>
      </Row>
    </div>
  )
}
