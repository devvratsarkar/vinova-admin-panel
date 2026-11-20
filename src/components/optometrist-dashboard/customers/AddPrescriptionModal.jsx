import React, { useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { OptometristPrescriptionValidation } from '../../../commondata/formvalidations'

const MAX_YEARS = 2

const isZeroPower = (value) => !value || value === '0' || value === '0.00'

const signedPower = (value) => (value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2))

const SPH_OPTIONS = Array.from({ length: 121 }, (_, index) => signedPower(12 - index * 0.25))
const CYL_OPTIONS = Array.from({ length: 25 }, (_, index) => signedPower(0 - index * 0.25))
const ADD_OPTIONS = Array.from({ length: 17 }, (_, index) => signedPower(index * 0.25))
const AXIS_OPTIONS = Array.from({ length: 180 }, (_, index) => String(index + 1))

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addYears(date, years) {
  if (!date) return ''
  const next = new Date(`${date}T00:00:00`)
  next.setFullYear(next.getFullYear() + years)
  return next.toISOString().slice(0, 10)
}

function toInputDate(value) {
  const raw = String(value || '').slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const [day, month, year] = raw.split('/')
  return day && month && year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : ''
}

function toPowerOption(value, options, fallback) {
  if (value == null || String(value).trim() === '') return fallback
  const parsed = Number.parseFloat(String(value).trim().replace(/^\+/, ''))
  if (Number.isNaN(parsed)) return fallback
  const signed = parsed > 0 ? `+${parsed.toFixed(2)}` : parsed.toFixed(2)
  return options.includes(signed) ? signed : fallback
}

function toAxisOption(value) {
  const parsed = Number.parseInt(String(value ?? '').replace(/[^\d]/g, ''), 10)
  if (!parsed || parsed < 1 || parsed > 180) return '0'
  return String(parsed)
}

function valuesFromPrescription(prescription, isUpload) {
  const manual = prescription.manual || {}
  const source = manual.prescription || (manual.right_eye_od ? manual : null) || prescription.prescription_obj || {}
  const pdBlock = manual.pupillary_distance || prescription.prescription_obj?.pupillary_distance || {}
  const pdValues = pdBlock.values || {}
  const issued = toInputDate(prescription.date_of_prescription) || todayISO()
  return {
    source: isUpload ? 'uploaded' : 'created',
    issued_at: issued,
    valid_until: toInputDate(prescription.valid_until) || addYears(issued, MAX_YEARS),
    doctor_name: prescription.doctor_name || '',
    notes: prescription.notes || '',
    add: toPowerOption(source.add, ADD_OPTIONS, '0.00'),
    countPd: String(pdBlock.number_of_values || (pdValues.pd_value_2 ? '2' : '1')),
    pd_value_1: pdValues.pd_value_1 == null ? '' : String(pdValues.pd_value_1),
    pd_value_2: pdValues.pd_value_2 == null ? '' : String(pdValues.pd_value_2),
    file: null,
    right_eye_od: {
      sph: toPowerOption(source.right_eye_od?.sph, SPH_OPTIONS, '0.00'),
      cyl: toPowerOption(source.right_eye_od?.cyl, CYL_OPTIONS, '0.00'),
      axis: toAxisOption(source.right_eye_od?.axis),
    },
    left_eye_os: {
      sph: toPowerOption(source.left_eye_os?.sph, SPH_OPTIONS, '0.00'),
      cyl: toPowerOption(source.left_eye_os?.cyl, CYL_OPTIONS, '0.00'),
      axis: toAxisOption(source.left_eye_os?.axis),
    },
  }
}

function EyeFields({ prefix, label, values, errors, touched, setFieldValue, onBlur }) {
  const eye = values[prefix]
  const axisDisabled = isZeroPower(eye.cyl)

  const setEyeField = (field, value) => {
    setFieldValue(`${prefix}.${field}`, value)
    if (field === 'cyl' && isZeroPower(value)) setFieldValue(`${prefix}.axis`, '0')
  }

  return (
    <div className="p-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
      <div className="fw-semibold mb-3">{label}</div>
      <Row>
        <Form.Group as={Col} xs={4} className="mb-0">
          <Form.Label className="text-uppercase small text-muted">Eye score (SPH)</Form.Label>
          <Form.Select name={`${prefix}.sph`} value={eye.sph} onChange={(event) => setEyeField('sph', event.target.value)} onBlur={onBlur}>
            {SPH_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </Form.Select>
          {errors[prefix]?.sph && touched[prefix]?.sph ? <p className="error mb-0 mt-1">{errors[prefix].sph}</p> : null}
        </Form.Group>
        <Form.Group as={Col} xs={4} className="mb-0">
          <Form.Label className="text-uppercase small text-muted">Cylinder (CYL)</Form.Label>
          <Form.Select name={`${prefix}.cyl`} value={eye.cyl} onChange={(event) => setEyeField('cyl', event.target.value)} onBlur={onBlur}>
            {CYL_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </Form.Select>
          {errors[prefix]?.cyl && touched[prefix]?.cyl ? <p className="error mb-0 mt-1">{errors[prefix].cyl}</p> : null}
        </Form.Group>
        <Form.Group as={Col} xs={4} className="mb-0">
          <Form.Label className="text-uppercase small text-muted">Axis (AXIS)</Form.Label>
          <Form.Select
            name={`${prefix}.axis`}
            value={axisDisabled ? '0' : eye.axis}
            onChange={(event) => setEyeField('axis', event.target.value)}
            onBlur={onBlur}
            disabled={axisDisabled}
          >
            <option value="0">None</option>
            {AXIS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </Form.Select>
          {errors[prefix]?.axis && touched[prefix]?.axis ? <p className="error mb-0 mt-1">{errors[prefix].axis}</p> : null}
        </Form.Group>
      </Row>
    </div>
  )
}

export default function AddPrescriptionModal({ show, mode, customer, prescription, isSaving, onClose, onSubmit }) {
  const isUpload = mode === 'upload'
  const isEditing = Boolean(prescription)
  const issuedDefault = useMemo(() => todayISO(), [])
  const initialValues = useMemo(() => {
    if (prescription) return valuesFromPrescription(prescription, isUpload)
    return {
      source: isUpload ? 'uploaded' : 'created',
      issued_at: issuedDefault,
      valid_until: addYears(issuedDefault, MAX_YEARS),
      doctor_name: '',
      notes: '',
      add: '0.00',
      countPd: '1',
      pd_value_1: '',
      pd_value_2: '',
      file: null,
      right_eye_od: { sph: '0.00', cyl: '0.00', axis: '0' },
      left_eye_os: { sph: '0.00', cyl: '0.00', axis: '0' },
    }
  }, [isUpload, issuedDefault, prescription])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: OptometristPrescriptionValidation,
    onSubmit: (vals) => {
      onSubmit({
        id: prescription?._id || prescription?.id || '',
        customer_id: customer?.id,
        source: vals.source,
        issued_at: vals.issued_at,
        valid_until: vals.valid_until,
        doctor_name: vals.doctor_name.trim(),
        notes: vals.notes.trim(),
        add: vals.add.trim(),
        countPd: vals.countPd,
        pd_value_1: vals.pd_value_1.trim(),
        pd_value_2: vals.pd_value_2.trim(),
        right_eye_od: vals.right_eye_od,
        left_eye_os: vals.left_eye_os,
        file: vals.file,
      })
    },
  })

  useEffect(() => {
    if (isZeroPower(formik.values.right_eye_od.cyl) && formik.values.right_eye_od.axis !== '0') {
      formik.setFieldValue('right_eye_od.axis', '0')
    }
    if (isZeroPower(formik.values.left_eye_os.cyl) && formik.values.left_eye_os.axis !== '0') {
      formik.setFieldValue('left_eye_os.axis', '0')
    }
  }, [formik.values.right_eye_od.cyl, formik.values.right_eye_od.axis, formik.values.left_eye_os.cyl, formik.values.left_eye_os.axis, formik.setFieldValue])

  if (!customer) return null

  return (
    <Modal show={show} onHide={onClose} centered scrollable size="lg">
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
          {isUpload ? (isEditing ? 'Reupload prescription' : 'Upload prescription') : (isEditing ? 'Edit prescription' : 'Create prescription')}
        </Modal.Title>
      </Modal.Header>
      <Button onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body>
        <div className="px-3 py-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
          <div className="fw-semibold">{customer.name}</div>
          <div className="text-muted small">{[customer.email, customer.phone].filter(Boolean).join(' · ')}</div>
        </div>
        <p className="text-muted small mb-3">
          {isUpload
            ? (isEditing
              ? 'Replace the file on this prescription. The dates and notes below stay with the updated file.'
              : 'Upload an existing prescription from outside the network or from a previous visit. It is stored on this customer’s profile.')
            : (isEditing
              ? 'Update this prescription on the customer’s profile. Checkout can later suggest a valid one (maximum 2 years).'
              : 'Create and save the prescription on this customer’s profile. Checkout can later suggest a valid one (maximum 2 years).')}
        </p>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label>Issued on <span className="required_icon">*</span></Form.Label>
              <Form.Control
                type="date"
                name="issued_at"
                max={todayISO()}
                value={formik.values.issued_at}
                onChange={(event) => {
                  const issued = event.target.value
                  formik.setFieldValue('issued_at', issued)
                  formik.setFieldValue('valid_until', addYears(issued, MAX_YEARS))
                }}
                onBlur={formik.handleBlur}
              />
              {formik.errors.issued_at && formik.touched.issued_at ? <p className="error mb-0 mt-1">{formik.errors.issued_at}</p> : null}
            </Form.Group>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label>Valid until <span className="required_icon">*</span></Form.Label>
              <Form.Control
                type="date"
                name="valid_until"
                min={formik.values.issued_at || undefined}
                max={addYears(formik.values.issued_at, MAX_YEARS) || undefined}
                value={formik.values.valid_until}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.valid_until && formik.touched.valid_until ? (
                <p className="error mb-0 mt-1">{formik.errors.valid_until}</p>
              ) : (
                <p className="text-muted small mb-0 mt-1">Maximum 2 years from the issue date.</p>
              )}
            </Form.Group>
          </Row>
          {!isUpload && (
            <Form.Group className="mb-3">
              <Form.Label>Doctor name <span className="required_icon">*</span></Form.Label>
              <Form.Control
                type="text"
                name="doctor_name"
                placeholder="Dr Smith"
                value={formik.values.doctor_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.doctor_name && formik.touched.doctor_name ? (
                <p className="error mb-0 mt-1">{formik.errors.doctor_name}</p>
              ) : null}
            </Form.Group>
          )}

          {isUpload ? (
            <Form.Group className="mb-3">
              <Form.Label>{isEditing ? 'Replacement file' : 'Prescription file'} <span className="required_icon">*</span></Form.Label>
              {isEditing && prescription?.file ? (
                <div className="small mb-2">
                  Current file: <a href={prescription.file} target="_blank" rel="noopener noreferrer">View file</a>
                </div>
              ) : null}
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(event) => formik.setFieldValue('file', event.target.files?.[0] || null)}
                onBlur={() => formik.setFieldTouched('file', true)}
              />
              {formik.errors.file && formik.touched.file ? <p className="error mb-0 mt-1">{formik.errors.file}</p> : null}
            </Form.Group>
          ) : (
            <>
              <EyeFields
                prefix="right_eye_od"
                label="Right eye (OD)"
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                onBlur={formik.handleBlur}
              />
              <EyeFields
                prefix="left_eye_os"
                label="Left eye (OS)"
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                onBlur={formik.handleBlur}
              />
              <Form.Group className="mb-3">
                <Form.Label>Add</Form.Label>
                <Form.Select name="add" value={formik.values.add} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                  {ADD_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </Form.Select>
                {formik.errors.add && formik.touched.add ? <p className="error mb-0 mt-1">{formik.errors.add}</p> : null}
              </Form.Group>
              <div className="p-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                <Form.Label className="fw-semibold">Pupillary distance</Form.Label>
                <Form.Check
                  type="checkbox"
                  id="countPd"
                  className="mb-3"
                  label="I have 2 Pupillary Distance numbers"
                  checked={formik.values.countPd === '2'}
                  onChange={(event) => {
                    formik.setFieldValue('countPd', event.target.checked ? '2' : '1')
                    if (!event.target.checked) formik.setFieldValue('pd_value_2', '')
                  }}
                />
                {formik.values.countPd === '1' ? (
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name="pd_value_1"
                      placeholder="Enter PD value"
                      value={formik.values.pd_value_1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.pd_value_1 && formik.touched.pd_value_1 ? (
                      <p className="error mb-0 mt-1">{formik.errors.pd_value_1}</p>
                    ) : null}
                  </Form.Group>
                ) : (
                  <Row>
                    <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                      <Form.Label>Left</Form.Label>
                      <Form.Control
                        type="text"
                        name="pd_value_1"
                        placeholder="Left"
                        value={formik.values.pd_value_1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.pd_value_1 && formik.touched.pd_value_1 ? (
                        <p className="error mb-0 mt-1">{formik.errors.pd_value_1}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Right</Form.Label>
                      <Form.Control
                        type="text"
                        name="pd_value_2"
                        placeholder="Right"
                        value={formik.values.pd_value_2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.pd_value_2 && formik.touched.pd_value_2 ? (
                        <p className="error mb-0 mt-1">{formik.errors.pd_value_2}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                )}
              </div>
            </>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              placeholder="Optional notes for checkout or follow-up"
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : isUpload ? (isEditing ? 'Reupload prescription' : 'Upload prescription') : (isEditing ? 'Save changes' : 'Save prescription')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
