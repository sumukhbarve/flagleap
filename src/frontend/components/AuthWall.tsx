import React from 'react'

export const AuthWall: React.FC = function ({ children }) {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingBlock: 50 }}>
      {children}
    </div>
  )
}
