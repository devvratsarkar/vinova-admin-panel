import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { OptometristDataTable } from "../../commondata/OptometristDataTable";

export default function AllOptometristStore() {
    return (
        <>
            <Row className="align-items-center">
                <Col><PageHeader titles="Optometrist Store" active="Optometrist Store List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    <Link to="/optometrist/store/add" className="btn btn-success text-white me-3" >Add New Store</Link>
                    <Link className="btn btn-danger text-white" to={`/optometrist/store/deleted`}>Store Trashed</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <OptometristDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
