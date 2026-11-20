import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaPlus,
  FaTimes,
  FaUpload,
  FaVideo,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import useDebounce from '../../../hooks/useDebounce'
import {
  useAcceptOptometristAppointmentMutation,
  useCompleteOptometristAppointmentMutation,
  useGetOptometristAppointmentsQuery,
  useGetOptometristServicesQuery,
  useGetOptometristWorkingRulesQuery,
  useRejectOptometristAppointmentMutation,
} from '../../../redux/features/optometristAPIEndPoint'
import AppointmentActionModal from './AppointmentActionModal'
import AppointmentDetailsModal from './AppointmentDetailsModal'
import PrescriptionForm from '../customers/PrescriptionForm'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')
const PAGE_SIZES = [5, 10, 20, 50]
const STATUSES = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
]
const PAYMENTS = [
  { value: 'all', label: 'All payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'payment_pending', label: 'Payment pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'refund_pending', label: 'Refund pending' },
]
const TYPES = [
  { value: 'all', label: 'All types' },
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'In-person' },
]
const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, fontWeight: 400 }
const VISIT = {
  online: 'Online',
  in_person: 'In-person',
  both: 'Online or in-person',
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CHIPS = {
  pending: { label: 'Pending', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  accepted: { label: 'Accepted', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  completed: { label: 'Completed', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  rejected: { label: 'Rejected', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  cancelled: { label: 'Cancelled', bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  paid: { label: 'Paid', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  payment_pending: { label: 'Payment pending', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  failed: { label: 'Payment failed', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  refunded: { label: 'Refunded', bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  refund_pending: { label: 'Refund pending', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
}
const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}
const relatedLinks = [
  {
    to: '/optometrist-dashboard/availability',
    title: 'Availability',
    text: 'Working hours and time off that create these slots',
    icon: <FaCalendarAlt />,
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    to: '/optometrist-dashboard/services',
    title: 'Services',
    text: 'What patients enquire about, including default meeting links',
    icon: <FaBriefcase />,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    to: '/optometrist-dashboard/working-rules',
    title: 'Working rules',
    text: 'Manual accept/reject or auto-confirm',
    icon: <FaClock />,
    color: '#0d9488',
    bg: '#f0fdfa',
  },
]

function localToday() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function rangeError(from, to, today) {
  if (from && from > today) return 'From date cannot be after today.'
  if (to && to > today) return 'To date cannot be after today.'
  if (from && to && from > to) return 'To date must be on or after the From date.'
  if ((from && !to) || (!from && to)) return 'Choose both a From date and a To date.'
  return ''
}

function clean(value) {
  return value == null ? '' : String(value).trim()
}

function join(parts) {
  return parts.filter(Boolean).join(' · ')
}

function sameText(left, right) {
  const a = clean(left).toLowerCase()
  const b = clean(right).toLowerCase()
  return Boolean(a) && a === b
}

function visitKey(value) {
  return clean(value).toLowerCase().replace(/[\s-]+/g, '_')
}

function visitLabel(value) {
  return VISIT[visitKey(value)] || ''
}

function money(value) {
  const amount = Number(value)
  if (value == null || value === '' || !Number.isFinite(amount)) return ''
  return amount.toLocaleString('en-US')
}

function words(value) {
  const text = clean(value).replace(/[_-]+/g, ' ')
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function clock(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return prettyBooked(value)
  const pad = (n) => String(n).padStart(2, '0')
  const hours = date.getHours()
  const hour12 = hours % 12 || 12
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${pad(hour12)}:${pad(date.getMinutes())} ${suffix}`
}

function prettyBooked(value) {
  const text = clean(value)
  const match = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4}) at (\d{1,2}:\d{2} [AP]M)$/i)
  const month = match && MONTHS[Number(match[2]) - 1]
  if (!month) return text
  return `${Number(match[1])} ${month} ${match[3]}, ${match[4].toUpperCase()}`
}

function slotText(date, time) {
  const [year, month, day] = clean(date).slice(0, 10).split('-')
  const monthName = MONTHS[Number(month) - 1]
  const pretty = day && monthName && year ? `${Number(day)} ${monthName} ${year}` : clean(date)
  return join([pretty, clean(time)]) || '—'
}

function serviceName(service, names) {
  if (service && typeof service === 'object') return clean(service.service_name || service.name)
  const value = clean(service)
  if (names[value]) return names[value]
  if (/^[a-f\d]{24}$/i.test(value)) return ''
  return value
}

function meetingLinkOf(item, links = {}) {
  const own = clean(item.meeting_link)
  if (own) return own
  if (item.service && typeof item.service === 'object') return clean(item.service.meeting_link)
  return clean(links[clean(item.service)])
}

function toCard(item, serviceNames, serviceLinks) {
  const user = item.user_id && typeof item.user_id === 'object' ? item.user_id : {}
  const userId = clean(user._id || user.id || (typeof item.user_id === 'string' ? item.user_id : ''))
  const name = clean(item.name) || clean(user.name) || 'Patient'
  const email = clean(item.email) || clean(user.email)
  const phone = clean(item.phone) || clean(user.phone_number)
  const visit = visitKey(item.visit_type)
  const from = visitKey(item.from)
  const service = serviceName(item.service, serviceNames)
  const fee = money(item.payment_amount ?? item.consultation_fee)
  const method = clean(item.payment_method)
  const methodLabel = method ? method.charAt(0).toUpperCase() + method.slice(1) : ''
  const expires = item.hold_expires_at ? new Date(item.hold_expires_at) : null
  const holdReady = expires && !Number.isNaN(expires.getTime())
  const holdExpired = holdReady && expires.getTime() <= Date.now()
  const bookerName = clean(user.name)
  const bookerEmail = clean(user.email)
  const bookerPhone = clean(user.phone_number) || clean(user.phone)
  const paymentStatus = visitKey(item.payment_status)
  const offeredAs = from === 'both' ? 'online and in-person' : visitLabel(from).toLowerCase()

  let hold = ''
  if (holdReady && paymentStatus !== 'paid') {
    hold = holdExpired
      ? `Payment hold ended on ${clock(expires)}`
      : `This slot is held until ${clock(expires)}`
  }

  return {
    id: item._id || '',
    name,
    email,
    phone,
    userId,
    userPhone: bookerPhone,
    account: join([
      sameText(bookerName, name) ? '' : bookerName,
      sameText(bookerPhone, phone) ? '' : bookerPhone,
      sameText(bookerEmail, email) ? '' : bookerEmail,
    ]),
    photo: clean(user.profile_pic),
    when: join([slotText(item.date, item.time), visitLabel(visit), service]),
    slotNote: from && from !== visit ? `Booked as ${visitLabel(visit).toLowerCase()} from a slot that offers ${offeredAs}` : '',
    service,
    visit: visitLabel(visit),
    online: visit === 'online' || visit === 'both',
    message: clean(item.message),
    purpose: clean(item.purpose),
    remarks: clean(item.remarks),
    reason: clean(item.reason || item.reject_reason),
    booked: prettyBooked(item.createdAt),
    meetingLink: meetingLinkOf(item, serviceLinks),
    status: item.status || 'pending',
    paymentStatus: paymentStatus === 'pending' ? 'payment_pending' : paymentStatus,
    fee,
    method: methodLabel,
    track: clean(item.payment_track_id),
    ref: clean(item.payment_ref_number),
    payment: join([fee && `Fee ${fee}`, methodLabel, item.payment_track_id && `reference ${item.payment_track_id}`]),
    paidAt: item.paid_at ? clock(item.paid_at) : '',
    hold,
    holdExpired,
    raw: item,
  }
}

function workingRules(response) {
  const body = response?.data ?? response
  if (Array.isArray(body)) return body[0] || {}
  return body?.working_rules || body?.data?.working_rules || body?.data || body || {}
}

function pageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const visible = [1, totalPages, page - 1, page, page + 1].filter((number, index, list) => (
    number >= 1 && number <= totalPages && list.indexOf(number) === index
  )).sort((a, b) => a - b)
  const items = []
  visible.forEach((number, index) => {
    if (index && number - visible[index - 1] > 1) items.push('gap')
    items.push(number)
  })
  return items
}

function Chip({ type }) {
  if (!type) return null
  const meta = CHIPS[type] || { label: words(type), bg: '#f8fafc', color: '#64748b', border: '#e8edf3' }
  return (
    <span className="px-2 py-1 fw-semibold" style={{ fontSize: 12, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, borderRadius: 999 }}>
      {meta.label}
    </span>
  )
}

function PagerButton({ active, disabled, onClick, children, label, end }) {
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
        padding: '0 8px',
        border: 'none',
        borderRight: end ? 'none' : '1px solid #eef2f6',
        background: active ? '#293896' : 'transparent',
        color: disabled ? '#cbd5e1' : active ? '#fff' : '#334155',
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

function Fact({ label, value }) {
  if (!value) return null
  return (
    <div style={{ minWidth: 120 }}>
      <div className="text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
      <div className="small fw-semibold mt-1" style={{ color: '#0f172a' }}>{value}</div>
    </div>
  )
}

function AppointmentRow({ item, onView, onAccept, onReject, onComplete, onUpload, onCreate }) {
  const pending = item.status === 'pending'
  const canReview = pending && item.paymentStatus !== 'payment_pending'
  const canComplete = item.status === 'accepted'
  const canPrescribe = (item.status === 'accepted' || item.status === 'completed') && item.userId
  const contact = join([item.email, item.phone])
  const notes = [
    item.message && `Message: ${item.message}`,
    item.purpose && `Purpose: ${item.purpose}`,
    item.remarks && `Remarks: ${item.remarks}`,
    item.reason && `Reason: ${item.reason}`,
  ].filter(Boolean)
  return (
    <div
      className="p-3"
      style={{
        background: pending ? '#fff7ed' : '#fff',
        border: pending ? '1px solid #ffedd5' : '1px solid #e8edf3',
        borderRadius: 12,
      }}
    >
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="d-flex align-items-start gap-3">
          {item.photo ? (
            <img src={item.photo} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
          ) : (
            <span
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 40, height: 40, borderRadius: 10, background: item.online ? '#f0f9ff' : '#eff6ff', color: item.online ? '#0284c7' : '#2563eb' }}
            >
              {item.online ? <FaVideo /> : <FaCalendarAlt />}
            </span>
          )}
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              {item.userPhone ? (
                <Link
                  to={`${basePath}/optometrist-dashboard/customers?search=${encodeURIComponent(item.userPhone)}`}
                  className="fw-semibold text-decoration-none"
                  style={{ color: 'inherit' }}
                  title="View this customer"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="fw-semibold">{item.name}</span>
              )}
              <Chip type={item.status} />
              <Chip type={item.paymentStatus} />
            </div>
            <div className="text-muted small mt-1">{item.when}</div>
            {contact && <div className="text-muted small mt-1">{contact}</div>}
            {item.account && <div className="text-muted small">Booked by {item.account}</div>}
          </div>
        </div>
        <div className="d-flex gap-2 flex-shrink-0 flex-wrap justify-content-end">
          <Button type="button" variant="primary" size="sm" onClick={() => onView(item.raw)}>View</Button>
          {canPrescribe && (
            <>
              <Button type="button" variant="primary" size="sm" className="d-inline-flex align-items-center gap-2" onClick={() => onUpload(item)}>
                <FaUpload /> Upload
              </Button>
              <Button type="button" variant="primary" size="sm" className="d-inline-flex align-items-center gap-2" onClick={() => onCreate(item)}>
                <FaPlus /> Create
              </Button>
            </>
          )}
          {canReview && (
            <>
              <Button type="button" variant="danger" size="sm" className="d-inline-flex align-items-center gap-2" onClick={() => onReject(item)}>
                <FaTimes /> Reject
              </Button>
              <Button type="button" variant="primary" size="sm" className="d-inline-flex align-items-center gap-2" onClick={() => onAccept(item)}>
                <FaCheck /> Accept
              </Button>
            </>
          )}
          {canComplete && (
            <Button type="button" variant="primary" size="sm" className="d-inline-flex align-items-center gap-2 text-nowrap" onClick={() => onComplete(item)}>
              <FaCheck /> Mark as completed
            </Button>
          )}
        </div>
      </div>

      {(item.fee || item.method || item.track || item.ref || item.paidAt) && (
        <div className="d-flex flex-wrap gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #eef2f7' }}>
          <Fact label="Fee" value={item.fee} />
          <Fact label="Method" value={item.method} />
          <Fact label="Reference" value={item.track} />
          <Fact label="Bank reference" value={item.ref} />
          <Fact label="Paid" value={item.paidAt} />
        </div>
      )}

      {(notes.length > 0 || item.slotNote || item.hold || item.meetingLink || item.booked) && (
        <div className="mt-3 pt-3 d-flex flex-column gap-2" style={{ borderTop: '1px solid #eef2f7' }}>
          {notes.map((note) => <div key={note} className="small">{note}</div>)}
          {item.slotNote && <div className="text-muted small">{item.slotNote}</div>}
          {item.hold && <div className="small" style={{ color: item.holdExpired ? '#b91c1c' : '#c2410c' }}>{item.hold}</div>}
          {item.meetingLink && (
            <a href={item.meetingLink} target="_blank" rel="noopener noreferrer" className="small text-truncate d-inline-block" style={{ maxWidth: 360 }}>{item.meetingLink}</a>
          )}
          {item.booked && <div className="text-muted small">Booked on {item.booked}</div>}
        </div>
      )}
    </div>
  )
}

export default function Appointments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || 'all'
  const paymentStatus = searchParams.get('payment_status') || 'all'
  const type = searchParams.get('type') || 'all'
  const fromDate = searchParams.get('fromDate') || ''
  const toDate = searchParams.get('toDate') || ''
  const today = useMemo(() => localToday(), [])
  const dateError = rangeError(fromDate, toDate, today)
  const fromMax = toDate && toDate < today ? toDate : today
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(PAGE_SIZES[0])
  const [action, setAction] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [rxModal, setRxModal] = useState({ open: false, mode: 'created', customer: null })
  const debouncedSearch = useDebounce(search.trim(), 500)

  const setQuery = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
    setPage(1)
  }

  const hasFilters = status !== 'all' || paymentStatus !== 'all' || type !== 'all' || fromDate || toDate || search

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
    setSearch('')
    setPage(1)
  }

  const [doExport, setDoExport] = useState(false)
  const { data: response, isLoading, isFetching, refetch } = useGetOptometristAppointmentsQuery({
    status,
    payment_status: paymentStatus,
    type,
    fromDate,
    toDate,
    search: debouncedSearch,
    page,
    limit,
    export: doExport,
  }, { skip: Boolean(dateError) })
  const { data: rulesResponse } = useGetOptometristWorkingRulesQuery()
  const { data: servicesResponse } = useGetOptometristServicesQuery()
  const [acceptAppointment, { isLoading: isAccepting }] = useAcceptOptometristAppointmentMutation()
  const [rejectAppointment, { isLoading: isRejecting }] = useRejectOptometristAppointmentMutation()
  const [completeAppointment, { isLoading: isCompleting }] = useCompleteOptometristAppointmentMutation()

  const pageData = response?.data && !Array.isArray(response.data) ? response.data : {}
  const rows = Array.isArray(pageData.data) ? pageData.data : []
  const total = Number(pageData.total) || 0
  const totalPages = Number(pageData.totalPages) || 1
  const services = Array.isArray(servicesResponse?.data) ? servicesResponse.data : []
  const serviceNames = Object.fromEntries(services.map((item) => [item._id, item.service_name || '']))
  const serviceLinks = Object.fromEntries(services.map((item) => [item._id, item.meeting_link || '']))
  const appointments = rows.map((item) => toCard(item, serviceNames, serviceLinks))
  const autoConfirm = String(workingRules(rulesResponse).booking_confirmation || '').toLowerCase() === 'auto'
  const defaultMeetingLink = services.find((item) => item.meeting_link)?.meeting_link || ''
  const isSaving = isAccepting || isRejecting || isCompleting
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    if (doExport && !isFetching) setDoExport(false)
  }, [doExport, isFetching])

  const closeAction = () => setAction(null)

  const saveStatus = async (nextStatus, { meetingLink = '', reason = '' } = {}) => {
    if (!action?.appointment) return
    try {
      const request = nextStatus === 'rejected'
        ? rejectAppointment
        : nextStatus === 'completed'
          ? completeAppointment
          : acceptAppointment
      const result = await request({
        id: action.appointment.id,
        status: nextStatus,
        ...(nextStatus === 'completed' ? {} : { meeting_link: meetingLink || action.appointment.meetingLink || '' }),
        ...(nextStatus === 'rejected' ? { reason: reason.trim() } : {}),
      })
      const body = result?.data
      if (!(body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201)) return
      const fallback = nextStatus === 'rejected'
        ? 'Enquiry rejected'
        : nextStatus === 'completed'
          ? 'Appointment marked as completed'
          : 'Enquiry accepted'
      toast.success(body?.message || fallback)
      refetch()
      closeAction()
    } catch (err) {
      console.error(err)
    }
  }

  const closePrescription = () => setRxModal({ open: false, mode: 'created', customer: null })

  const openPrescription = (appointment, mode) => {
    setRxModal({ open: true, mode, customer: { id: appointment.userId, name: appointment.name } })
  }

  return (
    <>
      {(isLoading || isFetching || isSaving) && <Loader />}

      <Row>
        <Col>
          <PageHeader titles="Appointments" active="Appointments" items={['Overview']} links={['/optometrist-dashboard/overview']} />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>Enquiry bookings</h4>
            <p className="text-muted mb-0">
              Patients send an enquiry for a slot. Accept or reject it here.
              {autoConfirm ? ' Working rules auto-confirm new enquiries.' : ''}
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {total} {total === 1 ? 'appointment' : 'appointments'}
            </span>
            <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {autoConfirm ? 'Auto-confirm' : 'Manual accept / reject'}
            </span>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="mb-1">
            <h5 className="fw-semibold mb-1">All appointments</h5>
            <p className="text-muted mb-0 small">Search by name, phone, or email.</p>
          </div>

          <div className="my-4 p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
            <div className="d-flex justify-content-end align-items-center gap-3 mb-2">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="p-0 text-decoration-none fw-semibold"
                disabled={Boolean(dateError)}
                onClick={() => setDoExport(true)}
              >
                Export
              </Button>
              <Button type="button" variant="link" size="sm" className="p-0 text-decoration-none fw-semibold" onClick={clearFilters} disabled={!hasFilters}>
                Clear filters
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'end' }}>
              <div>
                <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Search</div>
                <Form.Control
                  aria-label="Search"
                  placeholder="Name, phone, or email"
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1) }}
                  style={fieldStyle}
                />
              </div>
              <div>
                <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>From</div>
                <Form.Control
                  type="date"
                  aria-label="From date"
                  value={fromDate}
                  max={fromMax}
                  onChange={(event) => setQuery('fromDate', event.target.value)}
                  style={{ ...fieldStyle, borderColor: fromDate && (fromDate > today || (toDate && fromDate > toDate)) ? '#dc3545' : '#e8edf3' }}
                />
              </div>
              <div>
                <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>To</div>
                <Form.Control
                  type="date"
                  aria-label="To date"
                  value={toDate}
                  min={fromDate || undefined}
                  max={today}
                  disabled={!fromDate}
                  onChange={(event) => setQuery('toDate', event.target.value)}
                  style={{ ...fieldStyle, borderColor: toDate && (toDate > today || (fromDate && toDate < fromDate)) ? '#dc3545' : '#e8edf3' }}
                />
              </div>
              <div>
                <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Payment</div>
                <Form.Select aria-label="Payment status" value={paymentStatus} onChange={(event) => setQuery('payment_status', event.target.value)} style={fieldStyle}>
                  {PAYMENTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </Form.Select>
              </div>
              <div>
                <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Type</div>
                <Form.Select aria-label="Type" value={type} onChange={(event) => setQuery('type', event.target.value)} style={fieldStyle}>
                  {TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </Form.Select>
              </div>
              <div>
                <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Status</div>
                <Form.Select aria-label="Status" value={status} onChange={(event) => setQuery('status', event.target.value)} style={fieldStyle}>
                  {STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </Form.Select>
              </div>
            </div>
            {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
          </div>

          {appointments.length === 0 ? (
            <div className="px-3 py-4 text-muted small text-center" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {status === 'all' && paymentStatus === 'all' && type === 'all' && !fromDate && !toDate && !debouncedSearch
                ? 'No appointments yet. Patients book from your availability calendar.'
                : 'No appointments match these filters.'}
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {appointments.map((item) => (
                <AppointmentRow
                  key={item.id}
                  item={item}
                  onView={setViewing}
                  onReject={(appointment) => setAction({ mode: 'reject', appointment })}
                  onAccept={(appointment) => setAction({ mode: 'accept', appointment })}
                  onComplete={(appointment) => setAction({ mode: 'complete', appointment })}
                  onUpload={(appointment) => openPrescription(appointment, 'upload')}
                  onCreate={(appointment) => openPrescription(appointment, 'created')}
                />
              ))}
            </div>
          )}

          {total > 0 && (
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid #eef2f6' }}>
              <div className="text-muted" style={{ fontSize: 13 }}>
                Showing <span className="fw-semibold" style={{ color: '#0f172a' }}>{from === to ? from : `${from}–${to}`}</span> of {total}
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <label className="d-flex align-items-center gap-2 mb-0 text-muted" style={{ fontSize: 13 }}>
                  Rows
                  <Form.Select
                    aria-label="Rows per page"
                    value={String(limit)}
                    onChange={(event) => { setLimit(Number(event.target.value)); setPage(1) }}
                    style={{ width: 72, height: 34, borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#334155' }}
                  >
                    {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                  </Form.Select>
                </label>
                {totalPages > 1 && (
                  <div className="d-inline-flex align-items-stretch" style={{ border: '1px solid #e8edf3', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                    <PagerButton label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</PagerButton>
                    {pageItems(page, totalPages).map((item, index) => (
                      item === 'gap' ? (
                        <span key={`gap-${index}`} className="d-inline-flex align-items-center justify-content-center text-muted" style={{ minWidth: 28, borderRight: '1px solid #eef2f6', fontSize: 13 }}>…</span>
                      ) : (
                        <PagerButton key={item} label={`Page ${item}`} active={item === page} onClick={() => setPage(item)}>{item}</PagerButton>
                      )
                    ))}
                    <PagerButton label="Next page" end disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</PagerButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        {relatedLinks.map((item) => (
          <Col key={item.to} md={4}>
            <Link to={`${basePath}${item.to}`} className="text-decoration-none text-reset">
              <Card className="h-100" style={cardStyle}>
                <Card.Body className="p-4">
                  <span className="d-flex align-items-center justify-content-center mb-3" style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, color: item.color }}>
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

      <AppointmentDetailsModal item={viewing} onClose={() => setViewing(null)} />

      <PrescriptionForm
        show={rxModal.open}
        mode={rxModal.mode}
        customer={rxModal.customer}
        onClose={closePrescription}
      />

      <AppointmentActionModal
        key={action ? `${action.mode}-${action.appointment?.id}` : 'closed'}
        show={Boolean(action)}
        mode={action?.mode}
        appointment={action?.appointment}
        defaultLink={defaultMeetingLink}
        isSaving={isSaving}
        onClose={closeAction}
        onSubmit={action?.mode === 'reject'
          ? ({ reason }) => saveStatus('rejected', { reason })
          : action?.mode === 'complete'
            ? () => saveStatus('completed')
            : ({ meeting_link }) => saveStatus('accepted', { meetingLink: meeting_link })}
      />
    </>
  )
}
