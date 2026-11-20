import React from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LensColorDataTable } from "../../commondata/lensColorDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { allow } from "../../commondata/permissions";



export default function LensColor() {
    return (
        <>
            <Row className="align-items-center">
                <Col> <PageHeader titles="Lens Color" active="Lens Solor List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {allow("LensColor", "add") && <Link to="/catalogue/lens-color/add" className="btn btn-success text-white me-3" >Add Lens Color</Link>}
                    {allow("LensColor", "view-trash") && <Link className="btn btn-danger text-white" to={`/catalogue/lens-color/deleted-items`}>Lens Color trash</Link>}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <Alert variant="warning">For non-prescription sunglasses, the lens color will be sourced from the value defined in the custom field.</Alert>
                            <LensColorDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
