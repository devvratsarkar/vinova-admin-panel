import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCalendarTimes,
  FaCheck,
  FaClock,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { OptometristAvailabilityValidation } from '../../../commondata/formvalidations'
import {
  useGetOptometristAvailabilityQuery,
  useGetOptometristWorkingRulesQuery,
  useSaveOptometristAvailabilityMutation,
} from '../../../redux/features/optometristAPIEndPoint'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const DAYS = [
  { key: 'sunday', label: 'Sunday', short: 'Su' },
  { key: 'monday', label: 'Monday', short: 'Mo' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tu' },
  { key: 'wednesday', label: 'Wednesday', short: 'We' },
  { key: 'thursday', label: 'Thursday', short: 'Th' },
  { key: 'friday', label: 'Friday', short: 'Fr' },
  { key: 'saturday', label: 'Saturday', short: 'Sa' },
]

const TIME_OFF_TYPES = [
  { value: 'vacation', label: 'Vacation', text: 'Holiday or planned leave' },
  { value: 'unavailable', label: 'Unavailable', text: 'Clinic closed or blocked' },
]

const relatedLinks = [
  {
    to: '/optometrist-dashboard/working-rules',
    title: 'Working rules',
    text: 'Slot duration, daily capacity, and how enquiries are confirmed',
    icon: <FaClock />,
    color: '#0d9488',
    bg: '#f0fdfa',
  },
  {
    to: '/optometrist-dashboard/appointments',
    title: 'Appointments',
    text: 'Accept or reject enquiry bookings from these hours',
    icon: <FaCheck />,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    to: '/optometrist-dashboard/services',
    title: 'Services',
    text: 'What patients can enquire about, including meeting links',
    icon: <FaBriefcase />,
    color: '#d97706',
    bg: '#fffbeb',
  },
]

const emptyTimeOff = { type: 'vacation', start: '', end: '', note: '' }
const NOTE_MAX = 80

function asText(value) {
  if (value === 0 || value === '0') return '0'
  return value === undefined || value === null || value === '' ? '' : String(value)
}

function asBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

function todayISO() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA
}

function daysInRange(start, end) {
  if (!start || !end || end < start) return 0
  return Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000) + 1
}

function unwrap(response) {
  const body = response?.data !== undefined ? response.data : response
  if (Array.isArray(body)) return body[0] || {}
  if (!body || typeof body !== 'object') return {}
  if (body.availability && typeof body.availability === 'object') return body.availability
  if (body.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
    return body.data.availability || body.data
  }
  return body
}

function emptyHours() {
  return DAYS.reduce((acc, { key }) => {
    acc[key] = { available: false, start: '', end: '' }
    return acc
  }, {})
}

function emptyAvailability() {
  return {
    ...emptyHours(),
    time_off: [],
  }
}

function dayKey(value) {
  const raw = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '')
  return DAYS.find((day) => day.key === raw || day.label.toLowerCase() === raw)?.key
}

function toInputTime(value) {
  const raw = asText(value).toLowerCase().replace(/\s+/g, '')
  if (!raw) return ''
  const match12 = raw.match(/^(\d{1,2}):(\d{2})(am|pm)$/)
  if (match12) {
    let hour = Number(match12[1])
    const minute = match12[2]
    const period = match12[3]
    if (period === 'am') hour = hour === 12 ? 0 : hour
    else hour = hour === 12 ? 12 : hour + 12
    return `${String(hour).padStart(2, '0')}:${minute}`
  }
  const match24 = raw.match(/^(\d{1,2}):(\d{2})$/)
  if (!match24) return ''
  return `${String(Number(match24[1])).padStart(2, '0')}:${match24[2]}`
}

function toApiTime(value) {
  const raw = toInputTime(value)
  if (!raw) return ''
  const [hourText, minute] = raw.split(':')
  const hour = Number(hourText)
  const period = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minute}${period}`
}

function applyDay(hours, item = {}) {
  const key = dayKey(item.day || item.key || item.name)
  if (!key) return
  const start = toInputTime(item.start ?? item.start_time)
  const end = toInputTime(item.end ?? item.end_time)
  hours[key] = {
    available: item.available === undefined && item.is_available === undefined
      ? Boolean(start && end)
      : asBoolean(item.available ?? item.is_available),
    start,
    end,
  }
}

function parseHours(source = {}) {
  const hours = emptyHours()
  const hoursSrc = source.weekly_availability || source.working_hours || source.hours || {}

  if (Array.isArray(hoursSrc)) {
    hoursSrc.forEach((item) => applyDay(hours, item))
  } else {
    DAYS.forEach(({ key }) => {
      const day = hoursSrc[key] || hoursSrc[key.replace(/^./, (letter) => letter.toUpperCase())]
      if (!day) return
      applyDay(hours, { ...day, day: key })
    })
  }

  const dayList = source.days || source.availability_windows
  if (Array.isArray(dayList)) {
    dayList.forEach((item) => applyDay(hours, item))
  }

  return hours
}

function parseTimeOff(source = {}) {
  const list = source.time_off || source.vacations || source.unavailable_periods
  if (!Array.isArray(list)) return []
  return list
    .filter((item) => item && (item.start || item.from || item.end || item.to))
    .map((item, index) => ({
      id: item.id || item._id || `time-off-${index}`,
      type: item.type === 'unavailable' ? 'unavailable' : 'vacation',
      start: item.start || item.from || '',
      end: item.end || item.to || item.start || item.from || '',
      note: item.note || item.reason || '',
    }))
}

function parseAvailability(response) {
  const source = unwrap(response)
  return {
    ...parseHours(source),
    time_off: parseTimeOff(source),
  }
}

function buildPayload(vals) {
  return {
    weekly_availability: DAYS.map(({ key }) => ({
      day: key,
      is_available: !!vals[key]?.available,
      start_time: vals[key]?.available ? toApiTime(vals[key].start) : '',
      end_time: vals[key]?.available ? toApiTime(vals[key].end) : '',
    })),
    time_off: (vals.time_off || []).map(({ type, start, end, note }) => ({
      type,
      start,
      end,
      note: note || '',
    })),
  }
}

function hasSavedAvailability(values) {
  return DAYS.some(({ key }) => values[key]?.available) || Boolean(values.time_off?.length)
}

function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = String(value).split('-')
  return day && month && year ? `${day}/${month}/${year}` : value
}

function minutesBetween(start, end) {
  const [startHour, startMin] = String(start || '').split(':').map(Number)
  const [endHour, endMin] = String(end || '').split(':').map(Number)
  if ([startHour, startMin, endHour, endMin].some((part) => Number.isNaN(part))) return 0
  return endHour * 60 + endMin - (startHour * 60 + startMin)
}

function isSuccess(response) {
  const body = response?.data
  return body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201
}

function validateTimeOffDraft(draft, existing = []) {
  const errors = {}
  const today = todayISO()
  if (!draft.start) errors.start = 'Choose a start date'
  else if (draft.start < today) errors.start = 'Start date cannot be in the past'
  if (!draft.end) errors.end = 'Choose an end date'
  else if (draft.end < today) errors.end = 'End date cannot be in the past'
  else if (draft.start && draft.end < draft.start) errors.end = 'End date must be on or after the start date'
  if (draft.start && draft.end && !errors.start && !errors.end) {
    const overlaps = existing.some((item) => rangesOverlap(draft.start, draft.end, item.start, item.end))
    if (overlaps) errors.end = 'This period overlaps an existing time-off'
  }
  if (draft.note && draft.note.length > NOTE_MAX) errors.note = `Note must be ${NOTE_MAX} characters or fewer`
  return errors
}

function FieldError({ error, touched }) {
  return error && touched ? <p className="error mb-0 mt-1">{error}</p> : null
}

function DayHoursRow({ dayKey, label, short, day, error, touched, onToggle, onTimeChange, onBlur }) {
  const open = !!day.available
  return (
    <div
      className="availability-day-row mb-2 px-3 py-3"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(140px, 180px) minmax(0, 1fr) max-content',
        gap: '12px 16px',
        alignItems: 'center',
        background: open ? '#fff' : '#f8fafc',
        border: `1px solid ${open ? '#dbeafe' : '#e8edf3'}`,
        borderRadius: 12,
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <span
          className="d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: open ? '#eff6ff' : '#fff',
            color: open ? '#2563eb' : '#64748b',
            border: `1px solid ${open ? '#bfdbfe' : '#e8edf3'}`,
            fontSize: 13,
          }}
        >
          {short}
        </span>
        <div className="fw-semibold">{label}</div>
      </div>

      <div className="availability-day-times">
        {open ? (
          <div
            className="d-inline-flex align-items-center"
            style={{
              background: '#f8fafc',
              border: `1px solid ${(error.start && touched.start) || (error.end && touched.end) ? '#f87171' : '#e8edf3'}`,
              borderRadius: 12,
              padding: 6,
            }}
          >
            <Form.Control
              type="time"
              name={`${dayKey}.start`}
              value={day.start}
              onChange={(event) => onTimeChange({ start: event.target.value })}
              onBlur={onBlur}
              className="border-0 shadow-none bg-white"
              style={{ width: 118, height: 38, borderRadius: 8 }}
            />
            <span className="text-muted px-2 small fw-semibold">to</span>
            <Form.Control
              type="time"
              name={`${dayKey}.end`}
              value={day.end}
              min={day.start || undefined}
              onChange={(event) => onTimeChange({ end: event.target.value })}
              onBlur={onBlur}
              className="border-0 shadow-none bg-white"
              style={{ width: 118, height: 38, borderRadius: 8 }}
            />
          </div>
        ) : (
          <span
            className="d-inline-flex align-items-center px-3"
            style={{
              height: 38,
              borderRadius: 999,
              background: '#fff',
              border: '1px solid #e8edf3',
              color: '#94a3b8',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Closed
          </span>
        )}
        <FieldError error={error.start} touched={touched.start} />
        <FieldError error={error.end} touched={touched.end} />
      </div>

      <Form.Check
        type="switch"
        id={`${dayKey}-available`}
        label={<span className="fw-semibold" style={{ color: open ? '#2563eb' : '#64748b' }}>{open ? 'Open' : 'Closed'}</span>}
        className="availability-day-switch mb-0"
        checked={open}
        onChange={(event) => onToggle(event.target.checked)}
      />
    </div>
  )
}

export default function Availability() {
  const { data: availabilityResponse, isLoading, refetch } = useGetOptometristAvailabilityQuery()
  const [saveAvailability, { isLoading: isSaving }] = useSaveOptometristAvailabilityMutation()
  const { data: rulesResponse } = useGetOptometristWorkingRulesQuery()
  const rules = unwrap(rulesResponse)
  const slotMinutes = Number(rules.duration || rules.duration_per_slot || rules.slot_duration) || 0
  const dailyCapacity = Number(rules.daily_capacity || rules.max_patients_per_day) || 0
  const [timeOffDraft, setTimeOffDraft] = useState(emptyTimeOff)
  const [timeOffErrors, setTimeOffErrors] = useState({})
  const [timeOffTouched, setTimeOffTouched] = useState({})
  const minDate = todayISO()

  const initialValues = useMemo(() => {
    const fromApi = availabilityResponse ? parseAvailability(availabilityResponse) : emptyAvailability()
    return hasSavedAvailability(fromApi) ? fromApi : emptyAvailability()
  }, [availabilityResponse])

  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: OptometristAvailabilityValidation,
    onSubmit: async (vals) => {
      try {
        const response = await saveAvailability(buildPayload(vals))
        if (isSuccess(response)) {
          toast.success(response?.data?.message || 'Availability saved successfully')
          refetch()
        }
      } catch (err) {
        console.error(err)
      }
    },
  })

  const openDays = DAYS.filter(({ key }) => values[key]?.available)
  const upcomingTimeOff = [...(values.time_off || [])].sort((a, b) => String(a.start).localeCompare(String(b.start)))

  const updateDay = (key, patch) => {
    const current = values[key] || { available: false, start: '', end: '' }
    const next = { ...current, ...patch }
    if (patch.available && !next.start) next.start = '09:00'
    if (patch.available && !next.end) next.end = '17:00'
    setFieldValue(key, next)
    if (patch.start !== undefined) setFieldTouched(`${key}.start`, true, false)
    if (patch.end !== undefined) setFieldTouched(`${key}.end`, true, false)
  }

  const changeTimeOff = (patch) => {
    setTimeOffDraft((prev) => {
      const next = { ...prev, ...patch }
      if (patch.start && next.end && patch.start > next.end) next.end = ''
      setTimeOffErrors(validateTimeOffDraft(next, values.time_off))
      return next
    })
    setTimeOffTouched((prev) => ({
      ...prev,
      ...(patch.start !== undefined ? { start: true } : {}),
      ...(patch.end !== undefined ? { end: true } : {}),
      ...(patch.note !== undefined ? { note: true } : {}),
    }))
  }

  const addTimeOff = () => {
    const nextErrors = validateTimeOffDraft(timeOffDraft, values.time_off)
    setTimeOffTouched({ start: true, end: true, note: true })
    setTimeOffErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setFieldValue('time_off', [
      ...values.time_off,
      { ...timeOffDraft, id: `time-off-${Date.now()}`, note: timeOffDraft.note.trim() },
    ])
    setTimeOffDraft(emptyTimeOff)
    setTimeOffErrors({})
    setTimeOffTouched({})
  }

  const removeTimeOff = (id) => {
    const remaining = values.time_off.filter((item) => item.id !== id)
    setFieldValue('time_off', remaining)
    if (timeOffDraft.start || timeOffDraft.end) {
      setTimeOffErrors(validateTimeOffDraft(timeOffDraft, remaining))
    }
  }

  return (
    <>
      {(isLoading || isSaving) && <Loader />}

      <Row>
        <Col>
          <PageHeader
            titles="Availability"
            active="Availability"
            items={['Overview']}
            links={['/optometrist-dashboard/overview']}
          />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>When patients can enquire</h4>
            <p className="text-muted mb-0">
              Working hours and time off build the calendar. Bookings stay enquiry-based.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {openDays.length || '—'} days open
            </span>
            <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              {upcomingTimeOff.length} time-off {upcomingTimeOff.length === 1 ? 'period' : 'periods'}
            </span>
          </div>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Working hours by day</h5>
            <p className="text-muted mb-4 small">
              These availability windows are what patients see as bookable times.
            </p>
            <style>
              {`@media (max-width: 991px) {
                .availability-day-row {
                  grid-template-columns: 1fr max-content !important;
                }
                .availability-day-row .availability-day-switch {
                  grid-column: 2;
                  grid-row: 1;
                }
                .availability-day-row .availability-day-times {
                  grid-column: 1 / -1;
                  grid-row: 2;
                }
              }`}
            </style>
            {DAYS.map(({ key, label, short }) => (
              <DayHoursRow
                key={key}
                dayKey={key}
                label={label}
                short={short}
                day={values[key] || { available: false, start: '', end: '' }}
                error={errors[key] || {}}
                touched={touched[key] || {}}
                onToggle={(available) => updateDay(key, { available })}
                onTimeChange={(patch) => updateDay(key, patch)}
                onBlur={handleBlur}
              />
            ))}
            {errors.hours && (touched.hours || openDays.length === 0) ? (
              <p className="error mb-0">{errors.hours}</p>
            ) : null}
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Time off and unavailable periods</h5>
            <p className="text-muted mb-4 small">
              Vacations and blocked dates hide those days from the enquiry calendar.
            </p>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {TIME_OFF_TYPES.map((item) => {
                const active = timeOffDraft.type === item.value
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => changeTimeOff({ type: item.value })}
                    className="text-start px-3 py-2"
                    style={{
                      minWidth: 180,
                      background: active ? '#f8fbff' : '#fff',
                      border: `1px solid ${active ? '#bfdbfe' : '#e8edf3'}`,
                      borderRadius: 10,
                    }}
                  >
                    <div className="fw-semibold">{item.label}</div>
                    <div className="text-muted small">{item.text}</div>
                  </button>
                )
              })}
            </div>

            <div className="p-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
              <Row className="g-3 align-items-start">
                <Form.Group as={Col} md={3}>
                  <Form.Label className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 600 }}>From</Form.Label>
                  <Form.Control
                    type="date"
                    value={timeOffDraft.start}
                    min={minDate}
                    onChange={(event) => changeTimeOff({ start: event.target.value })}
                    isInvalid={!!(timeOffTouched.start && timeOffErrors.start)}
                  />
                  <FieldError error={timeOffErrors.start} touched={timeOffTouched.start} />
                </Form.Group>
                <Form.Group as={Col} md={3}>
                  <Form.Label className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 600 }}>To</Form.Label>
                  <Form.Control
                    type="date"
                    value={timeOffDraft.end}
                    min={timeOffDraft.start || minDate}
                    disabled={!timeOffDraft.start}
                    onChange={(event) => changeTimeOff({ end: event.target.value })}
                    isInvalid={!!(timeOffTouched.end && timeOffErrors.end)}
                  />
                  <FieldError error={timeOffErrors.end} touched={timeOffTouched.end} />
                </Form.Group>
                <Form.Group as={Col} md>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="text-muted mb-0" style={{ fontSize: 12, fontWeight: 600 }}>
                      Note (optional)
                    </Form.Label>
                    <span className="text-muted" style={{ fontSize: 12 }}>{timeOffDraft.note.length}/{NOTE_MAX}</span>
                  </div>
                  <Form.Control
                    placeholder="Clinic closed, conference, holiday..."
                    maxLength={NOTE_MAX}
                    value={timeOffDraft.note}
                    onChange={(event) => changeTimeOff({ note: event.target.value })}
                    isInvalid={!!(timeOffTouched.note && timeOffErrors.note)}
                  />
                  <FieldError error={timeOffErrors.note} touched={timeOffTouched.note} />
                </Form.Group>
                <Col md="auto">
                  <Form.Label className="text-muted mb-2 invisible d-block" style={{ fontSize: 12, fontWeight: 600 }}>Add</Form.Label>
                  <Button
                    type="button"
                    variant="primary"
                    className="d-inline-flex align-items-center justify-content-center gap-2 px-3 text-nowrap"
                    style={{ width: 'auto' }}
                    onClick={addTimeOff}
                    disabled={!timeOffDraft.start || !timeOffDraft.end}
                  >
                    <FaPlus />
                    Add period
                  </Button>
                </Col>
              </Row>
            </div>

            <div>
              {upcomingTimeOff.length === 0 ? (
                <div className="px-3 py-3 text-muted small" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  No vacations or unavailable periods yet.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {upcomingTimeOff.map((item) => {
                    const days = daysInRange(item.start, item.end)
                    const unavailable = item.type === 'unavailable'
                    return (
                      <div
                        key={item.id}
                        className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 py-3"
                        style={{
                          background: unavailable ? '#fff1f2' : '#fff7ed',
                          border: `1px solid ${unavailable ? '#fecdd3' : '#ffedd5'}`,
                          borderRadius: 10,
                        }}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <span
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: unavailable ? '#fff1f2' : '#fff7ed',
                              color: unavailable ? '#be123c' : '#c2410c',
                            }}
                          >
                            <FaCalendarTimes />
                          </span>
                          <div>
                            <div className="fw-semibold">
                              {unavailable ? 'Unavailable' : 'Vacation'}
                              <span className="text-muted fw-normal small ms-2">
                                {days} {days === 1 ? 'day' : 'days'}
                              </span>
                            </div>
                            <div className="text-muted small">
                              {formatDate(item.start)} – {formatDate(item.end)}
                              {item.note ? ` · ${item.note}` : ''}
                            </div>
                          </div>
                        </div>
                        <Button type="button" variant="link" className="text-danger p-0 d-inline-flex align-items-center gap-2" onClick={() => removeTimeOff(item.id)}>
                          <FaTrash />
                          Remove
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
              <FieldError error={typeof errors.time_off === 'string' ? errors.time_off : ''} touched={upcomingTimeOff.length > 0} />
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="fw-semibold">Save availability</div>
              <div className="text-muted small">
                {openDays.length > 0 && slotMinutes >= 5 && dailyCapacity >= 1
                  ? `${openDays[0].label} ${values[openDays[0].key].start}–${values[openDays[0].key].end} can fit up to ${Math.max(0, Math.floor(minutesBetween(values[openDays[0].key].start, values[openDays[0].key].end) / slotMinutes))} slots of ${slotMinutes} minutes, but Working rules cap you at ${dailyCapacity} patients per day.`
                  : 'Slot length, daily capacity, and confirmation stay on Working rules.'}
              </div>
            </div>
            <Button type="submit" variant="primary" disabled={isSaving} className="d-inline-flex align-items-center gap-2">
              <FaCalendarAlt />
              {isSaving ? 'Saving...' : 'Save availability'}
            </Button>
          </Card.Body>
        </Card>
      </Form>

      <Row className="g-3 mb-4">
        {relatedLinks.map((item) => (
          <Col key={item.to} md={4}>
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
    </>
  )
}
