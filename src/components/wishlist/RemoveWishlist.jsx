import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { closeModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import { useRemoveWishlistMutation } from "../../redux/features/cartAPIEndPoint";

export default function RemoveWishlist() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [removeWishlist, { isLoading }] = useRemoveWishlistMutation();

    const handleDelte = async () => {
        try {
            const res = await removeWishlist(data?.wishlistId);
            if (res?.data?.http_status_code === 201 || res?.data?.http_status_code === 200) {
                dispatch(closeModal());
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
                    Are your sure you want to delete this data?
                    {isLoading && <Loader />}
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
