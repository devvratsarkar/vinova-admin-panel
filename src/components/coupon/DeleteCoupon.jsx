import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useDeleteCouponMutation, useGetAllCouponsQuery, useGetTrashedCouponsQuery, useSoftDeleteCouponMutation } from "../../redux/features/couponAPIEndPoint";

export default function DeleteCoupon() {
    const dispatch = useDispatch();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);

    const { refetch } = useGetAllCouponsQuery();
    const { refetch: trashFetched } = useGetTrashedCouponsQuery();
    const [deleteCoupon, { isLoading }] = useSoftDeleteCouponMutation();
    const [permanentDeleteCoupon, { isLoading: loading }] = useDeleteCouponMutation();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteCoupon(data?._id) : await permanentDeleteCoupon(data?._id);
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
        <div>
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to delete this data?
                    {isLoading && <Loader /> || loading && <Loader />}
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
        </div>
    );
}
