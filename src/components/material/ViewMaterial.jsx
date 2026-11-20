import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import ViewMaterialForm from "./ViewMaterialForm";

export default function ViewMaterial() {
    const { id } = useParams();
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Material"
                        active="View Material"
                        items={["Home", "Material List"]}
                        links={["/dashboard", "/catalogue/material"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/material" className="btn btn-success text-white me-2">
                        Back to List
                    </Link>
                    <Link to={`/catalogue/material/edit/${id}`} className="btn btn-warning text-white">
                        Edit
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <ViewMaterialForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
