import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import moment from 'moment'
import toast from 'react-hot-toast'
import { useUpdateAdminOptometristWithdrawalMutation } from '../../../redux/features/optometristEnquiryAPIEndPoint'
import { API_BASE_URL } from '../../../utils/config'

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 14, background: '#fff' }
const STATUS_STYLE = {
  Pending: { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' },
  Completed: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  Rejected: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
  Cancelled: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' },
}

function person(row) {
  const candidate = [row?.user, row?.optometrist].find((item) => item && typeof item === 'object')
  return candidate || {}
}

function bankOf(row) {
  return row?.bank && typeof row.bank === 'object' ? row.bank : {}
}

function money(row) {
  const amount = Number(row?.amount)
  const value = Number.isFinite(amount) ? amount.toLocaleString('en-US') : (row?.amount ?? '—')
  return [row?.currency_symbol, value].filter(Boolean).join(' ')
}

function initials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '—'
}

function fileHref(src) {
  const path = typeof src === 'string' ? src : src?.url || src?.path || ''
  if (!path) return ''
  if (/^(https?:|blob:|data:)/i.test(path)) return path
  const origin = String(API_BASE_URL || '').replace(/\/api\/[^/]+\/?$/i, '')
  return `${origin.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function Fact({ label, value, wide }) {
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <div className="text-muted" style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div className="fw-semibold mt-1" style={{ wordBreak: 'break-all' }}>{value || '—'}</div>
    </div>
  )
}

function Choice({ active, tone, onClick, children }) {
  const selected = tone === 'danger'
    ? { borderColor: '#fecaca', background: '#fef2f2', color: '#b91c1c' }
    : { borderColor: '#bfdbfe', background: '#eff6ff', color: '#1d4ed8' }
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        borderRadius: 10,
        border: '1px solid #e8edf3',
        background: '#fff',
        color: '#475569',
        padding: '10px 12px',
        fontWeight: 600,
        cursor: 'pointer',
        ...(active ? selected : {}),
      }}
    >
      {children}
    </button>
  )
}

export default function WithdrawalReviewModal({ row, onClose }) {
  const [updateWithdrawal, { isLoading }] = useUpdateAdminOptometristWithdrawalMutation()
  const [status, setStatus] = useState('Completed')
  const [transactionId, setTransactionId] = useState('')
  const [reason, setReason] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const account = person(row)
  const bank = bankOf(row)
  const pending = String(row?.status || '').toLowerCase() === 'pending'
  const name = account.name || row?.optometrist_name || row?.name || '—'
  const contact = [account.phone_number, account.email].filter(Boolean).join(' · ')
  const when = row?.createdAt && moment(row.createdAt).isValid() ? moment(row.createdAt).format('D MMM YYYY, h:mm A') : ''
  const statusStyle = STATUS_STYLE[row?.status] || STATUS_STYLE.Pending

  const copy = async (value, key) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      toast.error('Could not copy')
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'Rejected' && !reason.trim()) {
      setError('Reason is required.')
      return
    }
    const formData = new FormData()
    formData.append('status', status)
    if (status === 'Completed' && transactionId.trim()) formData.append('transaction_id', transactionId.trim())
    if (reason.trim()) formData.append('reason', reason.trim())
    if (status === 'Completed' && file) formData.append('file', file)
    setError('')
    const result = await updateWithdrawal({ id: row?.id ?? row?._id, formData })
    const body = result?.data
    if (!(body?.success === true || body?.http_status_code === 200)) return
    toast.success(body?.message || (status === 'Rejected' ? 'Withdrawal rejected' : 'Withdrawal completed'))
    onClose()
  }

  return (
    <Modal show={Boolean(row)} onHide={onClose} centered scrollable style={{ '--bs-modal-width': '640px' }}>
      <Modal.Header closeButton className="px-4 py-3" style={{ borderBottom: '1px solid #eef2f7' }}>
        <Modal.Title as="h4" className="fw-semibold mb-0" style={{ fontSize: '1.15rem' }}>
          {pending ? 'Review withdrawal' : 'Withdrawal'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-4">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="d-flex gap-3">
            <span className="d-flex align-items-center justify-content-center fw-semibold flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', color: '#3b82f6' }}>
              {initials(name)}
            </span>
            <div>
              <div className="fw-semibold">{name}</div>
              {contact && <div className="text-muted small">{contact}</div>}
              {when && <div className="text-muted small">{when}</div>}
            </div>
          </div>
          <div className="text-end">
            <div className="fw-semibold" style={{ fontSize: '1.35rem', letterSpacing: '-0.03em' }}>{money(row)}</div>
            {row?.status && (
              <span className="d-inline-block mt-1 px-2 py-1 fw-semibold" style={{ fontSize: 12, borderRadius: 999, ...statusStyle }}>
                {row.status}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 12 }}>
          <div className="text-muted mb-3" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Payout account</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
            <Fact label="Bank" value={bank.bank_name} />
            <Fact label="Account holder" value={bank.holder_name} />
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="text-muted" style={{ fontSize: 12, fontWeight: 600 }}>Shaba number</div>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="fw-semibold" style={{ wordBreak: 'break-all' }}>{bank.account_number || '—'}</span>
                {bank.account_number && (
                  <button type="button" className="btn btn-link p-0 small fw-semibold text-decoration-none flex-shrink-0" onClick={() => copy(bank.account_number, 'shaba')}>
                    {copied === 'shaba' ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
            <Fact label="SWIFT" value={bank.swift} />
            <div>
              <div className="text-muted" style={{ fontSize: 12, fontWeight: 600 }}>Reference</div>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="fw-semibold">{row?.reference_id || '—'}</span>
                {row?.reference_id && (
                  <button type="button" className="btn btn-link p-0 small fw-semibold text-decoration-none" onClick={() => copy(row.reference_id, 'reference')}>
                    {copied === 'reference' ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>
          {(row?.transaction_id || row?.reason || fileHref(row?.file)) && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e8edf3', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
              {row?.transaction_id && <Fact label="Transaction ID" value={row.transaction_id} />}
              {row?.reason && <Fact label="Reason" value={row.reason} wide />}
              {fileHref(row?.file) && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="text-muted" style={{ fontSize: 12, fontWeight: 600 }}>Payment proof</div>
                  <a className="fw-semibold d-inline-block mt-1 text-decoration-none" href={fileHref(row.file)} target="_blank" rel="noreferrer">
                    View file
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {pending && (
          <Form className="mt-4" id="withdrawal-review-form" onSubmit={submit}>
            <div className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Decision</div>
            <div className="d-flex gap-2 mb-3">
              <Choice active={status === 'Completed'} onClick={() => { setStatus('Completed'); setError('') }}>Mark completed</Choice>
              <Choice tone="danger" active={status === 'Rejected'} onClick={() => { setStatus('Rejected'); setError('') }}>Reject</Choice>
            </div>
            {status === 'Completed' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    value={transactionId}
                    placeholder="TXN-BANK-12345"
                    onChange={(event) => { setTransactionId(event.target.value); setError('') }}
                    style={fieldStyle}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payment proof</Form.Label>
                  <label className="d-flex align-items-center justify-content-between gap-3 mb-0 px-3 py-2" style={{ border: '1px dashed #cbd5e1', borderRadius: 10, background: '#fff', cursor: 'pointer' }}>
                    <span className="text-muted small text-truncate">{file ? file.name : 'PDF or image, optional'}</span>
                    <span className="fw-semibold small flex-shrink-0" style={{ color: '#3b82f6' }}>{file ? 'Change' : 'Choose file'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="d-none"
                      onChange={(event) => setFile(event.target.files?.[0] || null)}
                    />
                  </label>
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-0">
              <Form.Label>Reason {status === 'Rejected' && <span className="required_icon">*</span>}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={reason}
                placeholder={status === 'Rejected' ? 'Invalid bank details' : 'Paid to bank account'}
                onChange={(event) => { setReason(event.target.value); setError('') }}
                style={fieldStyle}
              />
            </Form.Group>
            {error && <p className="text-danger small mb-0 mt-2">{error}</p>}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="px-4 py-3" style={{ borderTop: '1px solid #eef2f7' }}>
        <Button type="button" variant="light" onClick={onClose} disabled={isLoading}>
          {pending ? 'Cancel' : 'Close'}
        </Button>
        {pending && (
          <Button type="submit" form="withdrawal-review-form" variant={status === 'Rejected' ? 'danger' : 'primary'} disabled={isLoading}>
            {isLoading ? 'Saving...' : status === 'Rejected' ? 'Reject withdrawal' : 'Mark completed'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}
