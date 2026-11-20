import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import ViewContactLensTypeForm from "./ViewContactLensTypeForm";

export default function ViewContactLensType() {
    const { id } = useParams();
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Contact Lens Type"
                        active="View Contact Lens Type"
                        items={["Home", "Contact Lens Type List"]}
                        links={["/dashboard", "/catalogue/contact-lens-type"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/contact-lens-type" className="btn btn-success text-white me-2">
                        Back to List
                    </Link>
                    <Link to={`/catalogue/contact-lens-type/edit/${id}`} className="btn btn-warning text-white">
                        Edit
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <ViewContactLensTypeForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
