import React from 'react'
import type { ZFlag } from '../../shared/z-models'
import { Link } from './Link'

export const FlagCard: React.VFC<{flag: ZFlag}> = function ({ flag }) {
  return (
    <div className='mb-3'>
      <h4>
        <Link to={{ id: 'flagEditor', flagId: flag.id }}>
          {flag.id}
        </Link>
      </h4>
    </div>
  )
}
