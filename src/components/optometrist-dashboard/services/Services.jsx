import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaEye,
  FaPlus,
  FaRedo,
  FaVideo,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import {
  useAddOptometristServiceMutation,
  useGetOptometristServicesQuery,
  useUpdateOptometristServiceMutation,
} from '../../../redux/features/optometristAPIEndPoint'
import AddEditServiceModal, { VISIT_OPTIONS, needsMeetingLink } from './AddEditServiceModal'

const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '')

const VISIT_META = {
  in_person: { label: 'In-person', icon: <FaEye />, color: '#3b82f6', bg: '#eff6ff' },
  online: { label: 'Online', icon: <FaVideo />, color: '#0ea5e9', bg: '#f0f9ff' },
  both: { label: 'In-person or online', icon: <FaRedo />, color: '#d97706', bg: '#fffbeb' },
}

const VISIT_TO_API = {
  in_person: 'In-person',
  online: 'Online',
  both: 'Both',
}

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const relatedLinks = [
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
  {
    to: '/optometrist-dashboard/appointments',
    title: 'Appointments',
    text: 'Accept or reject enquiry bookings and add the meeting link',
    icon: <FaVideo />,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
]

function isSuccess(response) {
  const body = response?.data
  return body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201
}

function normalizeVisit(value) {
  const raw = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  if (raw === 'online') return 'online'
  if (raw === 'both' || raw === 'in_person_or_online') return 'both'
  if (raw === 'in_person' || raw === 'inperson') return 'in_person'
  return 'in_person'
}

function asList(response) {
  const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []
  return list.filter((item) => item && !item.deletedAt)
}

function normalizeService(item = {}) {
  const visit = item.visit && VISIT_META[item.visit]
    ? item.visit
    : normalizeVisit(item.type_visit)
  return {
    id: item._id || '',
    label: item.service_name || item.label || '',
    description: item.description || '',
    visit,
    meeting_link: item.meeting_link || '',
    status: item.status !== false,
  }
}

function buildPayload(service) {
  return {
    service_name: service.label.trim(),
    type_visit: VISIT_TO_API[service.visit] || 'In-person',
    description: service.description.trim(),
    meeting_link: needsMeetingLink(service.visit) ? service.meeting_link.trim() : null,
    status: service.status !== false,
  }
}

function visitLabel(visit) {
  return VISIT_OPTIONS.find((item) => item.value === visit)?.label || 'In-person'
}

export default function Services() {
  const { data: servicesResponse, isLoading, refetch } = useGetOptometristServicesQuery()
  const [addService, { isLoading: isAdding }] = useAddOptometristServiceMutation()
  const [updateService, { isLoading: isUpdating }] = useUpdateOptometristServiceMutation()
  const [modal, setModal] = useState({ open: false, mode: 'add', service: null, formKey: 0 })

  const services = useMemo(
    () => asList(servicesResponse).map(normalizeService).filter((item) => item.id || item.label),
    [servicesResponse]
  )

  const openAdd = () => setModal({ open: true, mode: 'add', service: null, formKey: Date.now() })
  const openEdit = (service) => setModal({ open: true, mode: 'edit', service, formKey: Date.now() })
  const closeModal = () => setModal((prev) => ({ ...prev, open: false, mode: 'add', service: null }))

  const persist = async (payload, { id, successMessage } = {}) => {
    const response = id
      ? await updateService({ id, ...payload })
      : await addService(payload)

    if (isSuccess(response)) {
      toast.success(response?.data?.message || successMessage)
      refetch()
      return true
    }
    return false
  }

  const toggleService = async (service) => {
    try {
      await persist(
        { ...buildPayload(service), status: !service.status },
        { id: service.id, successMessage: service.status ? 'Service turned off' : 'Service enabled' }
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleModalSubmit = async (service) => {
    if (needsMeetingLink(service.visit) && !service.meeting_link) {
      toast.error(`Add a meeting link for ${service.label}`)
      return
    }

    try {
      const saved = await persist(buildPayload(service), {
        id: modal.mode === 'edit' ? service.id : undefined,
        successMessage: modal.mode === 'edit' ? 'Service updated' : 'Service added',
      })
      if (saved) closeModal()
    } catch (err) {
      console.error(err)
    }
  }

  const enabledCount = services.filter((item) => item.status).length

  return (
    <>
      <style>{`
        .service-status-switch,
        .service-status-switch .form-check-input,
        .service-status-switch .form-check-label {
          cursor: pointer;
        }
      `}</style>
      {(isLoading || isAdding || isUpdating) && <Loader />}

      <Row>
        <Col>
          <PageHeader
            titles="Services"
            active="Services"
            items={['Overview']}
            links={['/optometrist-dashboard/overview']}
          />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>Services you offer</h4>
            <p className="text-muted mb-0">
              Patients only send enquiry bookings. You accept or reject them from Appointments.
            </p>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span
              className="px-3 py-2 fw-semibold"
              style={{ fontSize: 13, background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, color: '#334155' }}
            >
              {enabledCount} of {services.length} offered
            </span>
            <Button type="button" variant="primary" className="d-inline-flex align-items-center gap-2" onClick={openAdd}>
              <FaPlus />
              Add service
            </Button>
          </div>
        </Card.Body>
      </Card>

      {services.length ? (
        <Row className="g-3 mb-4">
          {services.map((service) => {
            const active = !!service.status
            const style = VISIT_META[service.visit] || VISIT_META.in_person
            return (
              <Col key={service.id || service.label} md={6}>
                <Card
                  className="h-100"
                  style={{
                    ...cardStyle,
                    borderColor: active ? '#bfdbfe' : '#e8edf3',
                    background: active ? '#f8fbff' : '#fff',
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <span
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: 40, height: 40, borderRadius: 10, background: style.bg, color: style.color }}
                      >
                        {style.icon}
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => openEdit(service)}
                        >
                          <FaEdit />
                          Edit
                        </Button>
                        <Form.Check
                          type="switch"
                          id={service.id}
                          className="mb-0 service-status-switch"
                          style={{ cursor: 'pointer' }}
                          checked={active}
                          onChange={() => toggleService(service)}
                        />
                      </div>
                    </div>
                    <div className="fw-semibold mt-3 mb-1">{service.label}</div>
                    <p className="text-muted mb-3 small">{service.description || 'No description yet.'}</p>
                    <div className="d-flex flex-wrap gap-2">
                      <span
                        className="px-2 py-1"
                        style={{ fontSize: 12, fontWeight: 600, color: '#64748b', background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 8 }}
                      >
                        {visitLabel(service.visit)}
                      </span>
                      {needsMeetingLink(service.visit) && (
                        service.meeting_link ? (
                          <a
                            href={service.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 text-decoration-none"
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#0d9488',
                              background: '#f0fdfa',
                              border: '1px solid #99f6e4',
                              borderRadius: 8,
                              cursor: 'pointer',
                            }}
                          >
                            Meeting link set
                          </a>
                        ) : (
                          <span
                            className="px-2 py-1"
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#c2410c',
                              background: '#fff7ed',
                              border: '1px solid #fed7aa',
                              borderRadius: 8,
                            }}
                          >
                            Meeting link required
                          </span>
                        )
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      ) : (
        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-5 text-center">
            <p className="text-muted mb-3">No services yet. Add the first service patients can enquire about.</p>
            <Button type="button" variant="primary" className="d-inline-flex align-items-center gap-2" onClick={openAdd}>
              <FaPlus />
              Add service
            </Button>
          </Card.Body>
        </Card>
      )}

      <AddEditServiceModal
        key={modal.formKey}
        show={modal.open}
        mode={modal.mode}
        service={modal.service}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />

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
