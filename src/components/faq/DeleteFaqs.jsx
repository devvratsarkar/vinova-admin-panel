import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { useDeleteFaqMutation, useGetAllFaqQuery } from "../../redux/features/faqAPIEndPoint";

export default function DeleteFaqs() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector(
        (state) => state.allCommonModal
    );

    const { refetch } = useGetAllFaqQuery()
    const [deleteFaq, { isLoading: loadingDeleteData }] = useDeleteFaqMutation()
    const handleDelete = async () => {
        try {
            const resp = await deleteFaq(data?._id)
            if (resp?.data?.http_status_code === 200) {
                refetch()
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
                loadingDeleteData && <Loader />
            }
            <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
                <Modal.Header className="bg-danger">
                    <Modal.Title
                        as="h4"
                        className="fw-semibold lh-1 my-auto text-center text-light"
                    >
                        Delete FAQ
                    </Modal.Title>
                    <Button
                        onClick={() => dispatch(closeModal())}
                        className="btn-close text-light"
                        variant=""
                    >
                        <i className="fe fe-x"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this data?</Modal.Body>
                <Modal.Footer className="">
                    <Button variant="light" onClick={() => dispatch(closeModal())}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
