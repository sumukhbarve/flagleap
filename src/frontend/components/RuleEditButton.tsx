import React from 'react'
import type { ZRule } from '../../shared/z-models'
import { Button, Modal } from 'react-bootstrap'
import { RuleEditorForm } from './RuleEditorForm'
import { getIdForRuleEditButton } from '../helpers'

export const RuleEditButton: React.VFC<{rule: ZRule}> = function ({ rule }) {
  const [show, setShow] = React.useState(false)
  const onHide = (): void => setShow(false)
  return (
    <>
      <Button
        id={getIdForRuleEditButton(rule.id)}
        variant='link' size='sm' onClick={() => setShow(true)}
      >
        Edit
      </Button>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Configure Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RuleEditorForm rule={rule} close={onHide} />
          <div className='mb-3' />
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  )
}
