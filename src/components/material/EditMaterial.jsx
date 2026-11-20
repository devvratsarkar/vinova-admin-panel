import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import EditMaterialForm from "./EditMaterialForm";

export default function EditMaterial() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Material"
                        active="Edit Material"
                        items={["Home", "Material List"]}
                        links={["/dashboard", "/catalogue/material"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/material" className="btn btn-success text-white">
                        Back to List
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <EditMaterialForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
