import React from 'react'

export const Footer: React.VFC = function () {
  const style = {
    marginTop: 15,
    paddingTop: 10,
    borderTop: '1px solid slategray',
    color: 'gray',
    textAlign: 'right',
    // fontFamily: 'monospace',
    fontSize: 'x-small'
  } as const
  return (
    <footer style={style}>
      Made with &lt;3 &amp; chai.{' '}
      <a
        href='https://github.com/sumukhbarve/flagleap'
        target='_blank'
        style={{ color: 'gray', textDecoration: 'none' }} rel='noreferrer'
      >
        View source on GitHub.
      </a>
    </footer>
  )
}
