import React, { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Country, State } from 'country-state-city'
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCamera,
  FaClock,
  FaSave,
  FaTimes,
  FaUserMd,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { OptometristProfileValidation } from '../../../commondata/formvalidations'
import { MEDIA_BASE_URL } from '../../../utils/config'
import {
  useGetOptometristUserProfileQuery,
  useUpdateOptometristProfileMutation,
} from '../../../redux/features/optometristAPIEndPoint'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')
const IRAN_CODE = 'IR'
const IRAN_DIAL = '۹۸'
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const IRAN_NAME = Country.getCountryByCode(IRAN_CODE)?.name || 'Iran'
const EMPTY_PROFILE = {}

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const relatedLinks = [
  {
    to: '/optometrist-dashboard/services',
    title: 'Services',
    text: 'In-person exams, online consults, follow-ups, and lens advice',
    icon: <FaBriefcase />,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    to: '/optometrist-dashboard/working-rules',
    title: 'Working rules',
    text: 'Visit type, fees, slot duration, and daily capacity',
    icon: <FaClock />,
    color: '#0d9488',
    bg: '#f0fdfa',
  },
  {
    to: '/optometrist-dashboard/availability',
    title: 'Availability',
    text: 'Working hours and time off',
    icon: <FaCalendarAlt />,
    color: '#d97706',
    bg: '#fffbeb',
  },
]

const toEnglishDigits = (value = '') =>
  String(value).replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))

const toIranianDigits = (value = '') =>
  toEnglishDigits(value).replace(/\d/g, (d) => PERSIAN_DIGITS[d])

const localIranPhone = (phone = '') =>
  toIranianDigits(toEnglishDigits(phone).replace(/^\+?98\s*/, '')).replace(/[^۰-۹]/g, '').slice(0, 11)

const asList = (value) => {
  const items = Array.isArray(value) ? value : [value]
  return items.flatMap((item) =>
    String(item || '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
  )
}

const mediaUrl = (src) => {
  if (!src || typeof src !== 'string') return ''
  if (/^(https?:|blob:|data:)/i.test(src)) return src
  return `${MEDIA_BASE_URL.replace(/\/$/, '')}/${src.replace(/^\//, '')}`
}

const asImageList = (value) => {
  if (!value) return []
  const items = Array.isArray(value) ? value : [value]
  return items
    .map((item) => {
      if (item instanceof File) return { url: URL.createObjectURL(item), file: item }
      const src = typeof item === 'string' ? item : item?.url || item?.path || ''
      return src ? { url: mediaUrl(src), file: null } : null
    })
    .filter(Boolean)
}

const FieldError = ({ error, touched }) =>
  error && touched ? <p className="error mb-0 mt-1">{error}</p> : null

function TagPicker({ value, onChange, placeholder }) {
  const [custom, setCustom] = useState('')
  const selected = asList(value)
  const chips = selected

  const toggle = (tag) => {
    const next = selected.includes(tag)
      ? selected.filter((item) => item !== tag)
      : [...selected, tag]
    onChange(next)
  }

  const addCustom = () => {
    const tag = custom.trim()
    if (!tag) return
    const exists = selected.some((item) => item.toLowerCase() === tag.toLowerCase())
    if (!exists) onChange([...selected, tag])
    setCustom('')
  }

  return (
    <>
      {chips.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {chips.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              style={{
                border: '1px solid #bfdbfe',
                background: '#eff6ff',
                color: '#2563eb',
                borderRadius: 999,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addCustom}>
          Add
        </Button>
      </InputGroup>
    </>
  )
}

export default function Profile() {
  const fileRef = useRef(null)
  const storeImageRef = useRef(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const { data, isLoading, refetch } = useGetOptometristUserProfileQuery()
  const [updateProfile, { isLoading: isSaving }] = useUpdateOptometristProfileMutation()
  const profile = data?.data?.userData || data?.data || EMPTY_PROFILE
  const states = useMemo(() => State.getStatesOfCountry(IRAN_CODE), [])
  const resolvedState = useMemo(() => {
    if (profile.state_code && states.some((item) => item.isoCode === profile.state_code)) return profile.state_code
    return states.find((item) => item.name === profile.state)?.isoCode || ''
  }, [profile.state, profile.state_code, states])

  const initialValues = useMemo(() => ({
    name: profile.name || profile.full_name || '',
    specialty: asList(profile.specialty),
    address: profile.address || profile.user_address || '',
    spoken_languages: asList(
      profile.spoken_languages?.length ? profile.spoken_languages : profile.spoken_lang
    ),
    experience: profile.experience || '',
    credentials: profile.credentials || profile.qualification || '',
    about: profile.about || '',
    store_name: profile.store_name || '',
    email: profile.email || '',
    phone_number: localIranPhone(profile.phone_number),
    state: resolvedState,
    profile_pic: profile.profile_pic || '',
    store_images: asImageList(
      profile.store_images || profile.store_image || profile.store_pic || profile.store_photo
    ),
  }), [profile, resolvedState])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: OptometristProfileValidation,
    onSubmit: async (vals) => {
      const selectedState = states.find((item) => item.isoCode === vals.state)
      const formData = new FormData()

      formData.append('name', vals.name?.trim() || '')
      asList(vals.specialty).forEach((item) => formData.append('specialty[]', item))
      asList(vals.spoken_languages).forEach((item) => formData.append('spoken_languages[]', item))
      formData.append('experience', vals.experience?.trim() || '')
      formData.append('store_name', vals.store_name?.trim() || '')
      formData.append('email', vals.email?.trim() || '')
      formData.append(
        'phone_number',
        `+${toEnglishDigits(IRAN_DIAL)} ${toEnglishDigits(vals.phone_number ?? '')}`
      )
      formData.append('country', IRAN_NAME)
      formData.append('country_code', IRAN_CODE)
      formData.append('state', selectedState?.name || vals.state || '')
      formData.append('state_code', selectedState?.isoCode || vals.state || '')
      formData.append('address', vals.address?.trim() || '')
      formData.append('about', vals.about?.trim() || '')
      formData.append('qualification', vals.credentials?.trim() || '')

      if (vals.profile_pic instanceof File) {
        formData.append('profile_pic', vals.profile_pic)
      }
      const storeImages = Array.isArray(vals.store_images) ? vals.store_images : []
      storeImages.forEach((item) => {
        if (item?.file instanceof File) formData.append('store_image[]', item.file)
        else if (item?.url) formData.append('store_image[]', item.url)
      })

      try {
        const response = await updateProfile(formData)
        if (response?.data?.http_status_code === 200) {
          toast.success(response?.data?.message || 'Profile saved successfully')
          setPhotoPreview('')
          refetch()
        }
      } catch (err) {
        console.error(err)
      }
    },
  })

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik

  const displayName = values.name || profile.name || profile.full_name || ''
  const storeName = values.store_name || profile.store_name || ''
  const planName = profile.membership?.plan_name || profile.plan?.name || ''
  const planType = profile.membership?.plan_type || profile.plan_type || ''
  const status = String(profile.optometrist_status || '').toLowerCase()
  const initials = displayName.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase()
  const existingPhoto = typeof values.profile_pic === 'string' ? mediaUrl(values.profile_pic) : ''
  const avatarSrc = photoPreview || existingPhoto
  const storeImages = Array.isArray(values.store_images) ? values.store_images : []
  const planPeriod = planType === 'MONTHLY' ? 'Monthly' : planType === 'YEARLY' ? 'Yearly' : planType
  const statusChip = {
    approved: { label: 'Approved', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    rejected: { label: 'Rejected', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
    pending: { label: 'Pending approval', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  }[status]

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFieldValue('profile_pic', file)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleStoreImageChange = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'))
    if (!files.length) return
    const added = files.map((file) => ({ url: URL.createObjectURL(file), file }))
    setFieldValue('store_images', [...storeImages, ...added])
    event.target.value = ''
  }

  const removeStoreImage = (index) => {
    const item = storeImages[index]
    if (item?.file && item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url)
    setFieldValue('store_images', storeImages.filter((_, i) => i !== index))
    if (storeImageRef.current) storeImageRef.current.value = ''
  }

  const handleIranPhoneChange = (event) => {
    const value = toIranianDigits(event.target.value).replace(/[^۰-۹]/g, '').slice(0, 11)
    setFieldValue('phone_number', value)
  }

  return (
    <>
      {(isLoading || isSaving) && <Loader />}

      <Row>
        <Col>
          <PageHeader
            titles="Profile & Business"
            active="Profile"
            items={['Overview']}
            links={['/optometrist-dashboard/overview']}
          />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex flex-column align-items-center gap-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="position-relative border-0 p-0"
                style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', background: '#eff6ff' }}
                title="Profile image"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="d-flex align-items-center justify-content-center fw-semibold w-100 h-100" style={{ color: '#3b82f6', fontSize: 20 }}>
                    {initials || <FaUserMd />}
                  </span>
                )}
                <span
                  className="position-absolute bottom-0 start-0 end-0 d-flex align-items-center justify-content-center"
                  style={{ height: 22, background: 'rgba(15, 23, 42, 0.55)', color: '#fff', fontSize: 11 }}
                >
                  <FaCamera />
                </span>
              </button>
              <span className="small text-muted">Profile image</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handlePhotoChange} />
            <div>
              <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>
                {displayName}
              </h4>
              {storeName && (
                <p className="text-muted mb-0">{storeName}</p>
              )}
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            {(planName || planPeriod) && (
              <span
                className="d-inline-flex align-items-center"
                style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, overflow: 'hidden' }}
              >
                {planName && <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13 }}>{planName}</span>}
                {planPeriod && (
                  <span className="px-3 py-2" style={{ fontSize: 12, color: '#64748b', borderLeft: planName ? '1px solid #e8edf3' : 'none', background: '#fff' }}>
                    {planPeriod}
                  </span>
                )}
              </span>
            )}
            {statusChip && (
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                style={{ fontSize: 13, background: statusChip.bg, color: statusChip.color, border: `1px solid ${statusChip.border}`, borderRadius: 10 }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusChip.color }} />
                {statusChip.label}
              </span>
            )}
          </div>
        </Card.Body>
      </Card>

      {status === 'pending' && (
        <div className="mb-4 px-3 py-3" style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, color: '#9a3412' }}>
          Your registration is awaiting admin approval. You can still complete your profile and business details.
        </div>
      )}
      {status === 'rejected' && (
        <div className="mb-4 px-3 py-3" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, color: '#991b1b' }}>
          This account was not approved. Update your details and contact admin if you need a review.
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Professional information</h5>
            <p className="text-muted mb-4 small">
              Specialty, languages, and experience shown on your public profile.
            </p>
            <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Full name <span className="required_icon">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FieldError error={errors.name} touched={touched.name} />
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="text"
                  name="experience"
                  placeholder="Enter experience"
                  value={values.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FieldError error={errors.experience} touched={touched.experience} />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Specialty</Form.Label>
              <TagPicker
                value={values.specialty}
                onChange={(next) => setFieldValue('specialty', next)}
                placeholder="Add a specialty"
              />
              <Form.Text className="text-muted">Add the specialties shown on your public profile.</Form.Text>
              <FieldError error={errors.specialty} touched={touched.specialty} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Spoken languages</Form.Label>
              <TagPicker
                value={values.spoken_languages}
                onChange={(next) => setFieldValue('spoken_languages', next)}
                placeholder="Add a language"
              />
              <FieldError error={errors.spoken_languages} touched={touched.spoken_languages} />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Credentials</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="credentials"
                placeholder="Enter credentials"
                value={values.credentials}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FieldError error={errors.credentials} touched={touched.credentials} />
            </Form.Group> */}
            <Form.Group>
              <Form.Label>About</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="about"
                placeholder="Enter about"
                value={values.about}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FieldError error={errors.about} touched={touched.about} />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <h5 className="fw-semibold mb-1">Business details</h5>
            <p className="text-muted mb-4 small">
              Clinic identity and location used for your listing and enquiry bookings.
            </p>
            <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Clinic / store name <span className="required_icon">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="store_name"
                  placeholder="Enter clinic / store name"
                  value={values.store_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FieldError error={errors.store_name} touched={touched.store_name} />
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Email <span className="required_icon">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FieldError error={errors.email} touched={touched.email} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Phone number <span className="required_icon">*</span></Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <span className="me-1">🇮🇷</span>
                    +۹۸
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="phone_number"
                    inputMode="numeric"
                    maxLength={11}
                    dir="ltr"
                    placeholder="Enter phone number"
                    value={values.phone_number}
                    onChange={handleIranPhoneChange}
                    onBlur={handleBlur}
                  />
                </InputGroup>
                <FieldError error={errors.phone_number} touched={touched.phone_number} />
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select value={IRAN_CODE} disabled>
                  <option value={IRAN_CODE}>{IRAN_NAME}</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>State <span className="required_icon">*</span></Form.Label>
                <Form.Select name="state" value={values.state} onChange={handleChange} onBlur={handleBlur}>
                  <option value="">Select</option>
                  {states.map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                  ))}
                </Form.Select>
                <FieldError error={errors.state} touched={touched.state} />
              </Form.Group>
              <Form.Group as={Col} md="6" className="mb-3">
                <Form.Label>Store gallery image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  ref={storeImageRef}
                  onChange={handleStoreImageChange}
                />
                {storeImages.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {storeImages.map((item, index) => (
                      <div key={`${item.url}-${index}`} className="position-relative">
                        <img
                          src={item.url}
                          alt={`${storeName || 'Store'} ${index + 1}`}
                          style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e8edf3' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeStoreImage(index)}
                          title="Remove image"
                          className="d-flex align-items-center justify-content-center border-0"
                          style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#dc2626',
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <FieldError error={errors.store_images} touched={touched.store_images} />
              </Form.Group>
            </Row>
            <Form.Group>
              <Form.Label>Clinic address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                placeholder="Enter clinic address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FieldError error={errors.address} touched={touched.address} />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="fw-semibold">Save profile</div>
              <div className="text-muted small">Services, fees, and calendar stay on their own pages.</div>
            </div>
            <Button type="submit" variant="primary" disabled={isSaving} className="d-inline-flex align-items-center gap-2">
              <FaSave />
              {isSaving ? 'Saving...' : 'Save profile'}
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
