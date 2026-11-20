import { useState } from 'react'
import { Button, Form, Modal, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { closeModal } from '../../redux/slices/allModalSlice'
import Loader from '../../layouts/layoutcomponents/loader'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useGetAllRolesQuery, useUpdateStaffMutation } from '../../redux/features/staffEndPoint'

const roleName = (role) => role?.role_name || role?.name || ''
const staffRole = (person) => (typeof person?.role === 'string' ? person.role : person?.role?.name || person?.role?.role_name || '')

const selectStyles = {
  control: (base) => ({ ...base, minHeight: 40, borderColor: '#e6ebf2', borderRadius: 8, boxShadow: 'none', fontSize: 14, background: '#fff' }),
  valueContainer: (base) => ({ ...base, padding: '0 10px' }),
  placeholder: (base) => ({ ...base, whiteSpace: 'nowrap' }),
  singleValue: (base) => ({ ...base, whiteSpace: 'nowrap' }),
}

export default function EditStaff() {
  const dispatch = useDispatch()
  const { isOpen, data } = useSelector((state) => state.allCommonModal)
  const { data: rolesData } = useGetAllRolesQuery()
  const [updateStaff, { isLoading }] = useUpdateStaffMutation()
  const roles = Array.isArray(rolesData?.data) ? rolesData.data : []
  const roleOptions = roles.map((role) => ({ value: roleName(role), label: roleName(role) })).filter((role) => role.value)
  const [form, setForm] = useState({
    name: data?.name || '',
    email: data?.email || '',
    password: '',
    role: staffRole(data),
  })
  const options = form.role && !roleOptions.some((option) => option.value === form.role)
    ? [{ value: form.role, label: form.role }, ...roleOptions]
    : roleOptions

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      toast.error('Name, email, and role are required')
      return
    }

    const body = { name: form.name.trim(), email: form.email.trim(), role: form.role }
    if (form.password) body.password = form.password
    const response = await updateStaff({ staffId: data?._id || data?.id, staffData: body })
    if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
      toast.success(response.data.message || 'Staff updated')
      dispatch(closeModal())
      return
    }
    toast.error(response?.data?.message || 'Failed to update staff')
  }

  return (
    <Modal show={isOpen}>
      <Modal.Header className="bg-primary">
        <Modal.Title className="text-white">Edit staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Loader />}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
            <Form.Control value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Leave blank to keep the current password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role <span className="text-danger">*</span></Form.Label>
            <SelectWithDragDrop
              options={options}
              value={options.find((option) => option.value === form.role) || null}
              onChange={(selected) => setForm({ ...form, role: selected?.value || '' })}
              placeholder="Select role"
              isSearchable
              styles={selectStyles}
            />
          </Form.Group>
          <Row className="justify-content-end mt-4 gap-2 px-3">
            <Button className="btn btn-outline-default cancel_button w-auto" variant="" onClick={() => dispatch(closeModal())} disabled={isLoading}>Cancel</Button>
            <Button type="submit" className="w-auto" disabled={isLoading}>Save</Button>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
