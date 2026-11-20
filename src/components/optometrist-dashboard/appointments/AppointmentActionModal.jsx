import React from 'react'
import { useFormik } from 'formik'
import { Button, Form, Modal } from 'react-bootstrap'
import { OptometristAcceptEnquiryValidation, OptometristRejectEnquiryValidation } from '../../../commondata/formvalidations'

export default function AppointmentActionModal({
  show,
  mode,
  appointment,
  defaultLink,
  isSaving,
  onClose,
  onSubmit,
}) {
  const isAccept = mode === 'accept'
  const isComplete = mode === 'complete'
  const requiresLink = isAccept && appointment?.online

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      requires_link: requiresLink,
      meeting_link: defaultLink || appointment?.meetingLink || '',
      reason: '',
    },
    validationSchema: isComplete ? undefined : isAccept ? OptometristAcceptEnquiryValidation : OptometristRejectEnquiryValidation,
    onSubmit: (vals) => {
      if (!isAccept) {
        onSubmit({ reason: vals.reason.trim() })
        return
      }
      onSubmit({
        meeting_link: vals.meeting_link.trim(),
      })
    },
  })

  if (!appointment) return null

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
          {isComplete ? 'Mark as completed' : isAccept ? 'Accept enquiry' : 'Reject enquiry'}
        </Modal.Title>
      </Modal.Header>
      <Button onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body>
        <div className="px-3 py-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
          <div className="fw-semibold">{appointment.name}</div>
          <div className="text-muted small">{appointment.when}</div>
          {appointment.payment ? <div className="text-muted small mt-1">{appointment.payment}</div> : null}
          {appointment.slotNote ? <div className="text-muted small">{appointment.slotNote}</div> : null}
          {appointment.paidAt ? <div className="small mt-1">Paid on {appointment.paidAt}.</div> : null}
          {appointment.hold ? <div className="small mt-1">{appointment.hold}.</div> : null}
        </div>

        {isComplete ? (
          <Form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
            <p className="text-muted small mb-0">This accepted booking will be marked completed. The patient will see it as finished.</p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Mark as completed'}
              </Button>
            </div>
          </Form>
        ) : isAccept ? (
          <Form onSubmit={formik.handleSubmit}>
            {requiresLink ? (
              <Form.Group className="mb-3">
                <Form.Label>Meeting link <span className="required_icon">*</span></Form.Label>
                <Form.Control
                  type="url"
                  name="meeting_link"
                  placeholder="https://meet.example.com/..."
                  value={formik.values.meeting_link}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.meeting_link && formik.touched.meeting_link ? (
                  <p className="error mb-0 mt-1">{formik.errors.meeting_link}</p>
                ) : (
                  <p className="text-muted small mb-0 mt-1">Required when accepting an online consultation.</p>
                )}
              </Form.Group>
            ) : (
              <p className="text-muted small">This in-person enquiry will be confirmed. The patient will be notified.</p>
            )}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Accepting...' : 'Accept enquiry'}
              </Button>
            </div>
          </Form>
        ) : (
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Reason <span className="required_icon">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                placeholder="Tell the patient why this enquiry is rejected"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.reason && formik.touched.reason ? (
                <p className="error mb-0 mt-1">{formik.errors.reason}</p>
              ) : (
                <p className="text-muted small mb-0 mt-1">The slot stays on your calendar for other patients.</p>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
              <Button type="submit" variant="danger" disabled={isSaving}>
                {isSaving ? 'Rejecting...' : 'Reject enquiry'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}
