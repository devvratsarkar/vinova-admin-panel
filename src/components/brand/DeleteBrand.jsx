import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useDeleteBrandNewMutation, useGetBrandsQuery, useGetBrandsSelectQuery, useGetDeletedBrandsQuery, useSoftDeleteBrandMutation } from "../../redux/features/BrandAPIEndpoint";

export default function DeleteBrand() {
    const dispatch = useDispatch();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);

    console.log("data", data)

    const { refetch } = useGetBrandsQuery()
    const { refetch: refetchDeleted } = useGetDeletedBrandsQuery()
    const { refetch: refetchSelect } = useGetBrandsSelectQuery()


    const [softDeleteData, { isLoading: loadingSoftDelete }] = useSoftDeleteBrandMutation()
    const [deleteData, { isLoading: loadingDelete }] = useDeleteBrandNewMutation()

    const handleDelte = async () => {
        if (softDelete) {
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
        } else {
            try {
                const resp = await deleteData(data?._id)

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
    }

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
                    {softDelete ? <p>Are Your Sure you want to delete this data?</p> : <p>Are Your Sure you want to delete this data permanently?</p>}

                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-danger" variant="danger" onClick={handleDelte} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
