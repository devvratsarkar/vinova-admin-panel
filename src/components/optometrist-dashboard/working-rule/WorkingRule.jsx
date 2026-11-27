import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  // FaClock,
  FaSave,
  FaUserClock,
  FaVideo,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { OptometristWorkingRulesValidation } from '../../../commondata/formvalidations'
import {
  useGetOptometristUserProfileQuery,
  useGetOptometristWorkingRulesQuery,
  useSaveOptometristWorkingRulesMutation,
} from '../../../redux/features/optometristAPIEndPoint'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const VISIT_TYPES = [
  { value: 'in_person', label: 'In-person', text: 'Clinic visits only', icon: <FaUserClock />, color: '#3b82f6', bg: '#eff6ff' },
  { value: 'online', label: 'Online', text: 'Remote consults only', icon: <FaVideo />, color: '#0ea5e9', bg: '#f0f9ff' },
  { value: 'both', label: 'Both', text: 'Patients can enquire for either', icon: <FaClock />, color: '#0d9488', bg: '#f0fdfa' },
]

const CONFIRMATION_OPTIONS = [
  {
    value: 'manual',
    label: 'Manual accept / reject',
    text: 'Enquiry bookings stay pending until you accept or reject them from Appointments.',
  },
  {
    value: 'auto',
    label: 'Auto-confirm',
    text: 'The enquiry is confirmed as soon as the patient books an available slot. You still get a notification.',
  },
]

const relatedLinks = [
  {
    to: '/optometrist-dashboard/services',
    title: 'Services',
    text: 'What patients can enquire about, including online meeting links',
    icon: <FaBriefcase />,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    to: '/optometrist-dashboard/availability',
    title: 'Availability',
    text: 'Working hours and time off',
    icon: <FaCalendarAlt />,
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    to: '/optometrist-dashboard/appointments',
    title: 'Appointments',
    text: 'Accept or reject enquiry bookings',
    icon: <FaCheck />,
    color: '#0d9488',
    bg: '#f0fdfa',
  },
]

const VISIT_TO_API = {
  in_person: 'In-person',
  online: 'Online',
  both: 'Both',
}

function asText(value) {
  if (value === 0 || value === '0') return '0'
  return value === undefined || value === null || value === '' ? '' : String(value)
}

function emptyRules() {
  return {
    type_of_visit: '',
    in_person_fee: '',
    online_fee: '',
    duration_per_slot: '',
    daily_capacity: '',
    booking_confirmation: '',
    in_person_duration: '',
    online_duration: '',
    in_person_capacity: '',
    online_capacity: '',
    in_person_confirmation: '',
    online_confirmation: '',
  }
}

function unwrapRules(response) {
  const body = response?.data !== undefined ? response.data : response
  if (Array.isArray(body)) return body[0] || {}
  if (!body || typeof body !== 'object') return {}
  if (body.working_rules && typeof body.working_rules === 'object') return body.working_rules
  if (body.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
    return body.data.working_rules || body.data
  }
  return body
}

function normalizeVisit(value) {
  const raw = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  if (raw === 'online') return 'online'
  if (raw === 'both' || raw === 'in_person_or_online') return 'both'
  if (raw === 'in_person' || raw === 'inperson' || raw === 'offline') return 'in_person'
  return ''
}

function feeValue(source = {}, key) {
  const fee = source.consultation_fee
  if (fee && typeof fee === 'object') {
    return asText(fee[key] ?? fee[key === 'in_person' ? 'offline' : 'online'])
  }
  if (fee !== undefined && fee !== null && fee !== '') return asText(fee)
  return asText(source[`${key}_fee`] ?? source[`${key}_consultation_fee`])
}

function sideValue(value, side) {
  if (value && typeof value === 'object') {
    return value[side] ?? (side === 'in_person' ? value.offline : value.online)
  }
  return value
}

function confirmationValue(value) {
  const confirmation = String(value || '').toLowerCase()
  return confirmation === 'auto' || confirmation === 'manual' ? confirmation : ''
}

function visitFromProfile(profile = {}, response) {
  const raw =
    profile.selected_working_rule ??
    response?.data?.selected_working_rule ??
    response?.selected_working_rule
  return normalizeVisit(raw) || 'in_person'
}

function parseRules(source = {}, visitType = '') {
  const rules = unwrapRules(source)
  const visit = normalizeVisit(visitType) || normalizeVisit(rules.type_visit || rules.type_of_visit || rules.visit_type)
  const duration = rules.duration ?? rules.duration_per_slot ?? rules.slot_duration
  const capacity = rules.daily_capacity ?? rules.max_patients_per_day
  const confirmation = rules.booking_confirmation
  const activeSide = visit === 'online' ? 'online' : 'in_person'
  return {
    type_of_visit: visit,
    in_person_fee: feeValue(rules, 'in_person'),
    online_fee: feeValue(rules, 'online'),
    duration_per_slot: asText(sideValue(duration, activeSide)),
    daily_capacity: asText(sideValue(capacity, activeSide)),
    booking_confirmation: confirmationValue(sideValue(confirmation, activeSide)),
    in_person_duration: asText(sideValue(duration, 'in_person')),
    online_duration: asText(sideValue(duration, 'online')),
    in_person_capacity: asText(sideValue(capacity, 'in_person')),
    online_capacity: asText(sideValue(capacity, 'online')),
    in_person_confirmation: confirmationValue(sideValue(confirmation, 'in_person')),
    online_confirmation: confirmationValue(sideValue(confirmation, 'online')),
  }
}

function sideSaved(parsed, side) {
  const prefix = side === 'online' ? 'online' : 'in_person'
  return Number(parsed[`${prefix}_duration`]) > 0 || Number(parsed[`${prefix}_capacity`]) > 0
}

function fieldsForSide(side, parsed) {
  if (side === 'online') {
    return {
      online_fee: parsed.online_fee,
      online_duration: parsed.online_duration || parsed.duration_per_slot,
      online_capacity: parsed.online_capacity || parsed.daily_capacity,
      online_confirmation: parsed.online_confirmation || parsed.booking_confirmation,
    }
  }
  return {
    in_person_fee: parsed.in_person_fee,
    in_person_duration: parsed.in_person_duration || parsed.duration_per_slot,
    in_person_capacity: parsed.in_person_capacity || parsed.daily_capacity,
    in_person_confirmation: parsed.in_person_confirmation || parsed.booking_confirmation,
  }
}

function prefillBoth(bothSource, inPersonSource, onlineSource) {
  const bothParsed = bothSource ? parseRules(bothSource, 'both') : emptyRules()
  const next = { ...bothParsed, type_of_visit: 'both' }
  if (inPersonSource && !sideSaved(bothParsed, 'in_person')) {
    Object.assign(next, fieldsForSide('in_person', parseRules(inPersonSource, 'in_person')))
  }
  if (onlineSource && !sideSaved(bothParsed, 'online')) {
    Object.assign(next, fieldsForSide('online', parseRules(onlineSource, 'online')))
  }
  return next
}

function buildPayload(vals) {
  const isBoth = vals.type_of_visit === 'both'
  const offersInPerson = vals.type_of_visit === 'in_person' || isBoth
  const offersOnline = vals.type_of_visit === 'online' || isBoth
  const consultation_fee = {}
  const duration = {}
  const daily_capacity = {}
  const booking_confirmation = {}

  if (offersInPerson) {
    consultation_fee.in_person = Number(vals.in_person_fee)
    duration.in_person = Number(isBoth ? vals.in_person_duration : vals.duration_per_slot)
    daily_capacity.in_person = Number(isBoth ? vals.in_person_capacity : vals.daily_capacity)
    booking_confirmation.in_person = isBoth ? vals.in_person_confirmation : vals.booking_confirmation
  }
  if (offersOnline) {
    consultation_fee.online = Number(vals.online_fee)
    duration.online = Number(isBoth ? vals.online_duration : vals.duration_per_slot)
    daily_capacity.online = Number(isBoth ? vals.online_capacity : vals.daily_capacity)
    booking_confirmation.online = isBoth ? vals.online_confirmation : vals.booking_confirmation
  }

  return {
    type_visit: VISIT_TO_API[vals.type_of_visit],
    consultation_fee,
    duration,
    daily_capacity,
    booking_confirmation,
  }
}

function isSuccess(response) {
  const body = response?.data
  return body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201
}

function FieldError({ error, touched }) {
  return error && touched ? <p className="error mb-0 mt-1">{error}</p> : null
}

function ChoiceCard({ active, onClick, icon, color, bg, title, text }) {
  return (
    <Card
      className="h-100"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      style={{
        ...cardStyle,
        borderColor: active ? '#bfdbfe' : '#e8edf3',
        background: active ? '#f8fbff' : '#fff',
        cursor: 'pointer',
      }}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start gap-3">
          {icon && (
            <span className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: bg, color }}>
              {icon}
            </span>
          )}
          {active && (
            <span className="d-flex align-items-center justify-content-center" style={{ width: 22, height: 22, borderRadius: '50%', background: '#eff6ff', color: '#2563eb' }}>
              <FaCheck size={11} />
            </span>
          )}
        </div>
        <div className="fw-semibold mt-3 mb-1">{title}</div>
        <p className="text-muted mb-0 small">{text}</p>
      </Card.Body>
    </Card>
  )
}

function NumberField({ label, name, min, step, md = 6, values, errors, touched, onChange, onBlur }) {
  return (
    <Form.Group as={Col} md={md} className="mb-3">
      <Form.Label>{label} <span className="required_icon">*</span></Form.Label>
      <Form.Control
        type="number"
        name={name}
        min={min}
        step={step}
        placeholder="0"
        value={values[name]}
        onChange={onChange}
        onBlur={onBlur}
      />
      <FieldError error={errors[name]} touched={touched[name]} />
    </Form.Group>
  )
}

function ConfirmationChoices({ name, value, error, touched, onSelect }) {
  return (
    <>
      <div className="d-flex flex-column gap-3">
        {CONFIRMATION_OPTIONS.map((item) => (
          <ChoiceCard
            key={item.value}
            active={value === item.value}
            onClick={() => onSelect(name, item.value)}
            title={item.label}
            text={item.text}
          />
        ))}
      </div>
      <FieldError error={error} touched={touched} />
    </>
  )
}

export default function WorkingRule() {
  const [clickedVisitType, setClickedVisitType] = useState('')
  const { data: profileResponse, isLoading: isProfileLoading } = useGetOptometristUserProfileQuery()
  const profile = profileResponse?.data?.userData || profileResponse?.data || {}
  const visitType = clickedVisitType || (profileResponse ? visitFromProfile(profile, profileResponse) : '')
  const needsSideRules = visitType === 'both'
  const { data: rulesResponse, isLoading, isFetching, refetch } = useGetOptometristWorkingRulesQuery(
    { visit_type: visitType },
    { skip: !visitType }
  )
  const {
    data: inPersonRulesResponse,
    isLoading: isInPersonLoading,
    isFetching: isInPersonFetching,
  } = useGetOptometristWorkingRulesQuery({ visit_type: 'in_person' }, { skip: !needsSideRules })
  const {
    data: onlineRulesResponse,
    isLoading: isOnlineLoading,
    isFetching: isOnlineFetching,
  } = useGetOptometristWorkingRulesQuery({ visit_type: 'online' }, { skip: !needsSideRules })
  const [saveWorkingRules, { isLoading: isSaving }] = useSaveOptometristWorkingRulesMutation()
  const currency = '$'
  const initialValues = useMemo(() => {
    if (visitType === 'both') return prefillBoth(rulesResponse, inPersonRulesResponse, onlineRulesResponse)
    const parsed = rulesResponse ? parseRules(rulesResponse, visitType) : emptyRules()
    return { ...parsed, type_of_visit: visitType || parsed.type_of_visit }
  }, [rulesResponse, inPersonRulesResponse, onlineRulesResponse, visitType])

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: OptometristWorkingRulesValidation,
    onSubmit: async (vals) => {
      try {
        const response = await saveWorkingRules(buildPayload(vals))
        if (isSuccess(response)) {
          toast.success(response?.data?.message || 'Working rules saved successfully')
          refetch()
        }
      } catch (err) {
        console.error(err)
      }
    },
  })

  const visitMeta = VISIT_TYPES.find((item) => item.value === values.type_of_visit)
  const confirmationMeta = CONFIRMATION_OPTIONS.find((item) => item.value === values.booking_confirmation)
  const showInPersonFee = values.type_of_visit === 'in_person' || values.type_of_visit === 'both'
  const showOnlineFee = values.type_of_visit === 'online' || values.type_of_visit === 'both'
  const isBoth = values.type_of_visit === 'both'
  const slotMinutes = Number(values.duration_per_slot) || 0
  const capacity = Number(values.daily_capacity) || 0
  const inPersonMinutes = Number(values.in_person_duration) || 0
  const onlineMinutes = Number(values.online_duration) || 0
  const inPersonCapacity = Number(values.in_person_capacity) || 0
  const onlineCapacity = Number(values.online_capacity) || 0
  const inPersonConfirmation = CONFIRMATION_OPTIONS.find((item) => item.value === values.in_person_confirmation)
  const onlineConfirmation = CONFIRMATION_OPTIONS.find((item) => item.value === values.online_confirmation)
  const fieldProps = { values, errors, touched, onChange: handleChange, onBlur: handleBlur }

  return (
    <>
      {(isProfileLoading || isLoading || isFetching || isSaving || (needsSideRules && (isInPersonLoading || isInPersonFetching || isOnlineLoading || isOnlineFetching))) && <Loader />}

      <Row>
        <Col>
          <PageHeader
            titles="Working rules"
            active="Working rules"
            items={['Overview']}
            links={['/optometrist-dashboard/overview']}
          />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>How patients can book you</h4>
            <p className="text-muted mb-0">
              Visit type, fees, slot length, and daily capacity. Bookings are enquiry-based.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {visitMeta && (
              <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                {visitMeta.label}
              </span>
            )}
            {isBoth ? (
              <>
                <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  In-person {inPersonMinutes || '—'} min · {inPersonCapacity || '—'} / day
                </span>
                <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  Online {onlineMinutes || '—'} min · {onlineCapacity || '—'} / day
                </span>
                {inPersonConfirmation && (
                  <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                    In-person {inPersonConfirmation.label}
                  </span>
                )}
                {onlineConfirmation && (
                  <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                    Online {onlineConfirmation.label}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  {slotMinutes || '—'} min slots
                </span>
                <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  Max {capacity || '—'} / day
                </span>
                {confirmationMeta && (
                  <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                    {confirmationMeta.label}
                  </span>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <Form noValidate onSubmit={handleSubmit}>
        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Type of visit</h5>
            <p className="text-muted mb-4 small">Online or in-person. This applies to enquiry bookings.</p>
            <Row className="g-3">
              {VISIT_TYPES.map((item) => (
                <Col key={item.value} md={4}>
                  <ChoiceCard
                    active={values.type_of_visit === item.value}
                    onClick={() => {
                      setFieldValue('type_of_visit', item.value)
                      setClickedVisitType(item.value)
                    }}
                    icon={item.icon}
                    color={item.color}
                    bg={item.bg}
                    title={item.label}
                    text={item.text}
                  />
                </Col>
              ))}
            </Row>
            <FieldError error={errors.type_of_visit} touched={touched.type_of_visit} />
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Consultation fees</h5>
            <p className="text-muted mb-4 small">Shown when a patient sends an enquiry. Amounts are in USD.</p>
            <Row>
              {showInPersonFee && (
                <Form.Group as={Col} md={showOnlineFee ? 6 : 12} className="mb-3">
                  <Form.Label>In-person fee <span className="required_icon">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{currency}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="in_person_fee"
                      min={0}
                      step={1}
                      placeholder="0"
                      value={values.in_person_fee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <FieldError error={errors.in_person_fee} touched={touched.in_person_fee} />
                </Form.Group>
              )}
              {showOnlineFee && (
                <Form.Group as={Col} md={showInPersonFee ? 6 : 12} className="mb-0">
                  <Form.Label>Online fee <span className="required_icon">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{currency}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="online_fee"
                      min={0}
                      step={1}
                      placeholder="0"
                      value={values.online_fee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <FieldError error={errors.online_fee} touched={touched.online_fee} />
                </Form.Group>
              )}
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Slots and daily capacity</h5>
            <p className="text-muted mb-4 small">
              {isBoth
                ? 'Set slot length and daily capacity separately for in-person and online enquiries.'
                : 'Slot length is used to build available times. Daily capacity caps how many patients you take in a day.'}
            </p>
            {isBoth ? (
              <>
                <Row>
                  <NumberField label="In-person duration (minutes)" name="in_person_duration" min={1} step={1} {...fieldProps} />
                  <NumberField label="Online duration (minutes)" name="online_duration" min={1} step={1} {...fieldProps} />
                </Row>
                <Row>
                  <NumberField label="In-person daily capacity" name="in_person_capacity" min={1} step={1} {...fieldProps} />
                  <NumberField label="Online daily capacity" name="online_capacity" min={1} step={1} {...fieldProps} />
                </Row>
                {inPersonMinutes >= 5 && onlineMinutes >= 5 && inPersonCapacity >= 1 && onlineCapacity >= 1 && (
                  <div className="px-3 py-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, color: '#475569', fontSize: 13 }}>
                    In-person patients see {inPersonMinutes}-minute slots, up to {inPersonCapacity} bookings a day. Online patients see {onlineMinutes}-minute slots, up to {onlineCapacity} bookings a day.
                  </div>
                )}
              </>
            ) : (
              <>
                <Row>
                  <NumberField label="Duration per slot (minutes)" name="duration_per_slot" min={1} step={1} {...fieldProps} />
                  <NumberField label="Daily capacity (max patients)" name="daily_capacity" min={1} step={1} {...fieldProps} />
                </Row>
                {slotMinutes >= 5 && capacity >= 1 && (
                  <div className="px-3 py-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, color: '#475569', fontSize: 13 }}>
                    Patients see {slotMinutes}-minute slots. You will not receive more than {capacity} enquiry bookings per day, even if hours remain on the calendar.
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Booking confirmation</h5>
            <p className="text-muted mb-4 small">
              {isBoth
                ? 'Choose confirmation separately for in-person and online enquiries.'
                : 'Only enquiry bookings are used. Choose whether you confirm them yourself or let the system auto-confirm.'}
            </p>
            {isBoth ? (
              <Row className="g-3">
                <Col md={6}>
                  <div className="fw-semibold mb-3">In-person</div>
                  <ConfirmationChoices
                    name="in_person_confirmation"
                    value={values.in_person_confirmation}
                    error={errors.in_person_confirmation}
                    touched={touched.in_person_confirmation}
                    onSelect={setFieldValue}
                  />
                </Col>
                <Col md={6}>
                  <div className="fw-semibold mb-3">Online</div>
                  <ConfirmationChoices
                    name="online_confirmation"
                    value={values.online_confirmation}
                    error={errors.online_confirmation}
                    touched={touched.online_confirmation}
                    onSelect={setFieldValue}
                  />
                </Col>
              </Row>
            ) : (
              <>
                <Row className="g-3">
                  {CONFIRMATION_OPTIONS.map((item) => (
                    <Col key={item.value} md={6}>
                      <ChoiceCard
                        active={values.booking_confirmation === item.value}
                        onClick={() => setFieldValue('booking_confirmation', item.value)}
                        title={item.label}
                        text={item.text}
                      />
                    </Col>
                  ))}
                </Row>
                <FieldError error={errors.booking_confirmation} touched={touched.booking_confirmation} />
              </>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="fw-semibold">Save working rules</div>
              <div className="text-muted small">Working hours and time off stay on Availability.</div>
            </div>
            <Button type="submit" variant="primary" disabled={isSaving} className="d-inline-flex align-items-center gap-2">
              <FaSave />
              {isSaving ? 'Saving...' : 'Save working rules'}
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
