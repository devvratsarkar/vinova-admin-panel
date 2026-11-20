import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { Badge, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCalendarCheck,
  FaClock,
  FaCheck,
  FaCopy,
  FaCreditCard,
  FaUsers,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { useGetOptometristDashboardQuery, useGetOptometristUserProfileQuery, usePayOptometristPlanMutation } from '../../../redux/features/optometristAPIEndPoint'
import { openPaymentLink, paymentLink, paymentRequired } from '../../../commondata/optometristPayment'
import '../../dashboard/dashboard.css'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')

const PERIODS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom' },
]

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const chartBase = {
  chart: { toolbar: { show: false }, fontFamily: 'inherit', zoom: { enabled: false }, background: 'transparent' },
  dataLabels: { enabled: false },
  grid: { borderColor: '#eef2f7', strokeDashArray: 4 },
  legend: { fontSize: '12px' },
}

const EMPTY_SNAPSHOT = {
  appointments: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  cancelled: 0,
  refundedCount: 0,
  refundedAmount: '0',
  dueCount: 0,
  dueAmount: '0',
  online: 0,
  inPerson: 0,
  customers: 0,
  prescriptions: 0,
  fees: '0',
  orders: 0,
  commission: '0',
  todayBooked: 0,
  todayCapacity: 0,
  bookings: [],
  commissionBars: [],
  labels: [],
}

const chipGroupStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  background: '#f8fafc',
  border: '1px solid #e8edf3',
  borderRadius: 10,
  padding: 3,
  gap: 2,
}

const PAY_STYLE = {
  Paid: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'Payment pending': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  'Refund pending': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
}

function FilterChips({ options, value, onChange }) {
  return (
    <div style={chipGroupStyle}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            background: value === opt.value ? '#fff' : 'transparent',
            color: value === opt.value ? '#3b82f6' : '#64748b',
            boxShadow: value === opt.value ? '0 0 0 1px #e8edf3' : 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function PayChip({ status }) {
  const meta = PAY_STYLE[status] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
  return (
    <span className="px-2 py-1 fw-semibold" style={{ fontSize: 12, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, borderRadius: 999 }}>
      {status}
    </span>
  )
}

function SectionLink({ to, children }) {
  return <Link to={`${basePath}${to}`} className="small fw-semibold text-decoration-none">{children}</Link>
}

function PaymentConfirmation({ trackId, paymentMethod, onClose }) {
  const method = paymentMethod ? `${paymentMethod.charAt(0).toUpperCase()}${paymentMethod.slice(1)}` : ''
  const rows = [
    ['Track ID', trackId],
    ['Payment method', method],
  ].filter(([, value]) => value)

  return (
    <Modal show onHide={onClose} centered>
      <Button type="button" onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="" aria-label="Close">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body className="px-4 pt-5 pb-4 text-center">
        <span className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', color: '#15803d' }}>
          <FaCheck size={22} />
        </span>
        <h4 className="fw-semibold mb-1">Payment successful</h4>
        <p className="text-muted mb-4">Your plan payment is complete.</p>
        {rows.length > 0 && (
          <div className="text-start p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 12 }}>
            {rows.map(([label, value], index) => (
              <div key={label} className="d-flex justify-content-between align-items-center gap-3" style={index > 0 ? { marginTop: 12, paddingTop: 12, borderTop: '1px solid #e8edf3' } : undefined}>
                <span className="text-muted">{label}</span>
                <span className="fw-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}
        <Button type="button" onClick={onClose} className="mt-4 px-4">Close</Button>
      </Modal.Body>
    </Modal>
  )
}

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

export default function Overview() {
  const [period, setPeriod] = useState('year')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [copied, setCopied] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const paymentConfirmed = (searchParams.get('status') || '').toLowerCase() === 'success'
  const today = useMemo(() => localToday(), [])
  const dateError = period === 'custom' ? rangeError(fromDate, toDate, today) : ''
  const fromMax = toDate && toDate < today ? toDate : today
  const customReady = period !== 'custom' || (!dateError && fromDate && toDate)
  const queryArg = period === 'custom' ? { period, fromDate, toDate } : { period }
  const { data: dashboardResponse, isLoading, isFetching } = useGetOptometristDashboardQuery(queryArg, {
    skip: !customReady,
  })
  const { data: userResponse, refetch: refetchProfile } = useGetOptometristUserProfileQuery(undefined, { refetchOnMountOrArgChange: true })
  const [payPlan, { isLoading: isPaying }] = usePayOptometristPlanMutation()
  const dashboard = dashboardResponse?.data || {}
  const profile = dashboard.profile || {}
  const account = userResponse?.data?.userData || userResponse?.data || {}
  const needsPayment = paymentRequired(userResponse)
  const paymentStatus = String(account.payment_status || '').trim()
  const paymentStatusLabel = paymentStatus.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  const paymentStatusKey = paymentStatus.toLowerCase()
  const paymentStatusStyle = paymentStatusKey === 'completed' || paymentStatusKey === 'paid'
    ? { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
    : paymentStatusKey === 'failed'
      ? { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
      : { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }
  const paymentMethod = String(account.payment_method || '').trim()
  const paymentMethodLabel = paymentMethod ? `${paymentMethod.charAt(0).toUpperCase()}${paymentMethod.slice(1).toLowerCase()}` : ''
  const planIsFree = account.plan?.is_free === true
  const referralCode = planIsFree ? '' : (profile.referralCode || account.optometrist_referral_code || '')
  const profileWallet = userResponse?.data?.wallet
  const wallet = account.wallet && typeof account.wallet === 'object'
    ? account.wallet
    : (profileWallet && typeof profileWallet === 'object' ? profileWallet : {})
  const walletAmount = wallet.balance ?? account.wallet_balance ?? userResponse?.data?.wallet_balance
  const walletNumber = Number(walletAmount)
  const walletLabel = walletAmount === undefined || walletAmount === null || walletAmount === ''
    ? '—'
    : `${Number.isFinite(walletNumber) ? walletNumber.toLocaleString('en-US') : walletAmount}${wallet.currency ? ` ${wallet.currency}` : ''}`
  const snapshot = dashboard.snapshot || EMPTY_SNAPSHOT
  const todayRows = Array.isArray(dashboard.today) ? dashboard.today : []
  const enquiries = Array.isArray(dashboard.enquiries) ? dashboard.enquiries : []
  const payments = Array.isArray(dashboard.payments) ? dashboard.payments : []
  const customers = Array.isArray(dashboard.customers) ? dashboard.customers : []
  const services = Array.isArray(dashboard.services) ? dashboard.services : []
  const rules = Array.isArray(dashboard.rules) ? dashboard.rules : []
  const hours = Array.isArray(dashboard.hours) ? dashboard.hours : []
  const periodLabel = dashboard.period?.label || PERIODS.find((item) => item.value === period)?.label || 'This Year'
  const capacityPercent = snapshot.todayCapacity ? Math.round((Number(snapshot.todayBooked) / Number(snapshot.todayCapacity)) * 100) : 0
  const displayName = profile.name || ''
  const initials = displayName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  useEffect(() => {
    if (paymentConfirmed) refetchProfile()
  }, [paymentConfirmed, refetchProfile])

  const closePaymentConfirmation = () => {
    setSearchParams({}, { replace: true })
  }

  const startPayment = async () => {
    const returnUrl = `${window.location.origin}${basePath}/optometrist-dashboard/overview`
    const result = await payPlan({ return_url: returnUrl })
    if (result?.error) {
      toast.error(typeof result.error === 'string' ? result.error : 'Could not start payment')
      return
    }
    const link = paymentLink(result?.data)
    if (!link) {
      toast.error(result?.data?.message || 'Could not start payment')
      return
    }
    openPaymentLink(link)
  }

  const copyReferral = async () => {
    if (!referralCode) return
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy referral code')
    }
  }

  const appointmentTrend = useMemo(() => ({
    options: {
      ...chartBase,
      colors: ['#3b82f6'],
      stroke: { curve: 'smooth', width: 3, colors: ['#3b82f6'] },
      markers: { size: 5, colors: ['#3b82f6'], strokeColors: '#fff', strokeWidth: 2 },
      fill: { type: 'solid', opacity: 0.12 },
      xaxis: { categories: snapshot.labels || [], axisBorder: { show: false }, labels: { style: { colors: '#94a3b8' } } },
      yaxis: { min: 0, labels: { style: { colors: '#94a3b8' } } },
      tooltip: { y: { formatter: (value) => `${value} bookings` } },
    },
    series: [{ name: 'Bookings', data: snapshot.bookings || [] }],
  }), [snapshot])

  const commissionTrend = useMemo(() => ({
    options: {
      ...chartBase,
      colors: ['#38bdf8'],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '42%' } },
      xaxis: { categories: snapshot.labels || [], axisBorder: { show: false }, labels: { style: { colors: '#94a3b8' } } },
      yaxis: { labels: { style: { colors: '#94a3b8' } } },
    },
    series: [{ name: 'Commission', data: snapshot.commissionBars || [] }],
  }), [snapshot])

  const appointmentsTo = (filters) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    const search = params.toString()
    return `${basePath}/optometrist-dashboard/appointments${search ? `?${search}` : ''}`
  }

  const reviewCount = Number(snapshot.pending) || 0
  const kpis = [
    { label: 'Appointments', value: snapshot.appointments, note: `${reviewCount} waiting for review`, noteTo: appointmentsTo({ status: 'pending' }), highlightNote: reviewCount > 0, icon: <FaCalendarCheck />, color: '#3b82f6', bg: '#eff6ff', to: '/optometrist-dashboard/appointments' },
    { label: 'Customers', value: snapshot.customers, note: `${snapshot.prescriptions} prescriptions`, icon: <FaUsers />, color: '#0ea5e9', bg: '#f0f9ff', to: '/optometrist-dashboard/customers' },
    { label: 'Fees collected', value: snapshot.fees, note: `${periodLabel}`, icon: <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.02em' }}>IRR</span>, color: '#0d9488', bg: '#f0fdfa', to: '/optometrist-dashboard/transactions?type=Credit' },
    { label: 'Referral commission', value: snapshot.commission, note: `${snapshot.orders} referred orders`, icon: <FaCreditCard />, color: '#d97706', bg: '#fffbeb', to: '/optometrist-dashboard/transactions?transaction_type=Referral' },
    { label: 'Total paid', value: 'NA', note: 'Paid to Vinova', icon: <FaCheck />, color: '#15803d', bg: '#f0fdf4', to: '/optometrist-dashboard/plan-history' },
  ]

  const bookingStats = [
    { label: 'Accepted', value: snapshot.accepted, note: 'Confirmed bookings', to: appointmentsTo({ status: 'accepted' }) },
    { label: 'Rejected', value: snapshot.rejected, note: 'Bookings you turned down', to: appointmentsTo({ status: 'rejected' }) },
    { label: 'Cancelled', value: snapshot.cancelled, note: 'Cancelled after booking', to: appointmentsTo({ status: 'cancelled' }) },
    { label: 'Refunded', value: snapshot.refundedAmount, note: `${snapshot.refundedCount} completed refunds`, to: appointmentsTo({ payment_status: 'refunded' }) },
    { label: 'Awaiting payment', value: snapshot.dueAmount, note: `${snapshot.dueCount} payments still pending`, to: appointmentsTo({ payment_status: 'payment_pending' }) },
    {
      label: 'Online / in-person',
      note: 'How visits were booked',
      parts: [
        { value: snapshot.online, title: 'Online', to: appointmentsTo({ type: 'online' }) },
        { value: snapshot.inPerson, title: 'In-person', to: appointmentsTo({ type: 'in_person' }) },
      ],
    },
  ]

  return (
    <>
      {paymentConfirmed && (
        <PaymentConfirmation
          trackId={searchParams.get('trackId') || ''}
          paymentMethod={searchParams.get('paymentMethod') || ''}
          onClose={closePaymentConfirmation}
        />
      )}
      {(isLoading || isFetching) && <Loader />}
      <Row>
        <Col>
          <PageHeader titles="Dashboard" active="Dashboard" items={[]} links={[]} />
        </Col>
      </Row>

      {needsPayment && (
        <Card className="mb-4" style={{ ...cardStyle, borderLeft: '3px solid #3b82f6' }}>
          <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#3b82f6' }}>
                <FaCreditCard />
              </span>
              <div>
                <div className="fw-semibold">Complete your plan payment</div>
                <div className="text-muted small">The rest of the dashboard stays closed until this payment is completed.</div>
                <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                  {(account.payment_amount === 0 || account.payment_amount || paymentMethodLabel) && (
                    <span className="fw-semibold">
                      {(account.payment_amount === 0 || account.payment_amount) ? Number(account.payment_amount).toLocaleString('en-US') : ''}
                      {paymentMethodLabel ? `${(account.payment_amount === 0 || account.payment_amount) ? ' · ' : ''}${paymentMethodLabel}` : ''}
                    </span>
                  )}
                  {paymentStatusLabel && (
                    <span className="px-2 py-1 fw-semibold" style={{ fontSize: 12, lineHeight: 1.2, borderRadius: 999, ...paymentStatusStyle }}>
                      {paymentStatusLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button type="button" onClick={startPayment} disabled={isPaying}>
              {isPaying ? 'Starting payment...' : 'Pay now'}
            </Button>
          </Card.Body>
        </Card>
      )}

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center justify-content-center fw-semibold" style={{ width: 52, height: 52, borderRadius: 12, background: '#eff6ff', color: '#3b82f6', fontSize: 16 }}>
                {initials || '—'}
              </span>
              <div>
                <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>{displayName ? `Welcome back, ${displayName}` : 'Welcome back'}</h4>
                {profile.store && <p className="text-muted mb-0">{profile.store}</p>}
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="d-inline-flex align-items-center" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, overflow: 'hidden' }}>
                <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13 }}>{profile.plan || '—'}</span>
                <span className="px-3 py-2" style={{ fontSize: 12, color: '#64748b', borderLeft: '1px solid #e8edf3', background: '#fff' }}>{profile.planPeriod || '—'}</span>
              </span>
              <span className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#15803d' }} />
                {profile.status || '—'}
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #eef2f7' }}>
            <Link to={`${basePath}/optometrist-dashboard/wallet`} className="text-reset text-decoration-none" style={{ minWidth: 180 }}>
              <div className="text-muted" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Wallet balance</div>
              <div className="fw-semibold mt-1" style={{ fontSize: 18 }}>{walletLabel}</div>
            </Link>
            {!planIsFree && (
              <button
                type="button"
                onClick={copyReferral}
                disabled={!referralCode}
                title={copied ? 'Copied' : 'Copy referral code'}
                className="d-inline-flex align-items-center gap-3 ms-md-auto text-start"
                style={{
                  border: '1px solid #fde68a',
                  background: '#fffbeb',
                  borderRadius: 12,
                  padding: '10px 12px 10px 14px',
                  cursor: referralCode ? 'pointer' : 'default',
                }}
              >
                <span>
                  <span className="d-block text-uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#b45309' }}>Referral code</span>
                  <span className="d-block fw-semibold mt-1" style={{ fontSize: 16, letterSpacing: '0.06em', color: '#92400e' }}>{referralCode || '—'}</span>
                </span>
                <span className="d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 8, background: copied ? '#15803d' : '#f59e0b', color: '#fff' }}>
                  {copied ? <FaCheck size={13} /> : <FaCopy size={13} />}
                </span>
              </button>
            )}
          </div>
        </Card.Body>
      </Card>

      <div style={needsPayment ? { opacity: 0.45, pointerEvents: 'none' } : undefined}>
      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="fw-semibold mb-1">Date range</div>
              <div className="text-muted small">Applies to KPIs, charts, and pending enquiries</div>
            </div>
            <FilterChips options={PERIODS} value={period} onChange={setPeriod} />
          </div>
          {period === 'custom' && (
            <div className="mt-3 p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              <div className="d-flex flex-wrap gap-3">
                <div style={{ minWidth: 200, flex: '1 1 200px' }}>
                  <div className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 600 }}>From</div>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    max={fromMax}
                    isInvalid={Boolean(fromDate && (fromDate > today || (toDate && fromDate > toDate)))}
                    onChange={(event) => setFromDate(event.target.value)}
                  />
                </div>
                <div style={{ minWidth: 200, flex: '1 1 200px' }}>
                  <div className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 600 }}>To</div>
                  <Form.Control
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    max={today}
                    disabled={!fromDate}
                    isInvalid={Boolean(toDate && (toDate > today || (fromDate && toDate < fromDate)))}
                    onChange={(event) => setToDate(event.target.value)}
                  />
                </div>
              </div>
              {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="sa-dash">
        <div className="op-kpis">
          {kpis.map((item, index) => (
            <article key={item.label} className={`sa-kpi${index === 0 ? ' is-featured' : ''}`}>
              <Link to={`${basePath}${item.to}`} className="text-decoration-none text-reset">
                <div className="sa-kpi-top">
                  <span className="sa-kpi-icon">{item.icon}</span>
                </div>
                <p className="sa-kpi-label">{item.label}</p>
                <p className="sa-kpi-value">{item.value}</p>
              </Link>
              {item.noteTo ? (
                <Link
                  to={item.noteTo}
                  className="sa-kpi-sub text-decoration-none align-self-start"
                  style={item.highlightNote
                    ? { fontWeight: 600, color: '#c2410c', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 999, padding: '4px 10px' }
                    : undefined}
                >
                  {item.note}
                </Link>
              ) : (
                <p className="sa-kpi-sub">{item.note}</p>
              )}
            </article>
          ))}
        </div>

        <div className="op-stats">
          {bookingStats.map((item) => (
            item.parts ? (
              <div key={item.label} className="op-split">
                {item.parts.map((part) => (
                  <Link key={part.title} to={part.to} className="sa-kpi">
                    <p className="sa-kpi-label">{part.title}</p>
                    <p className="sa-kpi-value">{part.value}</p>
                    <p className="sa-kpi-sub">{item.note}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.label} to={item.to} className="sa-kpi">
                <p className="sa-kpi-label">{item.label}</p>
                <p className="sa-kpi-value">{item.value}</p>
                <p className="sa-kpi-sub">{item.note}</p>
              </Link>
            )
          ))}
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col xl={8}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h5 className="fw-semibold mb-1">Appointment trend</h5>
              <p className="text-muted mb-3 small">Enquiry bookings · {periodLabel}</p>
              {snapshot.labels?.length ? (
                <Chart options={appointmentTrend.options} series={appointmentTrend.series} type="area" height={280} />
              ) : (
                <p className="text-muted small mb-0 py-5 text-center">No appointment data for this range.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-semibold mb-1">Today</h5>
                  <p className="text-muted mb-0 small">{snapshot.todayBooked} of {snapshot.todayCapacity} patients</p>
                </div>
                <SectionLink to="/optometrist-dashboard/appointments">Open</SectionLink>
              </div>
              <div className="mb-3" style={{ height: 8, background: '#eef2f7', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${capacityPercent}%`, height: '100%', background: '#38bdf8' }} />
              </div>
              {todayRows.length === 0 ? (
                <p className="text-muted small mb-0">No appointments today.</p>
              ) : todayRows.map((row) => (
                <div key={row.id || `${row.time}-${row.name}`} className="d-flex justify-content-between align-items-center gap-2 py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                  <div>
                    <div className="fw-semibold">{row.time || row.when}</div>
                    <div className="text-muted small">{[row.name, row.visit].filter(Boolean).join(' · ')}</div>
                  </div>
                  {row.pay && <PayChip status={row.pay} />}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xl={7}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-semibold mb-1">Pending enquiries</h5>
                  <p className="text-muted mb-0 small">Accept only after payment is received</p>
                </div>
                <SectionLink to="/optometrist-dashboard/appointments">Review all</SectionLink>
              </div>
              {enquiries.length === 0 ? (
                <p className="text-muted small mb-0">No pending enquiries for this range.</p>
              ) : enquiries.map((row, index) => (
                <div key={row.id || row.name} className="d-flex justify-content-between align-items-center gap-3 py-3" style={{ borderBottom: index === enquiries.length - 1 ? 'none' : '1px solid #eef2f7' }}>
                  <div>
                    <div className="fw-semibold">{row.name}</div>
                    <div className="text-muted small">{row.visit}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <PayChip status={row.pay} />
                    <Badge bg="light" text="dark" className="border fw-normal">{row.when}</Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={5}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h5 className="fw-semibold mb-1">Recent payments</h5>
              <p className="text-muted mb-3 small">Consultation fees · Zibal</p>
              {payments.length === 0 ? (
                <p className="text-muted small mb-0">No payments for this range.</p>
              ) : payments.map((row, index) => (
                <div key={row.id || `${row.name}-${index}`} className="d-flex justify-content-between align-items-center gap-3 py-3" style={{ borderBottom: index === payments.length - 1 ? 'none' : '1px solid #eef2f7' }}>
                  <div>
                    <div className="fw-semibold">{row.name}</div>
                    <div className="text-muted small">{row.method} · {row.amount}</div>
                  </div>
                  <PayChip status={row.status} />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xl={7}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h5 className="fw-semibold mb-1">Referral commission</h5>
              <p className="text-muted mb-3 small">Give / take on referred orders{referralCode ? ` · ${referralCode}` : ''}</p>
              {snapshot.labels?.length ? (
                <Chart options={commissionTrend.options} series={commissionTrend.series} type="bar" height={260} />
              ) : (
                <p className="text-muted small mb-0 py-5 text-center">No commission data for this range.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={5}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-semibold mb-1">Customers & prescriptions</h5>
                  <p className="text-muted mb-0 small">{snapshot.prescriptions} on file this period</p>
                </div>
                <SectionLink to="/optometrist-dashboard/customers">Open</SectionLink>
              </div>
              {customers.length === 0 ? (
                <p className="text-muted small mb-0">No customers for this range.</p>
              ) : customers.map((row, index) => (
                <div key={row.id || row.name} className="d-flex justify-content-between align-items-center py-3" style={{ borderBottom: index === customers.length - 1 ? 'none' : '1px solid #eef2f7' }}>
                  <div>
                    <div className="fw-semibold">{row.name}</div>
                    <div className="text-muted small">{row.phone}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{row.prescriptions}</div>
                    <div className="text-muted small">{row.last || '—'}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={6} xl={3}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', color: '#3b82f6' }}><FaBriefcase /></span>
                <SectionLink to="/optometrist-dashboard/services">Services</SectionLink>
              </div>
              {services.length === 0 ? <p className="text-muted small mb-0">No services yet.</p> : services.map((row) => (
                <div key={row.id || row.name} className="py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                  <div className="fw-semibold">{row.name}</div>
                  <div className="text-muted small">{row.visit} · {row.fee}</div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdfa', color: '#0d9488' }}><FaClock /></span>
                <SectionLink to="/optometrist-dashboard/working-rules">Rules</SectionLink>
              </div>
              {rules.length === 0 ? <p className="text-muted small mb-0">No working rules yet.</p> : rules.map((row) => (
                <div key={row.label} className="py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                  <div className="text-muted small">{row.label}</div>
                  <div className="fw-semibold">{row.value}</div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: '#fffbeb', color: '#d97706' }}><FaCalendarAlt /></span>
                <SectionLink to="/optometrist-dashboard/availability">Hours</SectionLink>
              </div>
              {hours.length === 0 ? <p className="text-muted small mb-0">No hours set.</p> : hours.map((row) => (
                <div key={row.day} className="d-flex justify-content-between gap-2 py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                  <span className="fw-semibold">{row.day}</span>
                  <span className="text-muted small text-end">{row.hours}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f9ff', color: '#0284c7' }}><FaCreditCard /></span>
                <SectionLink to="/optometrist-dashboard/memberships-plans">Plan</SectionLink>
              </div>
              <div className="py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                <div className="text-muted small">Membership</div>
                <div className="fw-semibold">{[profile.plan, profile.planPeriod].filter(Boolean).join(' · ') || '—'}</div>
              </div>
              <div className="py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                <div className="text-muted small">Clinic</div>
                <div className="fw-semibold">{profile.store || '—'}</div>
              </div>
              <div className="py-2" style={{ borderTop: '1px solid #eef2f7' }}>
                <div className="text-muted small">Profile</div>
                <SectionLink to="/optometrist-dashboard/profile">Profile & business</SectionLink>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
    </>
  )
}
