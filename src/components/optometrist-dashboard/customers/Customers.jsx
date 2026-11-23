import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import {
  FaCalendarCheck,
  FaCreditCard,
  FaFilePrescription,
  FaPen,
  FaPlus,
  FaTrash,
  FaUpload,
  FaUserPlus,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import {
  optometristAPIEndPoint,
  useAddOptometristCustomerMutation,
  useDeleteOptometristPrescriptionMutation,
  useGetOptometristCustomersQuery,
} from '../../../redux/features/optometristAPIEndPoint'
import useDebounce from '../../../hooks/useDebounce'
import { useCsvDownload } from '../../../utils/fileDownload'
import RegisterCustomerModal from './RegisterCustomerModal'
import PrescriptionForm from './PrescriptionForm'
import DeletePrescriptionModal from './DeletePrescriptionModal'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const PAGE_SIZES = [10, 20, 50]
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'no_rx', label: 'No prescription' },
  { value: 'valid', label: 'Valid Rx' },
  { value: 'expired', label: 'Expired Rx' },
]

const relatedLinks = [
  {
    to: '/optometrist-dashboard/appointments',
    title: 'Appointments',
    text: 'Enquiry bookings for registered patients',
    icon: <FaCalendarCheck />,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    to: '/optometrist-dashboard/memberships-plans',
    title: 'Membership',
    text: 'Referral commission when a prescription leads to an order',
    icon: <FaCreditCard />,
    color: '#0d9488',
    bg: '#f0fdfa',
  },
]

function formatDate(value) {
  const [year, month, day] = String(value || '').slice(0, 10).split('-')
  return day && month && year ? `${day}/${month}/${year}` : value || ''
}

function isSuccess(response) {
  const body = response?.data
  return body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201
}

function eyeText(eye) {
  if (!eye) return ''
  return ['sph', 'cyl', 'axis']
    .filter((key) => eye[key])
    .map((key) => `${key.toUpperCase()} ${eye[key]}`)
    .join('  ')
}

function rxSummary(rx) {
  const manual = rx.manual || {}
  const source = manual.prescription || (manual.right_eye_od ? manual : null) || rx.prescription_obj || {}
  const pdBlock = manual.pupillary_distance || rx.prescription_obj?.pupillary_distance
  const pdValues = pdBlock?.values || {}
  const pd = source.pd || manual.pd || [pdValues.pd_value_1, pdValues.pd_value_2].filter(Boolean).join(' / ')
  return {
    right: eyeText(source.right_eye_od),
    left: eyeText(source.left_eye_os),
    add: source.add || '',
    pd: pd || '',
  }
}

function rxState(rx) {
  if (rx.is_expired) return 'expired'
  if (rx.is_valid === false) return 'invalid'
  return 'valid'
}

const RX_STATE = {
  valid: { label: 'Valid', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  expired: { label: 'Expired', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  invalid: { label: 'Invalid', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
}

function StatusChip({ state }) {
  const meta = RX_STATE[state] || RX_STATE.valid
  return (
    <span
      className="px-2 py-1 fw-semibold"
      style={{ fontSize: 12, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, borderRadius: 999 }}
    >
      {meta.label}
    </span>
  )
}

function PagerButton({ active, disabled, onClick, children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      style={{
        minWidth: 34,
        height: 34,
        padding: '0 10px',
        borderRadius: 8,
        border: `1px solid ${active ? '#bfdbfe' : '#e8edf3'}`,
        background: active ? '#eff6ff' : '#fff',
        color: disabled ? '#cbd5e1' : active ? '#2563eb' : '#475569',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export default function Customers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const querySearch = searchParams.get('search') || ''
  const [search, setSearch] = useState(querySearch)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [rxModal, setRxModal] = useState({ open: false, mode: 'created', customer: null, prescription: null })
  const [deleteRx, setDeleteRx] = useState(null)
  const debouncedSearch = useDebounce(search.trim(), 500)
  const { download: exportCustomers, exporting: isExporting } = useCsvDownload(
    optometristAPIEndPoint.endpoints.getOptometristCustomers,
    'Customers downloaded',
  )
  const { data: customersResponse, isLoading: customersLoading, isFetching, refetch: refetchCustomers } = useGetOptometristCustomersQuery({
    filter,
    search: debouncedSearch,
    page,
    limit,
  })
  const [addCustomer, { isLoading: isAddingCustomer }] = useAddOptometristCustomerMutation()
  const [deletePrescription, { isLoading: isDeletingPrescription }] = useDeleteOptometristPrescriptionMutation()

  const pageData = customersResponse?.data && !Array.isArray(customersResponse.data) ? customersResponse.data : {}
  const rows = Array.isArray(pageData.data) ? pageData.data : Array.isArray(customersResponse?.data) ? customersResponse.data : []
  const total = Number(pageData.total ?? pageData.total_customers) || rows.length
  const totalPages = Number(pageData.totalPages) || 1
  const customerCount = Number(pageData.total_customers ?? pageData.total) || rows.length
  const prescriptionCount = Number.isFinite(Number(pageData.total_prescriptions))
    ? Number(pageData.total_prescriptions)
    : rows.reduce((sum, item) => sum + (item.prescriptions?.length || 0), 0)
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  const customers = rows.map((item) => {
    const customer = item.customer || {}
    return {
      id: customer._id || '',
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone_number || '',
      added: item.createdAt || '',
      prescriptions: Array.isArray(item.prescriptions) ? item.prescriptions : [],
    }
  }).filter((item) => item.id || item.name)

  useEffect(() => {
    setSearch(querySearch)
    setPage(1)
  }, [querySearch])

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleRegister = async (payload) => {
    try {
      const response = await addCustomer({
        name: payload.name,
        phone_number: payload.phone_number,
        ...(payload.email ? { email: payload.email } : {}),
      })
      if (isSuccess(response)) {
        toast.success(response?.data?.message || 'Customer registered')
        setRegisterOpen(false)
        refetchCustomers()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePrescription = async () => {
    const id = deleteRx?._id || deleteRx?.id
    if (!id) return
    try {
      const response = await deletePrescription(id)
      if (isSuccess(response)) {
        toast.success(response?.data?.message || 'Prescription deleted')
        setDeleteRx(null)
        refetchCustomers()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {(customersLoading || isFetching || isAddingCustomer || isDeletingPrescription) && <Loader />}
      <Row>
        <Col>
          <PageHeader
            titles="Customers & Prescriptions"
            active="Customers"
            items={['Overview']}
            links={['/optometrist-dashboard/overview']}
          />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>Register, then prescribe</h4>
            <p className="text-muted mb-0">
              Register the customer first. Then create a prescription in the dashboard or upload an existing one. It stays on their profile for checkout.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {customerCount} {customerCount === 1 ? 'customer' : 'customers'}
            </span>
            <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {prescriptionCount} prescriptions
            </span>
            <Button type="button" variant="outline-primary" className="d-inline-flex align-items-center gap-2" onClick={() => exportCustomers({ filter, search: debouncedSearch, page, limit })} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button type="button" variant="primary" className="d-inline-flex align-items-center gap-2" onClick={() => setRegisterOpen(true)}>
              <FaUserPlus />
              Register customer
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div
              className="d-inline-flex flex-wrap"
              style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, padding: 3, gap: 2 }}
            >
              {FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => { setFilter(item.value); setPage(1) }}
                  style={{
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filter === item.value ? '#fff' : 'transparent',
                    color: filter === item.value ? '#3b82f6' : '#64748b',
                    boxShadow: filter === item.value ? '0 0 0 1px #e8edf3' : 'none',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="position-relative" style={{ maxWidth: 280, width: '100%' }}>
              <Form.Control
                type="search"
                placeholder="Search customers"
                value={search}
                onChange={(event) => {
                  const value = event.target.value
                  setSearch(value)
                  setPage(1)
                  if (!value && searchParams.get('search')) {
                    const next = new URLSearchParams(searchParams)
                    next.delete('search')
                    setSearchParams(next, { replace: true })
                  }
                }}
                style={{ paddingRight: search ? 58 : undefined }}
              />
              {search && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="position-absolute top-50 end-0 translate-middle-y text-decoration-none fw-semibold p-0 me-2"
                  onClick={() => {
                    setSearch('')
                    setPage(1)
                    if (searchParams.get('search')) {
                      const next = new URLSearchParams(searchParams)
                      next.delete('search')
                      setSearchParams(next, { replace: true })
                    }
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {customers.length === 0 && filter === 'all' && !search ? (
            <div className="py-5 text-center">
              <p className="fw-semibold mb-1">No customers yet</p>
              <p className="text-muted small mb-3">Register a customer before you can create or upload a prescription.</p>
              <Button type="button" variant="primary" onClick={() => setRegisterOpen(true)}>Register customer</Button>
            </div>
          ) : customers.length === 0 ? (
            <p className="text-muted small mb-0 py-4 text-center">No customers match this filter.</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {customers.map((customer) => (
                <div key={customer.id || customer.email} className="p-3" style={{ background: '#fff', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                      <div className="fw-semibold">{customer.name}</div>
                      <div className="text-muted small">
                        {[customer.email, customer.phone].filter(Boolean).join(' · ') || '—'}
                      </div>
                      {customer.added ? <div className="text-muted small">Added {customer.added}</div> : null}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="d-inline-flex align-items-center gap-2"
                        onClick={() => setRxModal({ open: true, mode: 'upload', customer, prescription: null })}
                      >
                        <FaUpload /> Upload
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="d-inline-flex align-items-center gap-2"
                        onClick={() => setRxModal({ open: true, mode: 'created', customer, prescription: null })}
                      >
                        <FaPlus /> Create
                      </Button>
                    </div>
                  </div>

                  {customer.prescriptions.length === 0 ? (
                    <p className="text-muted small mb-0 mt-3">No prescription on this profile yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2 mt-3">
                      {customer.prescriptions.map((rx) => {
                        const summary = rxSummary(rx)
                        const meta = [summary.add && `Add ${summary.add}`, summary.pd && `PD ${summary.pd}`].filter(Boolean).join(' · ')
                        return (
                          <div
                            key={rx._id || rx.id}
                            className="px-3 py-2"
                            style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}
                          >
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                              <div className="d-flex flex-wrap align-items-center gap-2">
                                <FaFilePrescription className="text-muted" />
                                <span className="fw-semibold small">{rx.file ? 'Uploaded' : 'Created'}</span>
                                <StatusChip state={rxState(rx)} />
                                <span className="text-muted small">
                                  {formatDate(rx.date_of_prescription) || '—'}
                                  {rx.valid_until ? ` · until ${formatDate(rx.valid_until)}` : ''}
                                </span>
                              </div>
                              <div className="d-flex flex-wrap align-items-center gap-3">
                                {rx.file ? (
                                  <>
                                    <a href={rx.file} target="_blank" rel="noopener noreferrer" className="small">View file</a>
                                    <Button
                                      type="button"
                                      variant="link"
                                      className="p-0 d-inline-flex align-items-center gap-1"
                                      onClick={() => setRxModal({ open: true, mode: 'upload', customer, prescription: rx })}
                                    >
                                      <FaUpload />
                                      Reupload
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="link"
                                    className="p-0 d-inline-flex align-items-center gap-1"
                                    onClick={() => setRxModal({ open: true, mode: 'created', customer, prescription: rx })}
                                  >
                                    <FaPen />
                                    Edit
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-danger p-0 d-inline-flex align-items-center gap-1"
                                  onClick={() => setDeleteRx(rx)}
                                >
                                  <FaTrash />
                                  Delete
                                </Button>
                              </div>
                            </div>
                            {(rx.doctor_name || rx.notes) && (
                              <div className="text-muted small mt-1">{[rx.doctor_name, rx.notes].filter(Boolean).join(' · ')}</div>
                            )}
                            {(summary.right || summary.left || meta) && (
                              <div className="text-muted small mt-1">
                                {summary.right ? <div>Right (OD): {summary.right}</div> : null}
                                {summary.left ? <div>Left (OS): {summary.left}</div> : null}
                                {meta ? <div>{meta}</div> : null}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {total > 0 && (
            <div
              className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 pt-3"
              style={{ borderTop: '1px solid #eef2f6' }}
            >
              <div className="text-muted" style={{ fontSize: 13 }}>
                Showing <span className="fw-semibold" style={{ color: '#0f172a' }}>{from}–{to}</span> of {total}
              </div>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <label className="d-flex align-items-center gap-2 mb-0 text-muted" style={{ fontSize: 13 }}>
                  Rows
                  <Form.Select
                    aria-label="Rows per page"
                    value={String(limit)}
                    onChange={(event) => { setLimit(Number(event.target.value)); setPage(1) }}
                    style={{ width: 76, height: 34, borderColor: '#e8edf3', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#334155' }}
                  >
                    {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                  </Form.Select>
                </label>
                {totalPages > 1 && (
                  <div className="d-inline-flex align-items-center" style={{ gap: 4 }}>
                    <PagerButton label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</PagerButton>
                    <span className="small text-muted">{page} / {totalPages}</span>
                    <PagerButton label="Next page" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</PagerButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        {relatedLinks.map((item) => (
          <Col key={item.to} md={6}>
            <Link to={`${basePath}${item.to}`} className="text-decoration-none text-reset">
              <Card className="h-100" style={cardStyle}>
                <Card.Body className="p-4">
                  <span
                    className="d-flex align-items-center justify-content-center mb-3"
                    style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <div className="fw-semibold mb-1">{item.title}</div>
                  <p className="text-muted mb-0 small">{item.text}</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <RegisterCustomerModal
        show={registerOpen}
        isSaving={isAddingCustomer}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegister}
      />
      <PrescriptionForm
        show={rxModal.open}
        mode={rxModal.mode}
        customer={rxModal.customer}
        prescription={rxModal.prescription}
        onClose={() => setRxModal({ open: false, mode: 'created', customer: null, prescription: null })}
        onSaved={refetchCustomers}
      />
      <DeletePrescriptionModal
        show={Boolean(deleteRx)}
        isSaving={isDeletingPrescription}
        onClose={() => setDeleteRx(null)}
        onConfirm={handleDeletePrescription}
      />
    </>
  )
}
