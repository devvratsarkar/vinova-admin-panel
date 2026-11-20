import React from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDeleteMaterialMutation, useGetAllMaterialsQuery } from "../../redux/features/materialAPIEndPoint";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../layouts/layoutcomponents/loader";
import { closeModal } from "../../redux/slices/allModalSlice";

export default function DeleteMaterial() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const { refetch } = useGetAllMaterialsQuery();
    const [deleteData, { isLoading }] = useDeleteMaterialMutation();

    const handleDelete = async () => {
        try {
            const resp = await deleteData(data?.id ?? data?._id);
            if (resp?.data?.http_status_code === 200) {
                refetch();
                toast.success(resp?.data?.message || "Material deleted successfully");
                dispatch(closeModal());
            } else {
                toast.error(resp?.data?.message || "Failed to delete material");
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Are you sure you want to delete this material?</p>
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
        </>
    );
}
