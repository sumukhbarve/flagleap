import React from 'react'
import type { RouteInfo } from 'monoduck'
import { RoqsLink } from '../store'

interface LinkProps {
  to: RouteInfo
  style?: React.CSSProperties
}
export const Link: React.FC<LinkProps> = function (props) {
  const { to, style, children } = props
  return (
    <RoqsLink to={to}>
      <span style={{ color: 'navy', borderBottom: '2px solid blue', ...style }}>
        {children}
      </span>
    </RoqsLink>
  )
}
