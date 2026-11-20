import { hasPermission } from "../../commondata/permissions";
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { Link } from 'react-router-dom'
import { LensDataTable } from '../../commondata/lensDataTable'
import { FilterDataTable } from '../../commondata/filterDataTable'

export default function Filter() {
    const role = localStorage.getItem("role")
    const permission = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = hasPermission(role, permission, "LensType", "add")
    const showTrash = hasPermission(role, permission, "LensType", "view-trash")
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Coating" active="Coating List" items={["Home"]} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                     {
                        showAdd && ( 
                    <Link to="/catalogue/lens-type/add" className="btn btn-success text-white me-3" >Add Coating</Link>
                     )
                    }
                    {
                        showTrash && ( 
                    <Link className="btn btn-danger text-white" to={`/catalogue/lens-type/deleted-list`}>Trashed Coating</Link>
                     )
                    } 
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <FilterDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    )
}
