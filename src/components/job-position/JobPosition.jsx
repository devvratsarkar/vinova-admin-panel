import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import JobPositionDataTable from "../../commondata/JobPositionData";
import { hasPermission } from "../../commondata/permissions";
import { TrashButton } from "../common/ListFilters";

export default function JobPosition() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const [viewingTrash, setViewingTrash] = useState(false)
    const showAdd = hasPermission(role, permissions, "JobOpening", "add")
    const showView = hasPermission(role, permissions, "JobOpening", "add")
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="CMS" active="Job Positions List" items={["Home"]} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {
                        showAdd && (
                            <Link to='/cms/add-job-positions' className="btn btn-success text-white me-3" >Add Job Position</Link>
                        )
                    }
                    <TrashButton show={hasPermission(role, permissions, "JobOpening", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Trash" backLabel="All positions" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <JobPositionDataTable viewingTrash={viewingTrash} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
