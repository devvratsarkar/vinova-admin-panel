import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ContactLensTypeDataTable } from "../../commondata/contactLensTypeDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function ContactLensType() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Contact Lens Type"
                        active="Contact Lens Type List"
                        items={["Home"]}
                        links={["/dashboard"]}
                    />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    <Link
                        to="/catalogue/contact-lens-type/add"
                        className="btn btn-success text-white me-3"
                    >
                        Add Contact Lens Type
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <ContactLensTypeDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
