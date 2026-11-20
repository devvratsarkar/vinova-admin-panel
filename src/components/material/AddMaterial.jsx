import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import AddMaterialForm from "./AddMaterialForm";

export default function AddMaterial() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Material"
                        active="Add Material"
                        items={["Home", "Material List"]}
                        links={["/dashboard", "/catalogue/material"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <AddMaterialForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
