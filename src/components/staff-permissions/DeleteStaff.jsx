import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { closeModal } from '../../redux/slices/allModalSlice'
import Loader from '../../layouts/layoutcomponents/loader'
import { useDeleteStaffMutation } from '../../redux/features/staffEndPoint'

export default function DeleteStaff() {
  const dispatch = useDispatch()
  const { isOpen, data } = useSelector((state) => state.allCommonModal)
  const [deleteStaff, { isLoading }] = useDeleteStaffMutation()

  const handleDelete = async () => {
    const response = await deleteStaff(data?._id || data?.id)
    if (response?.data?.http_status_code === 200) {
      toast.success(response.data.message || 'Staff deleted')
      dispatch(closeModal())
      return
    }
    toast.error(response?.data?.message || 'Failed to delete staff')
  }

  return (
    <>
      {isLoading && <Loader />}
      <Modal show={isOpen}>
        <Modal.Header className="modal_header border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Delete Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Are you sure you want to delete this staff user?</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="btn btn-danger" variant="danger" onClick={handleDelete} disabled={isLoading}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
