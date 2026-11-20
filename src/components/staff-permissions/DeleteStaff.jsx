import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useDeleteStaffMutation } from "../../redux/features/staffEndPoint";

const getStaffId = (item) => item?._id ?? item?.id;

export default function DeleteStaff() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [deleteStaff, { isLoading }] = useDeleteStaffMutation();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            const res = await deleteStaff(getStaffId(data));
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                toast.success(res?.data?.message || "Staff deleted successfully");
            } else {
                toast.error(res?.data?.message || "Failed to delete staff");
            }
        } catch (err) {
            toast.error(err?.message || "An error occurred");
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
                Are you sure you want to delete <strong>{data?.name}</strong>?
                {isLoading && <Loader />}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="" onClick={() => dispatch(closeModal())}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
