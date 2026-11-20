import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDeleteLensColorMutation, useGetAllSoftDeletedLensColorQuery, useGetLensColorQuery, useSoftDeleteLensColorMutation } from "../../redux/features/lensColorAPIEndPoint";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../layouts/layoutcomponents/loader"
import { closeModal } from "../../redux/slices/allModalSlice";

export default function DeleteLensColor() {
    const dispatch = useDispatch();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);

    const { refetch } = useGetLensColorQuery()
    const { refetch: deletedRefetch } = useGetAllSoftDeletedLensColorQuery()


    const [softDeleteData, { isLoading: loadingSoftDelete }] = useSoftDeleteLensColorMutation()
    const [deleteData, { isLoading: loadingDelete }] = useDeleteLensColorMutation()

    const handleDelete = async () => {
        if (softDelete) {
            try {
                const resp = await softDeleteData(data?._id)
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
        } else {
            try {
                const resp = await deleteData(data?._id)
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
        }
    };

    return (
        <>
            {
                (loadingSoftDelete || loadingDelete) && <Loader />
            }
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {softDelete ? <p>Are Your Sure to delete this data?</p> : <p>Are Your Sure to delete this data permanantly?</p>}
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-danger" variant="danger" onClick={() => handleDelete()} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
