import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useDeleteMediaMutation } from "../../redux/features/MediaEndPoints";

const getMediaId = (item) => item?.id ?? item?._id;

export default function DeleteMedia() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [deleteMedia, { isLoading }] = useDeleteMediaMutation();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            const res = await deleteMedia(getMediaId(data));
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                toast.success(res.data.message || "Media deleted successfully");
            } else {
                toast.error(res?.data?.message || "Failed to delete media");
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
                Are you sure you want to delete this media?
                {isLoading && <Loader />}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button
                    className="btn btn-outline-default cancel_button"
                    variant=""
                    onClick={() => dispatch(closeModal())}
                >
                    Cancel
                </Button>
                <Button className="btn btn-danger" variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
