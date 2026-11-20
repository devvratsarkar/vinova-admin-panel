import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import { RxCross2 } from "react-icons/rx";
import { BsCopy } from "react-icons/bs";
import moment from "moment";
import { useUpdateWithdrawalRequestMutation } from "../../../redux/features/affiliateAPIEndPoint";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";

export default function TransectionDetails() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const [updateWithdrawalRequest, { isLoading }] = useUpdateWithdrawalRequestMutation()
    const [copied, setCopied] = useState(null);
    const [status, setStatus] = useState(data?.status || "Completed");
    const [reason, setReason] = useState("");

    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy text", err);
        }
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        if (e.target.value === "Completed") {
            setReason(""); // reset reason if Completed
        }
    };

    const handleUpdate = async () => {
        const payload = { status };
        if (status === "Rejected" || status === "Cancelled") {
            payload.reason = reason;
        }
        try {
            const res = await updateWithdrawalRequest({ id: data?.id, values: payload });
            if (res?.data?.http_status_code === 200) {
                toast.success(res?.data?.message);
                dispatch(closeModal());
            }
        } catch (error) {

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
                        Transaction Details
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
                        <div className="mb-3 pb-3 border-bottom border-dashed">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <p className="small fw-semibold text-dark mb-0">
                                    {data?.createdAt
                                        ? moment(data.createdAt).format("DD MMM YYYY | hh:mma").toUpperCase()
                                        : ""}
                                </p>
                                <p className="fw-semibold fs-5 text-dark mb-0">
                                   {data?.currency_symbol}{data?.amount}
                                </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2 small text-muted">
                                    <span>Trans ID: {data?.reference_id}</span>
                                    {data?.reference_id && (
                                        <>
                                            <BsCopy
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleCopy(data.reference_id, "reference")}
                                            />
                                            {copied === "reference" && (
                                                <span className="text-success small">Copied!</span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Dropdown for status */}
                                <Form.Select
                                    size="sm"
                                    className="w-auto"
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Form.Select>
                            </div>
                        </div>

                        {/* Reason input for Rejected/Cancelled */}
                        {(status === "Rejected" || status === "Cancelled") && (
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

                        <div className="pt-3">
                            <p className="fw-semibold text-dark">Amount Details</p>
                            {data?.user?.phone_number && (
                                <div className="d-flex justify-content-between mb-2 mt-5">
                                    <p className="text-muted mb-0">Phone</p>
                                    <p className="fw-semibold mb-0">{data?.user?.phone_number}</p>
                                </div>
                            )}
                            {data?.user?.email && (
                                <div className={`d-flex justify-content-between mb-2 ${data?.user?.phone_number ? "" : "mt-5"}`}>
                                    <p className="text-muted mb-0">Email</p>
                                    <p className="fw-semibold mb-0">{data?.user?.email}</p>
                                </div>
                            )}
                            <div className={`d-flex justify-content-between mb-2 ${!data?.user?.phone_number && !data?.user?.email ? "mt-5" : ""}`}>
                                <p className="text-muted mb-0">Bank Name</p>
                                <p className="fw-semibold mb-0">{data?.bank?.bank_name || 'Paypal'}</p>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">Account Holder Name</p>
                                <p className="fw-semibold mb-0">{data?.bank?.holder_name || data?.paypal?.paypal_account_name}</p>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <p className="text-muted mb-0">{data?.bank ? 'Shaba Number' : 'Paypal Email'}</p>
                                <div className="fw-semibold d-flex align-items-center gap-2">
                                    {data?.bank?.account_number || data?.paypal?.paypal_email}
                                    {(data?.bank?.account_number || data?.paypal?.paypal_email) && (
                                        <>
                                            <BsCopy
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleCopy(
                                                    data?.bank?.account_number || data?.paypal?.paypal_email,
                                                    "account"
                                                )}
                                            />
                                            {copied === "account" && (
                                                <span className="text-success small">Copied!</span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            {data?.bank && (
                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Bank Account Number</p>
                                    <p className="fw-semibold mb-0">{data?.bank?.swift}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                    {status !== "Pending" && <Button
                        variant="primary"
                        className="w-100 fw-semibold"
                        onClick={handleUpdate}
                        disabled={(status === "Rejected" || status === "Cancelled") && !reason.trim()}
                    >
                        Update
                    </Button>}
                </Modal.Footer>
            </Modal>
        </>
    );
}
