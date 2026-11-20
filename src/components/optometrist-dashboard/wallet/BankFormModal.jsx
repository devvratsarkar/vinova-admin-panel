import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useGetOptometristBankQuery } from '../../../redux/features/optometristAPIEndPoint'

const EMPTY = {
  bank_name: '',
  holder_name: '',
  account_number: '',
  swift: '',
  is_primary: false,
}

function fromBank(bank) {
  if (!bank) return EMPTY
  return {
    bank_name: bank.bank_name || '',
    holder_name: bank.holder_name || '',
    account_number: bank.account_number || '',
    swift: bank.swift || '',
    is_primary: Boolean(bank.is_primary),
  }
}

function text(value) {
  return value == null ? '' : String(value).trim()
}

export function bankPayload(values) {
  return {
    bank_name: text(values.bank_name),
    holder_name: text(values.holder_name),
    account_number: text(values.account_number).toUpperCase(),
    swift: text(values.swift).toUpperCase(),
    is_primary: Boolean(values.is_primary),
  }
}

export function bankErrors(values) {
  const errors = {}
  if (!values.bank_name.trim()) errors.bank_name = 'Bank name is required.'
  if (!values.holder_name.trim()) errors.holder_name = 'Account holder name is required.'
  const shaba = values.account_number.trim().toUpperCase()
  if (!shaba) errors.account_number = 'Shaba number is required.'
  else if (!/^IR\d{24}$/.test(shaba)) errors.account_number = 'Use IR followed by 24 digits.'
  const swift = values.swift.trim().toUpperCase()
  if (!swift) errors.swift = 'SWIFT code is required.'
  else if (!/^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(swift)) errors.swift = 'Use an 8 or 11 character SWIFT code.'
  return errors
}

function readBank(response, fallback) {
  const payload = response?.data
  if (!payload || Array.isArray(payload)) return fallback
  if (payload.bank && typeof payload.bank === 'object') return payload.bank
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data
  if (payload.bank_name || payload.account_number || payload.id || payload._id) return payload
  return fallback
}

export default function BankFormModal({ show, bank, isSaving, onClose, onSubmit }) {
  const bankId = bank?.id || bank?._id || ''
  const { data: bankResponse, isFetching } = useGetOptometristBankQuery(bankId, { skip: !show || !bankId })
  const current = readBank(bankResponse, bank)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const dirty = useRef(false)
  const isEdit = Boolean(bankId)

  useEffect(() => {
    if (!show) {
      dirty.current = false
      return
    }
    if (dirty.current) return
    setValues(fromBank(current))
    setErrors({})
  }, [show, current])

  const setField = (key, value) => {
    dirty.current = true
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const submit = (event) => {
    event.preventDefault()
    const next = bankErrors(values)
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit(bankPayload(values), bankId)
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
          {isEdit ? 'Edit bank' : 'Add bank'}
        </Modal.Title>
      </Modal.Header>
      <Button type="button" onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="" aria-label="Close">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Bank name <span className="required_icon">*</span></Form.Label>
            <Form.Control
              name="bank_name"
              value={values.bank_name}
              placeholder="Bank Melli"
              onChange={(event) => setField('bank_name', event.target.value)}
            />
            {errors.bank_name && <p className="error mb-0 mt-1">{errors.bank_name}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Account holder <span className="required_icon">*</span></Form.Label>
            <Form.Control
              name="holder_name"
              value={values.holder_name}
              placeholder="Dr Test Optometrist"
              onChange={(event) => setField('holder_name', event.target.value)}
            />
            {errors.holder_name && <p className="error mb-0 mt-1">{errors.holder_name}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Shaba number <span className="required_icon">*</span></Form.Label>
            <Form.Control
              name="account_number"
              value={values.account_number}
              placeholder="IR120170000000123456789001"
              onChange={(event) => setField('account_number', event.target.value.toUpperCase())}
            />
            {errors.account_number && <p className="error mb-0 mt-1">{errors.account_number}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>SWIFT <span className="required_icon">*</span></Form.Label>
            <Form.Control
              name="swift"
              value={values.swift}
              placeholder="BMJIIRTH"
              onChange={(event) => setField('swift', event.target.value.toUpperCase())}
            />
            {errors.swift && <p className="error mb-0 mt-1">{errors.swift}</p>}
          </Form.Group>
          <Form.Check
            type="checkbox"
            id="bank-is-primary"
            className="mb-4"
            label="Primary account for withdrawals"
            checked={values.is_primary}
            onChange={(event) => setField('is_primary', event.target.checked)}
          />
          <div className="d-flex justify-content-center gap-2">
            <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving || isFetching}>
              {isSaving ? 'Saving...' : isEdit ? 'Save bank' : 'Add bank'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
