import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import { RxCross2 } from "react-icons/rx";
import moment from "moment";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useUpdateCouponRequestMutation } from "../../../redux/features/affiliateAPIEndPoint";

export default function CouponDetails() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [updateCouponRequest, { isLoading }] = useUpdateCouponRequestMutation();

    const [status, setStatus] = useState(data?.status || "Active");
    const [reason, setReason] = useState("");

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        if (newStatus === "Active" || newStatus === "Pending") {
            setReason("");
        }
    };

    const handleUpdate = async () => {
        try {
            const payload = { status };
            if (status === "Expired" || status === "Cancel") {
                payload.reason = reason;
            }

            const res = await updateCouponRequest({ id: data?._id, values: payload });
            if (res?.data?.http_status_code === 200) {
                toast.success(res?.data?.message);
                dispatch(closeModal());
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to update coupon");
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <Modal
                show={isOpen}
                onHide={() => dispatch(closeModal())}
                centered
                size="lg"
            >
                <Modal.Header className="d-flex justify-content-between align-items-center border-bottom-0">
                    <Modal.Title className="fw-semibold fs-5 text-dark">
                        Coupon Details
                    </Modal.Title>
                    <div
                        className="cursor-pointer"
                        onClick={() => dispatch(closeModal())}
                        style={{ fontSize: "20px", cursor: "pointer" }}
                    >
                        <RxCross2 />
                    </div>
                </Modal.Header>

                <Modal.Body className="border-top">
                    <div className="mt-3">
                        {/* General Info */}
                        <div className="mb-3 pb-3 border-bottom border-dashed">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <p className="small fw-semibold text-dark mb-0">
                                    Created On:{" "}
                                    {data?.createdAt
                                        ? moment(data.createdAt).format("DD MMM YYYY | hh:mma").toUpperCase()
                                        : ""}
                                </p>
                                <Form.Select
                                    size="sm"
                                    className="w-auto"
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Inactive</option>
                                    <option value="Cancel">Cancelled</option>
                                </Form.Select>
                            </div>
                        </div>

                        {/* Reason input */}
                        {(status === "Cancel" || status === "Expired") && (
                            <div className="mb-3">
                                <Form.Label className="fw-semibold">Reason</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={`Enter reason for ${status}`}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Coupon Details */}
                        <div className="pt-2">
                            <p className="fw-semibold text-dark">Coupon Information</p>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">Coupon Code</p>
                                <p className="fw-semibold mb-0">{data?.coupon_code}</p>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">Give %</p>
                                <p className="fw-semibold mb-0">{data?.give_percent}%</p>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">Take %</p>
                                <p className="fw-semibold mb-0">{data?.take_percent}%</p>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">Expiry Date</p>
                                <p className="fw-semibold mb-0">
                                    {moment(data?.expiry_date).format("DD MMM YYYY")}
                                </p>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">Created By</p>
                                <p className="fw-semibold mb-0">{data?.user_id?.name}</p>
                            </div>
                            {data?.user_id?.phone_number && (
                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Phone</p>
                                    <p className="fw-semibold mb-0">{data?.user_id?.phone_number}</p>
                                </div>
                            )}
                            {data?.user_id?.email && (
                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Email</p>
                                    <p className="fw-semibold mb-0">{data?.user_id?.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                    {status !== "Pending" && (
                        <Button
                            variant="primary"
                            className="w-100 fw-semibold"
                            onClick={handleUpdate}
                            disabled={(status === "Inactive" || status === "Cancelled") && !reason.trim()}
                        >
                            Update
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}
