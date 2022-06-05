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
      In {mode.toUpperCase()} Mode &nbsp; | &nbsp;
      <small>(Click to toggle)</small>
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
      <Col>
        <ModeToggleButton />
      </Col>
    </>
  )
}

export const Header: React.VFC = function () {
  const loggedIn = store.use(store.loggedIn)
  const defaultRouteId = store.use(store.defaultRouteId)
  const style = {
    paddingBlock: 15, borderBottom: '1px solid lightgray', marginBottom: 15
  } as const
  return (
    <header style={style}>
      <Row>
        <Col>
          <h2><Link to={{ id: defaultRouteId }}>FlagLeap</Link></h2>
        </Col>
        {loggedIn ? <LoggedInNavCols /> : <LoggedOutNavCols />}
      </Row>
    </header>
  )
}
