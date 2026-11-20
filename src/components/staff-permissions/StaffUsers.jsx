import { useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import AccessHeader from './AccessHeader'

const ROLES = ['Editor', 'Viewer', 'Admin']
const STAFF = [
  { id: '1', name: 'admin', email: 'admin@example.com', role: 'Admin', active: true },
  { id: '2', name: 'new', email: 'new@example.com', role: 'Editor', active: true },
  { id: '3', name: 'test', email: 'test@example.com', role: 'Viewer', active: false },
  { id: '4', name: 'monu', email: 'monu@example.com', role: 'Viewer', active: true },
]

const fieldStyle = { borderColor: '#e6ebf2', borderRadius: 8, fontSize: 14, background: '#fff', height: 40 }

export default function StaffUsers() {
  const [staff, setStaff] = useState(STAFF)

  return (
    <>
      <AccessHeader page="staff" />
      <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
        <Card.Body className="p-4">
          <h4 className="fw-semibold mb-1">Staff users</h4>
          <p className="text-muted small">Add a person and choose which role they get after login.</p>
          <div className="p-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 12 }}>
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Label className="small text-muted mb-1">Name</Form.Label>
                <Form.Control placeholder="Jane Doe" style={fieldStyle} />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted mb-1">Email</Form.Label>
                <Form.Control type="email" placeholder="jane@example.com" style={fieldStyle} />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted mb-1">Password</Form.Label>
                <Form.Control type="password" placeholder="At least 8 characters" style={fieldStyle} />
              </Col>
              <Col md={2}>
                <Form.Label className="small text-muted mb-1">Role</Form.Label>
                <Form.Select defaultValue={ROLES[0]} style={fieldStyle}>
                  {ROLES.map((name) => <option key={name}>{name}</option>)}
                </Form.Select>
              </Col>
              <Col md="auto">
                <button type="button" className="btn btn-primary" style={{ height: 40 }}>Add user</button>
              </Col>
            </Row>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="w-100" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 720 }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Active', ''].map((heading) => (
                    <th key={heading || 'actions'} style={{ textAlign: 'left', fontSize: 13, color: '#64748b', fontWeight: 700, padding: '10px 12px', borderBottom: '1px solid #eef2f6' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((person) => (
                  <tr key={person.id}>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid #f1f5f9', fontWeight: 600 }}>{person.name}</td>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid #f1f5f9', color: '#475569' }}>{person.email}</td>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid #f1f5f9', width: 180 }}>
                      <Form.Select
                        value={person.role}
                        onChange={(event) => setStaff((current) => current.map((item) => item.id === person.id ? { ...item, role: event.target.value } : item))}
                        style={{ ...fieldStyle, height: 36 }}
                      >
                        {ROLES.map((name) => <option key={name}>{name}</option>)}
                      </Form.Select>
                    </td>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid #f1f5f9' }}>
                      <Form.Check
                        type="switch"
                        checked={person.active}
                        onChange={(event) => setStaff((current) => current.map((item) => item.id === person.id ? { ...item, active: event.target.checked } : item))}
                        aria-label={`${person.name} active`}
                      />
                    </td>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                      <button type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                      <button type="button" className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
