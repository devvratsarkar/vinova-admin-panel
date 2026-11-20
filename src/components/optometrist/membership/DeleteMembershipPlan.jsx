import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Loader from '../../../layouts/layoutcomponents/loader'
import { closeModal } from '../../../redux/slices/allModalSlice'
import { useDeleteMembershipPlanMutation, useGetAllMembershipPlansQuery, useGetTrashedMembershipPlansQuery } from '../../../redux/features/membershipPlanAPIEndPoint'

export default function DeleteMembershipPlan() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const { refetch } = useGetAllMembershipPlansQuery()
    const { refetch: trashRefetch } = useGetTrashedMembershipPlansQuery()
    const [deletePlan, { isLoading }] = useDeleteMembershipPlanMutation()

    const handleDelete = async () => {
        const res = await deletePlan(data?._id || data?.id)
        if (res?.data?.http_status_code === 200) {
            refetch()
            trashRefetch()
            toast.success(res.data.message)
            dispatch(closeModal())
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">Are you sure to delete this data?</Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())}>Cancel</Button>
                    <Button className="btn btn-danger" variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
