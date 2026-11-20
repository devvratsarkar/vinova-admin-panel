import React, { useState } from "react";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { OptometristDataTable } from "../../commondata/OptometristDataTable";
import { allow } from "../../commondata/permissions";
import { TrashButton } from "../common/ListFilters";

export default function AllOptometristStore() {
    const [viewingTrash, setViewingTrash] = useState(false)
    return (
        <>
            <Row className="align-items-center">
                <Col><PageHeader titles="Optometrist Store" active="Optometrist Store List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {allow("Accessories", "add") && <Link to="/optometrist/store/add" className="btn btn-success text-white me-3" >Add New Store</Link>}
                    <TrashButton show={allow("Accessories", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Store Trashed" backLabel="All stores" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <OptometristDataTable viewingTrash={viewingTrash} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
