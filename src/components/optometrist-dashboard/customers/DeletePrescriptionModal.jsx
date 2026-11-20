import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function DeletePrescriptionModal({ show, isSaving, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
          Delete prescription
        </Modal.Title>
      </Modal.Header>
      <Button onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body className="text-center">
        <p className="mb-0">Are you sure you want to delete this prescription?</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center border-0 pt-0">
        <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={isSaving}>
          {isSaving ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
