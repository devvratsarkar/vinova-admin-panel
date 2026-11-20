import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import {
    useGetAllDisputesQuery,
    useGetDisputeMessagesQuery,
    useSendDisputeMessageMutation,
} from '../../redux/features/disputeAPIEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import 'react-chat-elements/dist/main.css';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { DisputeMessageValidation } from '../../commondata/formvalidations'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { closeModal } from '../../redux/slices/allModalSlice'

const getDisputeId = (row) => row?.id ?? row?._id;

export default function ReplyDisputeMessage() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const [sendDisputeMessage, { isLoading: loading }] = useSendDisputeMessageMutation()
    const { refetch: refetchAllDisputes } = useGetAllDisputesQuery();
    const { refetch: refetchMessages } = useGetDisputeMessagesQuery(getDisputeId(data), {
        skip: !getDisputeId(data),
    });

    const dispatch = useDispatch()

    const initialValues = {
        orderId: data?.orderId ?? "",
        disputeId: getDisputeId(data) ?? "",
        message: "",
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm } = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: DisputeMessageValidation,
        onSubmit: async (formValues) => {
            try {
                const response = await sendDisputeMessage({
                    orderId: formValues.orderId,
                    disputeId: formValues.disputeId,
                    message: formValues.message,
                });
                if (response?.data?.http_status_code === 200) {
                    refetchAllDisputes()
                    refetchMessages()
                    toast.success(response.data.message || "Message sent successfully")
                    resetForm()
                    dispatch(closeModal())
                } else {
                    toast.error(response?.data?.message || "Failed to send message")
                }
            } catch (err) {
                toast.error(err?.message || "An error occurred")
            }
        },
    });

    return (
        <>
            {loading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="bg-primary">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                        Dispute Reply
                    </Modal.Title>
                    <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="">
                        <i className="fe fe-x"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="p-2">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>
                                        Message<span className="text-danger">*</span>
                                    </Form.Label>
                                    <textarea
                                        name="message"
                                        value={values.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="border border-dark w-100 rounded-3"
                                        rows={5}
                                    />
                                    {errors.message && touched.message ? (
                                        <p className="error">{errors.message}</p>
                                    ) : null}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="my-2 justify-content-center">
                            <button type="submit" className="btn btn-primary w-auto mt-3">
                                Send
                            </button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
