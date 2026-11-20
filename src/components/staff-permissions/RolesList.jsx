import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import RolesDataTable from "../../commondata/rolesData";

export default function RolesList() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader
                        titles="Roles & Permissions"
                        active="Roles"
                        items={["Home"]}
                        links={["/dashboard"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/staff-permissions/roles/add" className="btn btn-success text-white">
                        Add Role
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <RolesDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
