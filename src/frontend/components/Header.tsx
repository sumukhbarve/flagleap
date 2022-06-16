import React from 'react'
import { Link } from './Link'
import * as store from '../store'
import { Row, Col, Button } from 'react-bootstrap'

const ModeToggleButton: React.VFC = function () {
  const mode = store.use(store.mode)
  const otherMode = mode === 'live' ? 'test' : 'live'
  const variant = mode === 'live' ? 'success' : 'warning'
  return (
    <Button variant={variant} onClick={() => store.mode.set(otherMode)}>
      In <samp><b>{mode}</b></samp> mode &nbsp;
      <span className='xxSmall'>. . . &nbsp; (Click to toggle)</span>
    </Button>
  )
}

const LoggedOutNavCols: React.VFC = function () {
  const routeId = store.useRouteInfo().id
  return (
    <>
      <Col>
        <Link to={{ id: 'login' }}>
          <Button variant={`${routeId !== 'login' ? 'outline-' : ''}primary`}>
            Login
          </Button>
        </Link>
      </Col>
      <Col>
        <Link to={{ id: 'setup' }}>
          <Button variant={`${routeId !== 'setup' ? 'outline-' : ''}primary`}>
            Setup
          </Button>
        </Link>
      </Col>
    </>
  )
}

const LoggedInNavCols: React.VFC = function () {
  return (
    <>
      <Col className='alignRight'>
        <ModeToggleButton />
      </Col>
    </>
  )
}

export const Header: React.VFC = function () {
  const loggedIn = store.use(store.loggedIn)
  const defaultRouteId = store.use(store.defaultRouteId)
  const style = {
    paddingBlock: 15, borderBottom: '1px solid slategray', marginBottom: 15
  } as const
  return (
    <header style={style}>
      <Row>
        <Col>
          <h3><Link to={{ id: defaultRouteId }}>FlagLeap</Link></h3>
        </Col>
        {loggedIn ? <LoggedInNavCols /> : <LoggedOutNavCols />}
      </Row>
    </header>
  )
}
