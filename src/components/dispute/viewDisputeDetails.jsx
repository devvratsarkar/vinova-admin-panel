import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { Link, useParams } from 'react-router-dom'
import {
    useGetAllDisputesQuery,
    useGetDisputeMessagesQuery,
    useUpdateDisputeStatusMutation,
} from '../../redux/features/disputeAPIEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import Error from '../../layouts/layoutcomponents/Error'
import 'react-chat-elements/dist/main.css';
import toast from 'react-hot-toast'
import { MessageList } from 'react-chat-elements'

export default function ViewDisputeDetails() {
    const { id } = useParams()
    const { data, isLoading, isError, error, refetch } = useGetDisputeMessagesQuery(id);
    const [updateStatus, { isLoading: updatingStatus }] = useUpdateDisputeStatusMutation()
    const { refetch: refetchAllDisputes } = useGetAllDisputesQuery();

    const disputeData = data?.data

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await updateStatus({ id: disputeData?.id, status: newStatus });
            if (response?.data?.http_status_code === 200) {
                refetch()
                refetchAllDisputes()
                toast.success(response?.data?.message || "Status updated successfully")
            } else {
                toast.error(response?.data?.message || "Failed to update status")
            }
        } catch (err) {
            toast.error(err?.message || "An error occurred")
        }
    };

    if (isLoading) {
        return <Loader />
    }
    if (isError) {
        return <Error error_mes={error} />
    }

    return (
        <>
            {updatingStatus && <Loader />}
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Dispute" active="View Dispute" items={["Home", "Dispute List"]} links={["/dashboard", "/dispute"]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="justify-content-between">
                            <Row>
                                <Col className="d-flex align-items-center">
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Dispute Status</Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={disputeData?.status || "open"}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                            >
                                                <option value="open">Open</option>
                                                <option value="pending">Pending</option>
                                                <option value="closed">Closed</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {disputeData?.orderData?.id && (
                                        <Link
                                            className="btn dispute-success-btn text-white"
                                            to={`/order-detail/${disputeData.orderData.id}`}
                                        >
                                            Order Detail
                                        </Link>
                                    )}
                                </Col>
                                <Col>
                                    <Link
                                        className="btn dispute-primary-btn text-white"
                                        to="/dispute"
                                    >
                                        View All Disputes
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p>
                                        <strong>Order ID : </strong> {disputeData?.orderId ?? "N/A"}
                                    </p>
                                </Col>
                            </Row>
                            <Row className="my-4">
                                <Col>
                                    <p>
                                        <strong>Customer Name : </strong> {disputeData?.created_by?.name ?? "N/A"}
                                    </p>
                                </Col>
                                <Col>
                                    <p>
                                        <strong>Email : </strong> {disputeData?.created_by?.email ?? "N/A"}
                                    </p>
                                </Col>
                            </Row>

                            <Row className="border border-1 py-1 px-2 rounded-3 dispute-backgroundcolor-text-parent">
                                <Form.Group>
                                    <Form.Label>Message</Form.Label>
                                    <textarea
                                        value={disputeData?.message || ""}
                                        className="border w-100 rounded-3"
                                        rows={5}
                                        disabled
                                    />
                                </Form.Group>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>Dispute Messages</Card.Header>
                                <Card.Body>
                                    <div className="chat-container">
                                        <MessageList
                                            className="message-list"
                                            lockable={true}
                                            toBottomHeight="100%"
                                            dataSource={disputeData?.disputeMessage?.map((msg) => ({
                                                position: msg.userType === "admin" ? "right" : "left",
                                                type: "text",
                                                text: msg?.message,
                                            })) ?? []}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}
