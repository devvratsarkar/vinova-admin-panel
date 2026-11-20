import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { useGetDeletedFramesQuery, useGetFramesQuery, useRestoreDeleteFrameMutation } from "../../redux/features/framesAPIEndPoint";
import { closeModal } from "../../redux/slices/allModalSlice";

export default function FrameRestore() {
    const dispatch = useDispatch()
    const { isOpen, data, } = useSelector((state) => state.allCommonModal);


    const { refetch } = useGetFramesQuery()
    const { refetch: deletedRefetch } = useGetDeletedFramesQuery()

    const [restoreData, { isLoading: restoreDataLoading }] = useRestoreDeleteFrameMutation()

    const handleRestore = async () => {
        try {
            const resp = await restoreData(data?._id)
            if (resp?.data?.http_status_code === 200) {
                refetch()
                deletedRefetch()
                toast.success(resp?.data?.message)
                dispatch(closeModal())
            } else {
                toast.error(resp?.data?.message)
            }
        } catch (err) {
            toast.error(err?.message)
        }

    };
    return (
        <>
            {
                restoreDataLoading && <Loader />
            }
            <Modal show={isOpen}>
                <Modal.Header className="modal_header bg-primary border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Restore Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to Restore this data?
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-primary" variant="primary" onClick={() => handleRestore()} >Restore</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
