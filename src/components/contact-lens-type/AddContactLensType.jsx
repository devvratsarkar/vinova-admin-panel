import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import AddContactLensTypeForm from "./AddContactLensTypeForm";

export default function AddContactLensType() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Contact Lens Type"
                        active="Add Contact Lens Type"
                        items={["Home", "Contact Lens Type List"]}
                        links={["/dashboard", "/catalogue/contact-lens-type"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <AddContactLensTypeForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
