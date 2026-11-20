import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useDeletedCustomFielsMutation, useGetAllCustomFieldsQuery, useGetAllDeletedCustomFieldQuery, useSoftDeleteCustomFieldMutation } from "../../../redux/features/customFieldsAPIEndPoint";

export default function DeleteField() {
    const dispatch = useDispatch();
    const { refetch } = useGetAllCustomFieldsQuery();
    const { refetch: trashFetched } = useGetAllDeletedCustomFieldQuery();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [deleteCustomField, { isLoading }] = useSoftDeleteCustomFieldMutation();
    const [permanentDeleteCustomField, { isLoading: loading }] = useDeletedCustomFielsMutation();

    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteCustomField(data?._id) : await permanentDeleteCustomField(data?._id)
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                trashFetched()
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    return (
        <>
            {isLoading && <Loader /> || loading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {softDelete ? "Are Your Sure to delete this data?" : "Are Your Sure to delete this data permanently?"}
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
