import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useGetJobOpeningsQuery, useGetTrashedJobOpeningsQuery, useRestoreJobOpeningMutation, } from "../../redux/features/jobOpeningAPIEndPoint";

export default function RestoreJobPosition() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const dispatch = useDispatch();

    const { refetch } = useGetJobOpeningsQuery();
    const { refetch: trashRefetch } = useGetTrashedJobOpeningsQuery();

    const [restoreJobPosition, { isLoading }] = useRestoreJobOpeningMutation();


    const handleDelte = async () => {
        try {
            const res = await restoreJobPosition(data._id)
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                trashRefetch()
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="bg-primary border-0 border-bottom-0">
                    <Modal.Title as="h4" className="text-light fw-semibold lh-1 my-auto text-center">
                        Restore Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to restore this data?
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button variant="primary" className="btn btn-primary"  onClick={() => handleDelte()} >
                        restore
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
