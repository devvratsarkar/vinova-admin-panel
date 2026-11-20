import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useGetAllCategoryQuery, useGetAllCategorySelectQuery, useGetAllDeletedCategoryQuery, useRestoreCategoryMutation } from "../../../redux/features/CategoryAPIEndPoint";

export default function CategoryRestore() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const dispatch = useDispatch()


    const { refetch } = useGetAllCategoryQuery()
    const { refetch: deletedRefetch } = useGetAllDeletedCategoryQuery()
    const { refetch: selectRefetch } = useGetAllCategorySelectQuery()

    const [restoreData, { isLoading: restoreDataLoading }] = useRestoreCategoryMutation()

    const handleRestore = async () => {
        try {
            console.log("data?._id", data?._id)
            const resp = await restoreData(data?._id)
            if (resp?.data?.http_status_code === 200) {
                refetch()
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
