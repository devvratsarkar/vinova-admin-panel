import { hasPermission } from "../../commondata/permissions";
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { Link } from 'react-router-dom'
import { LensDataTable } from '../../commondata/lensDataTable'
import { FilterDataTable } from '../../commondata/filterDataTable'
import { LensThicknessDataTable } from '../../commondata/lensThicknessDataTable'

export default function LensThickness() {
    const role = localStorage.getItem("role")
    const permission = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = hasPermission(role, permission, "LensSize", "add")
    const showTrash = hasPermission(role, permission, "LensSize", "view-trash")
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Refractive Index" active="Refractive Index List" items={["Home"]} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                     {
                        showAdd && ( 
                    <Link to="/catalogue/lens-thickness/add" className="btn btn-success text-white me-3" >Add Refractive Index</Link>
                     )
                    }
                    {
                        showTrash && ( 
                    <Link className="btn btn-danger text-white" to={`/catalogue/lens-thickness/deleted-list`}>Trashed Refractive Index</Link>
                     )
                    } 
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <LensThicknessDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    )
}
