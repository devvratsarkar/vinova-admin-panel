import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useGetAllSoftDeletedLensColorQuery, useGetLensColorQuery, useRestoreDeleteLensColorMutation } from "../../redux/features/lensColorAPIEndPoint";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";

export default function RestoreLensColor() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const dispatch = useDispatch()


    const { refetch } = useGetLensColorQuery()
    const { refetch: deletedRefetch } = useGetAllSoftDeletedLensColorQuery()

    const [restoreData, { isLoading: restoreDataLoading }] = useRestoreDeleteLensColorMutation()

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
