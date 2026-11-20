import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Loader from '../../../layouts/layoutcomponents/loader'
import { closeModal } from '../../../redux/slices/allModalSlice'
import { useGetAllMembershipPlansQuery, useGetTrashedMembershipPlansQuery, useRestoreMembershipPlanMutation } from '../../../redux/features/membershipPlanAPIEndPoint'

export default function RestoreMembershipPlan() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const { refetch } = useGetAllMembershipPlansQuery()
    const { refetch: trashRefetch } = useGetTrashedMembershipPlansQuery()
    const [restorePlan, { isLoading }] = useRestoreMembershipPlanMutation()

    const handleRestore = async () => {
        const res = await restorePlan(data?._id || data?.id)
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
                <Modal.Header className="modal_header bg-primary border-0 border-bottom-0">
                    <Modal.Title as="h4" className="text-light fw-semibold lh-1 my-auto text-center">Restore Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">Are you sure to restore this data?</Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())}>Cancel</Button>
                    <Button variant="primary" onClick={handleRestore}>Restore</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
