import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useGetAllDeletedOptometristStoreDataQuery, useGetAllOptometristStoreDataQuery, usePermanentDeleteOptometristStoreMutation, useSoftDeleteOptometristStoreMutation } from "../../redux/features/optometristAPIEndPoint";

export default function DeleteOptometristStore() {
    const dispatch = useDispatch();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);

    const { refetch: deletedRefetch } = useGetAllOptometristStoreDataQuery()
    const { refetch: selectRefetch } = useGetAllDeletedOptometristStoreDataQuery()



    const [softDeleteOptometristStore, { isLoading: loadingSoftDelete }] = useSoftDeleteOptometristStoreMutation()
    const [permanentDeleteOptometristStore, { isLoading: loadingDelete }] = usePermanentDeleteOptometristStoreMutation()

    const handleDelte = async () => {
        if (softDelete) {
            try {
                const resp = await softDeleteOptometristStore(data?._id)
                if (resp?.data?.http_status_code === 200) {
                    deletedRefetch()
                    selectRefetch()
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
                const resp = await permanentDeleteOptometristStore(data?._id)
                if (resp?.data?.http_status_code === 200) {
                    // deletedRefetch()
                    selectRefetch()
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
                    <Button className="btn btn-danger" variant="danger" onClick={() => handleDelte()} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
