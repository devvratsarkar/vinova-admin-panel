import { useMemo, useState } from 'react'
import { Card, Col, Form, Modal, Row } from 'react-bootstrap'
import AccessHeader from './AccessHeader'

const ACTIONS = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'export', label: 'Export' },
]

const GROUPS = [
  { label: 'Overview', modules: ['Dashboard', 'Analytics'] },
  { label: 'Orders', modules: ['All Orders', 'HTO Orders', 'Disputes'] },
  { label: 'Catalogue', modules: ['Category', 'Frame', 'Contact Lenses', 'Accessories', 'Brand', 'Coupon'] },
  { label: 'Inventory', modules: ['Inventory With Variant', 'Inventory Without Variant'] },
  { label: 'Customers', modules: ['User', 'Contact Enquiries', 'Job Application Enquiries'] },
  { label: 'Content', modules: ['All Posts', 'Categories', 'Tags'] },
  { label: 'Settings', modules: ['Global Setting', 'Countries', 'Currency'] },
]

const MODULES = GROUPS.flatMap((group) => group.modules)

function emptyAccess(fill = false) {
  return Object.fromEntries(ACTIONS.map((action) => [action.key, fill]))
}

function accessMap(fill = false, extra = {}) {
  return Object.fromEntries(MODULES.map((name) => [name, { ...emptyAccess(fill), ...(extra[name] || {}) }]))
}

const ROLES = [
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can view and create catalogue and content.',
    users: 0,
    access: accessMap(false, {
      Dashboard: { view: true, create: true },
      Analytics: { view: true },
      Category: { view: true, create: true },
      Frame: { view: true, create: true },
      'Contact Lenses': { view: true, create: true },
      'All Posts': { view: true, create: true },
      Categories: { view: true, create: true },
    }),
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access across the main modules.',
    users: 2,
    access: accessMap(false, Object.fromEntries(MODULES.map((name) => [name, { view: true }]))),
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to every module.',
    users: 1,
    access: accessMap(true),
  },
]

const fieldStyle = { borderColor: '#e6ebf2', borderRadius: 8, fontSize: 14, background: '#fff', height: 40 }
const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }

export default function StaffPermission() {
  const [roleId, setRoleId] = useState(ROLES[0].id)
  const [roles, setRoles] = useState(ROLES)
  const [addOpen, setAddOpen] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [roleNote, setRoleNote] = useState('')

  const role = useMemo(() => roles.find((item) => item.id === roleId) || roles[0], [roles, roleId])

  const setAccess = (moduleName, action, checked) => {
    setRoles((current) => current.map((item) => (
      item.id !== role.id
        ? item
        : { ...item, access: { ...item.access, [moduleName]: { ...item.access[moduleName], [action]: checked } } }
    )))
  }

  const setColumn = (action, checked) => {
    setRoles((current) => current.map((item) => {
      if (item.id !== role.id) return item
      const access = Object.fromEntries(MODULES.map((name) => [name, { ...item.access[name], [action]: checked }]))
      return { ...item, access }
    }))
  }

  const columnChecked = (action) => MODULES.every((name) => role.access[name]?.[action])

  const closeAdd = () => {
    setAddOpen(false)
    setRoleName('')
    setRoleNote('')
  }

  return (
    <>
      <style>{`
        .roles-access-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 16px; align-items: start; }
        @media (max-width: 991px) { .roles-access-layout { grid-template-columns: 1fr; } }
      `}</style>
      <AccessHeader page="permissions" />

      <div className="roles-access-layout">
          <div>
            <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
              <Card.Body className="p-3">
                <div className="px-2 mb-2" style={labelStyle}>Roles</div>
                <div className="d-flex flex-column gap-1">
                  {roles.map((item) => {
                    const selected = item.id === role.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRoleId(item.id)}
                        className="d-flex align-items-center justify-content-between"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          border: `1px solid ${selected ? '#c7d2fe' : 'transparent'}`,
                          background: selected ? '#eef2ff' : 'transparent',
                          color: selected ? '#293896' : '#0f172a',
                          borderRadius: 10,
                          padding: '10px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <span>{item.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>{item.users} {item.users === 1 ? 'user' : 'users'}</span>
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => setAddOpen(true)}
                >
                  Add role
                </button>
              </Card.Body>
            </Card>
          </div>
          <div>
            <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
              <Card.Body className="p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h4 className="fw-semibold mb-1">{role.name}</h4>
                    <p className="text-muted mb-0 small">{role.description}</p>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-primary">Edit</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                    <button type="button" className="btn btn-danger">Delete</button>
                  </div>
                </div>
                <div className="roles-access-table">
                  <table className="w-100" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 640 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', fontSize: 12, letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, padding: '10px 12px', borderBottom: '1px solid #eef2f6' }}>MODULE</th>
                        {ACTIONS.map((action) => (
                          <th key={action.key} style={{ textAlign: 'center', fontSize: 12, letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, padding: '10px 8px', borderBottom: '1px solid #eef2f6', width: 90 }}>
                            <label className="d-inline-flex align-items-center gap-2 mb-0" style={{ cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={columnChecked(action.key)}
                                onChange={(event) => setColumn(action.key, event.target.checked)}
                                style={{ accentColor: '#293896' }}
                              />
                              {action.label.toUpperCase()}
                            </label>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {GROUPS.flatMap((group) => [
                        <tr key={`${group.label}-label`}>
                          <td colSpan={6} style={{ padding: '14px 12px 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#94a3b8' }}>{group.label.toUpperCase()}</td>
                        </tr>,
                        ...group.modules.map((name) => (
                          <tr key={name}>
                            <td style={{ padding: '11px 12px', borderTop: '1px solid #f1f5f9', color: '#0f172a', fontWeight: 500 }}>{name}</td>
                            {ACTIONS.map((action) => (
                              <td key={action.key} style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                                <input
                                  type="checkbox"
                                  aria-label={`${name} ${action.label}`}
                                  checked={Boolean(role.access[name]?.[action.key])}
                                  onChange={(event) => setAccess(name, action.key, event.target.checked)}
                                  style={{ accentColor: '#293896', width: 16, height: 16 }}
                                />
                              </td>
                            ))}
                          </tr>
                        )),
                      ])}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

      <Modal show={addOpen} onHide={closeAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5" className="fw-semibold">Add role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Role name <span className="text-danger">*</span></Form.Label>
            <Form.Control value={roleName} onChange={(event) => setRoleName(event.target.value)} style={fieldStyle} />
          </Form.Group>
          <Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Label>Description</Form.Label>
              <span className="text-muted small">{roleNote.length} / 100</span>
            </div>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={100}
              value={roleNote}
              onChange={(event) => setRoleNote(event.target.value.slice(0, 100))}
              style={{ ...fieldStyle, height: 'auto' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-light" onClick={closeAdd}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={closeAdd}>Add role</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
