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
        body:has(.roles-access-page),
        .horizontalMenucontainer:has(.roles-access-page),
        .app-content:has(.roles-access-page) { overflow: visible !important; }
        .roles-access-page { display: flow-root; min-width: 0; }
        .roles-access-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 16px; align-items: start; min-width: 0; }
        .roles-access-roles, .roles-access-main { min-width: 0; }
        .roles-access-roles { align-self: start; }
        .roles-access-panel { padding: 20px 24px 24px; }
        .roles-access-summary { padding-bottom: 16px; margin-bottom: 8px; border-bottom: 1px solid #e8edf3; }
        .roles-access-summary h4 { margin: 0 0 2px; font-size: 18px; font-weight: 700; color: #0f172a; }
        .roles-access-summary p { margin: 0 0 14px; color: #64748b; font-size: 14px; }
        .roles-access-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .roles-access-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 8px; font-size: 14px; font-weight: 400; line-height: 1; }
        .roles-access-role { gap: 12px; }
        .roles-access-check-label { display: none; }
        .roles-access-check input,
        .roles-access-colhead input { width: 16px; height: 16px; margin: 0; accent-color: #293896; }
        .roles-access-table { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .roles-access-table table { min-width: 640px; border-collapse: separate; border-spacing: 0; }
        .roles-access-table::-webkit-scrollbar { width: 8px; height: 8px; }
        .roles-access-table::-webkit-scrollbar-thumb { background: #c5cee0; border-radius: 8px; }
        .roles-access-th { text-align: center; font-size: 12px; letter-spacing: 0.05em; color: #64748b; font-weight: 700; padding: 10px 8px; border-bottom: 1px solid #eef2f6; width: 90px; white-space: nowrap; }
        .roles-access-th--module { text-align: left; width: auto; padding: 10px 12px; }
        .roles-access-colhead { display: inline-flex; align-items: center; gap: 8px; margin: 0; cursor: pointer; }
        .roles-access-group td { padding: 14px 12px 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: #94a3b8; }
        .roles-access-module td { padding: 11px 8px; border-top: 1px solid #f1f5f9; text-align: center; }
        .roles-access-module td:first-child { text-align: left; padding: 11px 12px; color: #0f172a; font-weight: 500; }
        @media (min-width: 992px) {
          .roles-access-roles { position: sticky; top: 90px; z-index: 2; }
        }
        @media (max-width: 1199px) {
          .roles-access-layout { grid-template-columns: 230px minmax(0, 1fr); }
        }
        @media (max-width: 991px) {
          .roles-access-layout { grid-template-columns: 1fr; }
          .roles-access-panel { padding: 16px; }
        }
        @media (max-width: 767px) {
          .roles-access-panel { padding: 12px; }
          .roles-access-summary { padding-bottom: 10px; margin-bottom: 2px; }
          .roles-access-summary h4 { font-size: 16px; }
          .roles-access-summary p { margin-bottom: 10px; font-size: 13px; }
          .roles-access-actions { gap: 6px; }
          .roles-access-btn { height: 32px; padding: 0 10px; font-size: 13px; border-radius: 7px; }
          .roles-access-table table { min-width: 0; width: 100%; }
          .roles-access-th { width: 46px; padding: 6px 0; font-size: 9px; letter-spacing: 0.03em; }
          .roles-access-th--module { width: auto; padding: 6px 6px 6px 0; }
          .roles-access-colhead { flex-direction: column; gap: 3px; line-height: 1; }
          .roles-access-group td { padding: 10px 0 2px; font-size: 10px; }
          .roles-access-module td { padding: 7px 0; }
          .roles-access-module td:first-child { padding: 7px 6px 7px 0; font-size: 13px; }
          .roles-access-check input,
          .roles-access-colhead input { width: 14px; height: 14px; }
        }
      `}</style>
      <div className="roles-access-page">
      <AccessHeader page="permissions" />

      <div className="roles-access-layout">
          <div className="roles-access-roles">
            <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
              <Card.Body className="p-3">
                <div className="px-2 mb-2" style={labelStyle}>Roles</div>
                <div className="roles-access-list d-flex flex-column gap-1">
                  {roles.map((item) => {
                    const selected = item.id === role.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRoleId(item.id)}
                        className="roles-access-role d-flex align-items-center justify-content-between"
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
                        <span style={{ minWidth: 0 }}>{item.name}</span>
                        <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>{item.users} {item.users === 1 ? 'user' : 'users'}</span>
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
          <div className="roles-access-main">
            <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
              <Card.Body className="roles-access-panel">
                <div className="roles-access-summary">
                  <h4>{role.name}</h4>
                  <p>{role.description}</p>
                  <div className="roles-access-actions">
                    <button type="button" className="btn btn-primary roles-access-btn">
                      <i className="fe fe-edit-2" aria-hidden="true"></i>
                      Edit
                    </button>
                    <button type="button" className="btn btn-primary roles-access-btn">Save changes</button>
                    <button type="button" className="btn btn-danger roles-access-btn">Delete</button>
                  </div>
                </div>
                <div className="roles-access-table">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="roles-access-th roles-access-th--module">MODULE</th>
                        {ACTIONS.map((action) => (
                          <th key={action.key} className="roles-access-th">
                            <label className="roles-access-colhead">
                              <input
                                type="checkbox"
                                checked={columnChecked(action.key)}
                                onChange={(event) => setColumn(action.key, event.target.checked)}
                              />
                              {action.label.toUpperCase()}
                            </label>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {GROUPS.flatMap((group) => [
                        <tr key={`${group.label}-label`} className="roles-access-group">
                          <td colSpan={6}>{group.label.toUpperCase()}</td>
                        </tr>,
                        ...group.modules.map((name) => (
                          <tr key={name} className="roles-access-module">
                            <td>{name}</td>
                            {ACTIONS.map((action) => (
                              <td key={action.key}>
                                <label className="roles-access-check mb-0">
                                  <input
                                    type="checkbox"
                                    aria-label={`${name} ${action.label}`}
                                    checked={Boolean(role.access[name]?.[action.key])}
                                    onChange={(event) => setAccess(name, action.key, event.target.checked)}
                                  />
                                  <span className="roles-access-check-label">{action.label}</span>
                                </label>
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
