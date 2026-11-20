import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MaterialDataTable } from "../../commondata/materialDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function Material() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Material"
                        active="Material List"
                        items={["Home"]}
                        links={["/dashboard"]}
                    />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    <Link to="/catalogue/material/add" className="btn btn-success text-white me-3">
                        Add Material
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <MaterialDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
