import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import EditContactLensTypeForm from "./EditContactLensTypeForm";

export default function EditContactLensType() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Contact Lens Type"
                        active="Edit Contact Lens Type"
                        items={["Home", "Contact Lens Type List"]}
                        links={["/dashboard", "/catalogue/contact-lens-type"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/contact-lens-type" className="btn btn-success text-white">
                        Back to List
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <EditContactLensTypeForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
