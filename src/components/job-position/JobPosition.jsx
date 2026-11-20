import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import JobPositionDataTable from "../../commondata/JobPositionData";

export default function JobPosition() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "SuperAdmin" || (role === "Staff" && permissions.JobOpening.includes("add"))
    const showView = role === "SuperAdmin" || (role === "Staff" && permissions.JobOpening.includes("add"))
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
                    {
                        showAdd && (
                            <Link to='/cms/trash-job-positions' className="btn btn-danger text-white me-3" >Trash</Link>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <JobPositionDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
