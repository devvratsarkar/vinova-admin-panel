import React from 'react'
import { useFormik } from 'formik'
import { Button, Form, Modal } from 'react-bootstrap'
import { OptometristServiceFormValidation } from '../../../commondata/formvalidations'

export const VISIT_OPTIONS = [
  { value: 'in_person', label: 'In-person' },
  { value: 'online', label: 'Online' },
  { value: 'both', label: 'In-person or online' },
]

export function needsMeetingLink(visit) {
  return visit === 'online' || visit === 'both'
}

export default function AddEditServiceModal({ show, mode, service, onClose, onSubmit }) {
  const isEdit = mode === 'edit'
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      label: service?.label || '',
      description: service?.description || '',
      visit: service?.visit || 'in_person',
      meeting_link: service?.meeting_link || '',
    },
    validationSchema: OptometristServiceFormValidation,
    onSubmit: (vals) => {
      onSubmit({
        id: service?.id,
        label: vals.label.trim(),
        description: vals.description.trim(),
        visit: vals.visit,
        meeting_link: needsMeetingLink(vals.visit) ? vals.meeting_link.trim() : '',
        status: service?.status !== false,
      })
    },
  })

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
          {isEdit ? 'Edit service' : 'Add service'}
        </Modal.Title>
      </Modal.Header>
      <Button onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Service name <span className="required_icon">*</span></Form.Label>
            <Form.Control
              type="text"
              name="label"
              placeholder="e.g. Contact lens fitting"
              value={formik.values.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.label && formik.touched.label ? <p className="error mb-0 mt-1">{formik.errors.label}</p> : null}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              placeholder="What patients can book"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Visit type <span className="required_icon">*</span></Form.Label>
            <Form.Select name="visit" value={formik.values.visit} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {VISIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
            {formik.errors.visit && formik.touched.visit ? <p className="error mb-0 mt-1">{formik.errors.visit}</p> : null}
          </Form.Group>
          {needsMeetingLink(formik.values.visit) && (
            <Form.Group className="mb-3">
              <Form.Label>Meeting link <span className="required_icon">*</span></Form.Label>
              <Form.Control
                type="url"
                name="meeting_link"
                placeholder="https://meet.example.com/your-room"
                value={formik.values.meeting_link}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Form.Text className="text-muted">
                Required when you accept an online enquiry. This default is pre-filled on accept.
              </Form.Text>
              {formik.errors.meeting_link && formik.touched.meeting_link ? (
                <p className="error mb-0 mt-1">{formik.errors.meeting_link}</p>
              ) : null}
            </Form.Group>
          )}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="light" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">{isEdit ? 'Update service' : 'Add service'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
