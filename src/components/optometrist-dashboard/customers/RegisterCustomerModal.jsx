import React from 'react'
import { useFormik } from 'formik'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { OptometristRegisterCustomerValidation } from '../../../commondata/formvalidations'

export default function RegisterCustomerModal({ show, isSaving, onClose, onSubmit }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { name: '', email: '', phone_number: '' },
    validationSchema: OptometristRegisterCustomerValidation,
    onSubmit: (vals) => {
      onSubmit({
        name: vals.name.trim(),
        email: vals.email.trim(),
        phone_number: vals.phone_number.trim(),
      })
    },
  })

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
          Register customer
        </Modal.Title>
      </Modal.Header>
      <Button onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body>
        <p className="text-muted small mb-3">
          A customer must be registered before you can create or upload a prescription.
        </p>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full name <span className="required_icon">*</span></Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter customer name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && formik.touched.name ? <p className="error mb-0 mt-1">{formik.errors.name}</p> : null}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone <span className="required_icon">*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text>+98</InputGroup.Text>
              <Form.Control
                type="text"
                name="phone_number"
                placeholder="912xxxxxxx"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </InputGroup>
            {formik.errors.phone_number && formik.touched.phone_number ? (
              <p className="error mb-0 mt-1">{formik.errors.phone_number}</p>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email ? <p className="error mb-0 mt-1">{formik.errors.email}</p> : null}
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Register customer'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
