import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { closeModal } from "../../../redux/slices/allModalSlice";
import {
    useDeletePolicyMutation,
    useGetAllPoliciesQuery,
} from "../../../redux/features/policyAPIEndPoint";

export default function DeletePolicy() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const { refetch } = useGetAllPoliciesQuery();
    const [deletePolicy, { isLoading }] = useDeletePolicyMutation();

    const handleDelete = async () => {
        const policyId = data?.id ?? data?._id;
        if (!policyId) {
            toast.error("Policy id not found");
            return;
        }

        try {
            const res = await deletePolicy(policyId);
            if (res?.error) {
                toast.error(res.error?.data?.message || "Failed to delete policy");
                return;
            }
            if (res?.data?.http_status_code === 200) {
                refetch();
                dispatch(closeModal());
                toast.success(res?.data?.message || "Policy deleted successfully");
            } else {
                toast.error(res?.data?.message || "Failed to delete policy");
            }
        } catch (error) {
            toast.error(error?.message || "An error occurred");
        }
    };

    return (
        <Modal show={isOpen}>
            <Modal.Header className="modal_header border-0 border-bottom-0">
                <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                    Delete Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                Are you sure you want to delete this policy?
                {isLoading && <Loader />}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())}>
                    Cancel
                </Button>
                <Button className="btn btn-danger" variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
