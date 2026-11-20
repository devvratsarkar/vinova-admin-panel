import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useDeleteJobOpeningMutation, useGetJobOpeningsQuery, useGetTrashedJobOpeningsQuery, useSoftDeleteJobOpeningMutation } from "../../redux/features/jobOpeningAPIEndPoint";

export default function DeleteJobPosition() {
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const dispatch = useDispatch();

    const { refetch } = useGetJobOpeningsQuery();
    const { refetch: trashRefetch } = useGetTrashedJobOpeningsQuery();
    const [softDeleteJobPosition, { isLoading: loadingSoftDelete }] = useSoftDeleteJobOpeningMutation();
    const [deleteJobPosition, { isLoading }] = useDeleteJobOpeningMutation();


    const handleDelte = async () => {
        try {
            const res = softDelete ? await softDeleteJobPosition(data._id) : await deleteJobPosition(data._id);
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
            {(isLoading || loadingSoftDelete) && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to delete this data?
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-danger" variant="danger" onClick={() => handleDelte()} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
