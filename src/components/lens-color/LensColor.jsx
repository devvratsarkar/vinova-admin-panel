import React, { useState } from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LensColorDataTable } from "../../commondata/lensColorDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { allow } from "../../commondata/permissions";
import { TrashButton } from "../../components/common/ListFilters";



export default function LensColor() {
    const [viewingTrash, setViewingTrash] = useState(false)
    return (
        <>
            <Row className="align-items-center">
                <Col> <PageHeader titles="Lens Color" active="Lens Solor List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {allow("LensColor", "add") && <Link to="/catalogue/lens-color/add" className="btn btn-success text-white me-3" >Add Lens Color</Link>}
                    <TrashButton show={allow("LensColor", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Lens Color trash" backLabel="All colors" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <Alert variant="warning">For non-prescription sunglasses, the lens color will be sourced from the value defined in the custom field.</Alert>
                            <LensColorDataTable viewingTrash={viewingTrash} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
