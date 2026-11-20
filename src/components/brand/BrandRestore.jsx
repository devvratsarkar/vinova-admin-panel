import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useGetBrandsQuery, useGetBrandsSelectQuery, useGetDeletedBrandsQuery, useRestoreDeleteBrandMutation } from "../../redux/features/BrandAPIEndpoint";

export default function BrandRestore() {
    const dispatch = useDispatch()
    const { isOpen, data, } = useSelector((state) => state.allCommonModal);

    const { refetch } = useGetBrandsQuery()
    const { refetch: refetchDeleted } = useGetDeletedBrandsQuery()
    const { refetch: refetchSelect } = useGetBrandsSelectQuery()


    const [softDeleteData, { isLoading: loadingSoftDelete }] = useRestoreDeleteBrandMutation()

    const handleRestore = async () => {
        try {
            const resp = await softDeleteData(data?._id)

            if (resp?.data?.http_status_code === 200) {
                refetch()
                refetchDeleted()
                refetchSelect()
                toast.success(resp?.data?.message)
                dispatch(closeModal())
            } else {
                toast.error(resp?.data?.message)
            }
        } catch (err) {
            toast.error(err?.message)
        }

    }
    return (
        <>
            {
                loadingSoftDelete && <Loader />
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
                    <Button className="btn btn-primary" variant="primary" onClick={handleRestore} >Restore</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
