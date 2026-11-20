import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { DisputeDataTable } from "../../commondata/disputeData";


export default function Dispute() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Dispute" active="Dispute List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-4">
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <DisputeDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
