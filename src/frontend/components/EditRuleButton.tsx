import React from 'react'
import type { ZRule } from '../../shared/z-models'
import { Button, Modal } from 'react-bootstrap'
import { RuleEditorForm } from './RuleEditorForm'

export const EditRuleButton: React.VFC<{rule: ZRule}> = function ({ rule }) {
  const [show, setShow] = React.useState(false)
  const onHide = (): void => setShow(false)
  return (
    <>
      <Button size='sm' onClick={() => setShow(true)}>Edit Rule</Button>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Edit Rule</Modal.Title>
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
