import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, indexColumn, readList, useListFilters } from '../common/ListFilters'
import AccessHeader from './AccessHeader'
import './StaffUsers.css'
import Loader from '../../layouts/layoutcomponents/loader'
import { openModal } from '../../redux/slices/allModalSlice'
import { useAddStaffMutation, useGetAllRolesQuery, useGetAllStaffQuery } from '../../redux/features/staffEndPoint'

const roleName = (role) => role?.role_name || role?.name || ''
const staffRole = (person) => (typeof person.role === 'string' ? person.role : person.role?.name || person.role?.role_name || '')

const fieldStyle = { borderColor: '#e6ebf2', borderRadius: 8, fontSize: 14, background: '#fff', height: 40 }

export default function StaffUsers() {
  const dispatch = useDispatch()
  const list = useListFilters(['role', 'status'])
  const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery()
  const { data: staffData, isLoading: staffLoading, isFetching: staffFetching } = useGetAllStaffQuery(list.query, { skip: list.skip })
  const [addStaff, { isLoading: adding }] = useAddStaffMutation()
  const roles = Array.isArray(rolesData?.data) ? rolesData.data : []
  const { rows, total } = readList(staffData)
  const roleOptions = roles.map((role) => ({ value: roleName(role), label: roleName(role) })).filter((role) => role.value)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })

  useEffect(() => {
    if (!form.role && roles[0]) setForm((current) => ({ ...current, role: roleName(roles[0]) }))
  }, [roles, form.role])

  const handleAdd = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.role) {
      toast.error('Name, email, password, and role are required')
      return
    }

    const response = await addStaff({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    })
    if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
      toast.success(response.data.message || 'Staff added')
      setForm((current) => ({ ...current, name: '', email: '', password: '' }))
      return
    }
    toast.error(response?.data?.message || 'Failed to add staff')
  }

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: 'name', label: 'Name', minWidth: 160, flex: 1, render: (row) => row?.name || '' },
    { id: 'email', label: 'Email', minWidth: 220, flex: 1.2, render: (row) => row?.email || '' },
    { id: 'role', label: 'Role', minWidth: 140, flex: 0.7, render: (row) => staffRole(row) },
    {
      id: 'active',
      label: 'Active',
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch checked={!!row?.active} disabled />,
    },
    {
      id: 'action',
      label: 'Action',
      width: 120,
      align: 'center',
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-warning me-2" variant="" onClick={() => dispatch(openModal({ componentName: 'EditStaff', data: row }))}><i className="fe fe-edit"></i></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: 'DeleteStaff', data: row }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch])

  return (
    <>
      {(rolesLoading || staffLoading || staffFetching || adding) && <Loader />}
      <AccessHeader page="staff" />
      <Card className="staff-users-card" style={{ border: '1px solid #e8edf3', borderRadius: 12, boxShadow: 'none' }}>
        <Card.Body>
          <h4 className="fw-semibold mb-1">Staff users</h4>
          <p className="text-muted small">Add a person and choose which role they get after login.</p>
          <div className="staff-users-form-box">
            <div className="staff-users-form">
              <div className="staff-users-field">
                <Form.Label className="small text-muted mb-1">Name</Form.Label>
                <Form.Control placeholder="Jane Doe" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} style={fieldStyle} />
              </div>
              <div className="staff-users-field staff-users-field--wide">
                <Form.Label className="small text-muted mb-1">Email</Form.Label>
                <Form.Control type="email" placeholder="jane@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} style={fieldStyle} />
              </div>
              <div className="staff-users-field staff-users-field--wide">
                <Form.Label className="small text-muted mb-1">Password</Form.Label>
                <Form.Control type="password" placeholder="At least 8 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} style={fieldStyle} />
              </div>
              <div className="staff-users-field">
                <Form.Label className="small text-muted mb-1">Role</Form.Label>
                <SelectWithDragDrop
                  options={roleOptions}
                  value={roleOptions.find((option) => option.value === form.role) || null}
                  onChange={(selected) => setForm({ ...form, role: selected?.value || '' })}
                  placeholder="Select role"
                  isSearchable
                  styles={{
                    control: (base) => ({ ...base, minHeight: 40, height: 40, borderColor: '#e6ebf2', borderRadius: 8, boxShadow: 'none', fontSize: 14, background: '#fff' }),
                    valueContainer: (base) => ({ ...base, height: 40, padding: '0 10px' }),
                    indicatorsContainer: (base) => ({ ...base, height: 40 }),
                    placeholder: (base) => ({ ...base, whiteSpace: 'nowrap' }),
                    singleValue: (base) => ({ ...base, whiteSpace: 'nowrap' }),
                  }}
                />
              </div>
              <button type="button" className="btn btn-primary staff-users-form__submit" onClick={handleAdd} disabled={adding}>Add user</button>
            </div>
          </div>
          <div className="e-table">
            <ListFilters
              {...boundFilters(list, {
                placeholder: 'Name or email',
                selects: [
                  { label: 'Role', value: list.filters.role, onChange: (value) => list.setFilter('role', value), empty: 'All roles', options: roleOptions, searchable: true },
                  { label: 'Status', value: list.filters.status, onChange: (value) => list.setFilter('status', value), options: STATUS_FILTERS },
                ],
              })}
            />
            <ListTable
              columns={columns}
              rows={rows}
              total={total}
              page={list.currentPage}
              pageSize={list.pageSize}
              onPagination={list.onPaginationModelChange}
              emptyLabel="No staff users yet."
              disableRowSelectionOnClick
            />
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
