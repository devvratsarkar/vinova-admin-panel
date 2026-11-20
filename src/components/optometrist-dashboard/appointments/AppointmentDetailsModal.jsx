import React from 'react'
import { Button, Modal } from 'react-bootstrap'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const VISIT = { online: 'Online', in_person: 'In-person', both: 'Online or in-person' }
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
const SKIP = new Set(['from', '__v', 'user_id'])

function clean(value) {
  return value == null ? '' : String(value).trim()
}

function words(value) {
  const text = clean(value).replace(/[_-]+/g, ' ')
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function money(value) {
  const amount = Number(value)
  if (value == null || value === '' || !Number.isFinite(amount)) return ''
  return amount.toLocaleString('en-US')
}

function clock(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return prettyStamp(value)
  const pad = (n) => String(n).padStart(2, '0')
  const hours = date.getHours()
  const hour12 = hours % 12 || 12
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${pad(hour12)}:${pad(date.getMinutes())} ${suffix}`
}

function prettyStamp(value) {
  const text = clean(value)
  const match = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4}) at (\d{1,2}:\d{2} [AP]M)$/i)
  const month = match && MONTHS[Number(match[2]) - 1]
  if (!month) return text
  return `${Number(match[1])} ${month} ${match[3]}, ${match[4].toUpperCase()}`
}

function prettyDate(value) {
  const [year, month, day] = clean(value).slice(0, 10).split('-')
  const monthName = MONTHS[Number(month) - 1]
  return day && monthName && year ? `${Number(day)} ${monthName} ${year}` : clean(value)
}

function show(value) {
  return value == null || value === '' ? '—' : clean(value)
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

function Section({ title, children }) {
  return (
    <section className="mb-3">
      <div className="fw-semibold mb-2" style={{ fontSize: 13, color: '#334155' }}>{title}</div>
      <div className="p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 12 }}>
        {children}
      </div>
    </section>
  )
}

function Grid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px 20px' }}>{children}</div>
}

function Field({ label, value, wide }) {
  const text = value == null || value === '' ? '—' : value
  const link = typeof text === 'string' && /^https?:\/\//i.test(text)
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <div className="text-muted mb-1" style={{ fontSize: 12 }}>{label}</div>
      {link ? (
        <a href={text} target="_blank" rel="noopener noreferrer" className="fw-semibold small">{text}</a>
      ) : (
        <div className="fw-semibold" style={{ fontSize: 14, wordBreak: 'break-word', color: text === '—' ? '#94a3b8' : '#0f172a' }}>{text}</div>
      )}
    </div>
  )
}

function extraFields(item, used) {
  return Object.keys(item)
    .filter((key) => !used.has(key) && !SKIP.has(key) && (item[key] == null || typeof item[key] !== 'object'))
    .map((key) => ({ label: words(key), value: show(item[key]) }))
}

export default function AppointmentDetailsModal({ item, onClose }) {
  if (!item) return null

  const user = item.user_id && typeof item.user_id === 'object' ? item.user_id : null
  const visit = VISIT[clean(item.visit_type).toLowerCase().replace(/[\s-]+/g, '_')] || words(item.visit_type)
  const service = item.service && typeof item.service === 'object'
    ? clean(item.service.service_name || item.service.name)
    : clean(item.service)
  const meetingLink = clean(item.meeting_link) || (item.service && typeof item.service === 'object' ? clean(item.service.meeting_link) : '')
  const paymentStatus = clean(item.payment_status).toLowerCase().replace(/[\s-]+/g, '_')
  const paymentType = paymentStatus === 'pending' ? 'payment_pending' : paymentStatus
  const when = [prettyDate(item.date), clean(item.time), visit].filter(Boolean).join(' · ')
  const used = new Set([
    'name', 'email', 'phone', 'date', 'time', 'visit_type', 'status', 'service', 'purpose', 'message',
    'remarks', 'meeting_link', 'consultation_fee', 'payment_amount', 'payment_status', 'payment_method',
    'payment_track_id', 'payment_ref_number', 'paid_at', 'hold_expires_at', 'createdAt', 'updatedAt',
    'id', 'optometrist_id', '_id', 'from', '__v', 'user_id',
  ])
  const more = extraFields(item, used)

  return (
    <Modal show onHide={onClose} centered scrollable size="lg">
      <Modal.Header className="border-0 pb-0 px-4 pt-4">
        <Modal.Title as="h4" className="fw-semibold">Appointment details</Modal.Title>
      </Modal.Header>
      <Button type="button" onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="" aria-label="Close">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body className="px-4 pb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="fw-semibold" style={{ fontSize: '1.25rem' }}>{show(item.name || user?.name)}</div>
            <div className="text-muted">{when || '—'}</div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Chip type={item.status || 'pending'} />
            <Chip type={paymentType} />
          </div>
        </div>

        <Section title="Patient">
          <Grid>
            <Field label="Name" value={show(item.name)} />
            <Field label="Email" value={show(item.email)} />
            <Field label="Phone" value={show(item.phone)} />
          </Grid>
          {user && (
            <div className="mt-3 p-3" style={{ background: '#fff', border: '1px solid #e8edf3', borderRadius: 10 }}>
              <div className="text-muted mb-2" style={{ fontSize: 12 }}>User account</div>
              <Grid>
                <Field label="Name" value={show(user.name)} />
                <Field label="Email" value={show(user.email)} />
                <Field label="Phone" value={show(user.phone_number || user.phone)} />
              </Grid>
            </div>
          )}
        </Section>

        <Section title="Visit">
          <Grid>
            <Field label="Date" value={prettyDate(item.date) || '—'} />
            <Field label="Time" value={show(item.time)} />
            <Field label="Visit type" value={visit || '—'} />
            <Field label="Service" value={service || '—'} />
            <Field label="Message" value={show(item.message)} wide />
            <Field label="Remarks" value={show(item.remarks)} wide />
            <Field label="Meeting link" value={meetingLink || '—'} wide />
          </Grid>
        </Section>

        <Section title="Payment">
          <Grid>
            <Field label="Consultation fee" value={money(item.consultation_fee) || '—'} />
            <Field label="Amount paid" value={money(item.payment_amount) || '—'} />
            <Field label="Status" value={words(item.payment_status) || '—'} />
            <Field label="Method" value={words(item.payment_method) || '—'} />
            <Field label="Payment reference" value={show(item.payment_track_id)} />
            <Field label="Bank reference" value={show(item.payment_ref_number)} />
            <Field label="Paid at" value={item.paid_at ? clock(item.paid_at) : '—'} />
            <Field label="Hold expires" value={item.hold_expires_at ? clock(item.hold_expires_at) : '—'} />
          </Grid>
        </Section>

        <Section title="Record">
          <Grid>
            <Field label="Appointment number" value={show(item.id)} />
            <Field label="Booked" value={prettyStamp(item.createdAt) || '—'} />
            <Field label="Updated" value={prettyStamp(item.updatedAt) || '—'} />
            {more.map((field) => <Field key={field.label} label={field.label} value={field.value} />)}
          </Grid>
        </Section>
      </Modal.Body>
    </Modal>
  )
}
