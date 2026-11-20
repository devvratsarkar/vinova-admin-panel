import { useEffect, useState } from 'react'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import AccessHeader from './AccessHeader'
import './StaffPermission.css'
import Loader from '../../layouts/layoutcomponents/loader'
import { MENUITEMS } from '../../commondata/sidemenu'
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
} from '../../redux/features/staffEndPoint'

const ACTIONS = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'export', label: 'Export' },
]

const GROUPS = MENUITEMS.flatMap((section) => {
  const pages = []
  const groups = []
    ; (section.Items || []).forEach((item) => {
      if (item.children?.length) {
        groups.push({
          label: item.title,
          pages: item.children.filter((child) => child.title).map((child) => ({
            title: child.title,
            name: child.model || child.title,
          })),
        })
      } else if (item.title) {
        pages.push({ title: item.title, name: item.model || item.title })
      }
    })
  if (pages.length) groups.unshift({ label: section.menutitle || pages[0].title, pages })
  return groups
})

const PAGES = GROUPS.flatMap((group) => group.pages)

const roleId = (role) => role?._id || role?.id
const roleName = (role) => role?.role_name || role?.name || ''

function blankAccess() {
  const access = {}
  PAGES.forEach((page) => {
    if (access[page.name]) return
    access[page.name] = {}
    ACTIONS.forEach((action) => { access[page.name][action.key] = false })
  })
  return access
}

function permissionRows(role) {
  const rows = role?.permission || role?.user_permission || []
  return Array.isArray(rows) ? rows : []
}

function accessFromApi(userPermission = []) {
  const access = blankAccess()
  userPermission.forEach((item) => {
    const name = item?.name || item?.model
    if (!name || !access[name]) return
    const permissions = item.permissions || item.Permission || []
    if (!Array.isArray(permissions)) return
    permissions.forEach((perm) => {
      const key = perm === 'add' ? 'create' : perm
      if (key in access[name]) access[name][key] = true
    })
  })
  return access
}

function accessToApi(access) {
  const names = [...new Set(PAGES.map((page) => page.name))]
  return names.map((name) => ({
    name,
    permissions: ACTIONS
      .filter((action) => access[name]?.[action.key])
      .map((action) => (action.key === 'create' ? 'add' : action.key)),
  })).filter((item) => item.permissions.length)
}

const fieldStyle = { borderColor: '#e6ebf2', borderRadius: 8, fontSize: 14, background: '#fff', height: 40 }
const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }

export default function StaffPermission() {
  const { data, isLoading } = useGetAllRolesQuery()
  const roles = Array.isArray(data?.data) ? data.data : []
  const [selectedId, setSelectedId] = useState(null)
  const { data: roleData, isFetching } = useGetSingleRoleQuery(selectedId, { skip: !selectedId })
  const role = roleData?.data
  const [createRole, { isLoading: creating }] = useCreateRoleMutation()
  const [updateRole, { isLoading: saving }] = useUpdateRoleMutation()
  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation()

  const [access, setAccess] = useState(blankAccess)
  const [savedAccess, setSavedAccess] = useState(blankAccess)
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ role_name: '', description: '' })

  useEffect(() => {
    if (!selectedId && roles[0]) setSelectedId(roleId(roles[0]))
  }, [roles, selectedId])

  useEffect(() => {
    if (role && String(roleId(role)) === String(selectedId)) {
      const next = accessFromApi(permissionRows(role))
      setAccess(next)
      setSavedAccess(next)
    }
  }, [role, selectedId])

  const toggle = (moduleName, action, checked) => {
    setAccess((current) => ({
      ...current,
      [moduleName]: { ...current[moduleName], [action]: checked },
    }))
  }

  const toggleColumn = (action, checked) => {
    setAccess((current) => {
      const next = { ...current }
      Object.keys(next).forEach((name) => {
        next[name] = { ...next[name], [action]: checked }
      })
      return next
    })
  }

  const saveRole = async (name, description) => {
    const response = await updateRole({
      id: selectedId,
      body: {
        role_name: name,
        description,
        user_permission: accessToApi(access),
      },
    })
    if (response?.data?.http_status_code === 200) {
      setSavedAccess(access)
      toast.success(response.data.message || 'Role updated')
      return true
    }
    if (!response?.error) toast.error(response?.data?.message || 'Failed to update role')
    return false
  }

  const openAdd = () => {
    setEditing(false)
    setForm({ role_name: '', description: '' })
    setOpen(true)
  }

  const openEdit = () => {
    setEditing(true)
    setForm({ role_name: roleName(role), description: role?.description || '' })
    setOpen(true)
  }

  const submitModal = async () => {
    const name = form.role_name.trim()
    const description = form.description.trim()
    if (!name) {
      toast.error('Role name is required')
      return
    }

    if (editing) {
      const ok = await saveRole(name, description)
      if (ok) setOpen(false)
      return
    }

    const response = await createRole({ role_name: name, description, user_permission: [] })
    if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
      toast.success(response.data.message || 'Role created')
      if (roleId(response.data.data)) setSelectedId(roleId(response.data.data))
      setOpen(false)
      return
    }
    if (!response?.error) toast.error(response?.data?.message || 'Failed to create role')
  }

  const removeRole = async () => {
    const response = await deleteRole(selectedId)
    if (response?.data?.http_status_code === 200) {
      toast.success(response.data.message || 'Role deleted')
      const next = roles.find((item) => roleId(item) !== selectedId)
      setSelectedId(next ? roleId(next) : null)
      setConfirmDelete(false)
      return
    }
    if (!response?.error) toast.error(response?.data?.message || 'Failed to delete role')
  }

  const ready = role && String(roleId(role)) === String(selectedId)
  const changed = JSON.stringify(access) !== JSON.stringify(savedAccess)

  const busy = isLoading || creating || saving || deleting || (selectedId && isFetching && !ready)

  return (
    <>
      {busy && <Loader />}
      <div className="roles-access-page">
        <AccessHeader page="permissions" />

        <div className="roles-access-layout">
          <div className="roles-access-roles">
            <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
              <Card.Body className="p-3">
                <div className="px-2 mb-2" style={labelStyle}>Roles</div>
                <div className="roles-access-list d-flex flex-column gap-1">
                  {roles.map((item) => {
                    const id = roleId(item)
                    const selected = id === selectedId
                    const users = item.users || 0
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedId(id)}
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
                        <span style={{ minWidth: 0 }}>{roleName(item)}</span>
                        <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>{users} {users === 1 ? 'user' : 'users'}</span>
                      </button>
                    )
                  })}
                  {!isLoading && roles.length === 0 && (
                    <div className="px-2 py-2 text-muted small">No roles yet</div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={openAdd}
                >
                  Add role
                </button>
              </Card.Body>
            </Card>
          </div>
          <div className="roles-access-main">
            <Card style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
              <Card.Body className="roles-access-panel">
                {ready ? (
                  <>
                    <div className="roles-access-summary">
                      <h4>{roleName(role)}</h4>
                      <p>{role.description}</p>
                      <div className="roles-access-actions">
                        <button type="button" className="btn btn-primary roles-access-btn" onClick={openEdit}>
                          <i className="fe fe-edit-2" aria-hidden="true"></i>
                          Edit
                        </button>
                        {changed && (
                          <button type="button" className="btn btn-light roles-access-btn" onClick={() => setAccess(savedAccess)} disabled={saving}>Discard</button>
                        )}
                        <button type="button" className="btn btn-primary roles-access-btn" onClick={() => saveRole(roleName(role), role.description || '')} disabled={!changed || saving}>Save changes</button>
                        <button type="button" className="btn btn-danger roles-access-btn" onClick={() => setConfirmDelete(true)} disabled={deleting}>Delete</button>
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
                                    checked={Object.keys(access).every((name) => access[name]?.[action.key])}
                                    onChange={(event) => toggleColumn(action.key, event.target.checked)}
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
                            ...group.pages.map((page) => (
                              <tr key={`${group.label}-${page.title}`} className="roles-access-module">
                                <td>{page.title}</td>
                                {ACTIONS.map((action) => (
                                  <td key={action.key}>
                                    <label className="roles-access-check mb-0">
                                      <input
                                        type="checkbox"
                                        aria-label={`${page.title} ${action.label}`}
                                        checked={Boolean(access[page.name]?.[action.key])}
                                        onChange={(event) => toggle(page.name, action.key, event.target.checked)}
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
                  </>
                ) : (
                  <div className="text-muted">{selectedId ? 'Loading role...' : 'Add a role to set permissions.'}</div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <Modal show={confirmDelete}>
        <Modal.Header className="modal_header border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Delete Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Are you sure you want to delete this role?</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => setConfirmDelete(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn btn-danger" variant="danger" onClick={removeRole} disabled={deleting}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={open} onHide={() => setOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5" className="fw-semibold">{editing ? 'Edit role' : 'Add role'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Role name <span className="text-danger">*</span></Form.Label>
            <Form.Control value={form.role_name} onChange={(event) => setForm({ ...form, role_name: event.target.value })} style={fieldStyle} />
          </Form.Group>
          <Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Label>Description</Form.Label>
              <span className="text-muted small">{form.description.length} / 100</span>
            </div>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={100}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value.slice(0, 100) })}
              style={{ ...fieldStyle, height: 'auto' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-light" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submitModal} disabled={creating || saving}>
            {editing ? 'Save' : 'Add role'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
