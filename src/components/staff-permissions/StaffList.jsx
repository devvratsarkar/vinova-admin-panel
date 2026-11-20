import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import StaffPermissionDataTable from "../../commondata/staffPermissionData";

export default function StaffList() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Roles & Permissions"
                        active="Staff"
                        items={["Home"]}
                        links={["/dashboard"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/staff-permissions/staff/add" className="btn btn-success text-white">
                        Add Staff
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <StaffPermissionDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
