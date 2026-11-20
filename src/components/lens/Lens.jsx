import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { Link } from 'react-router-dom'
import { LensDataTable } from '../../commondata/lensDataTable'

export default function Lens() {
    const role = localStorage.getItem("role")
    const permission = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permission.Lens.includes("add"))
    const showTrash = role === "Admin" || (role === "Staff" && permission.Lens.includes("view-trash"))
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Lens quality category" active="Lens quality category List" items={["Home"]} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {/* {
                        showAdd && ( */}
                    <Link to="/catalogue/lens/add" className="btn btn-success text-white me-3" >Add Lens quality category</Link>
                    {/* )
                    }
                    {
                        showTrash && ( */}
                    <Link className="btn btn-danger text-white" to={`/catalogue/lens/deleted`}>Trashed Lens quality category</Link>
                    {/* )
                    } */}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <LensDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    )
}
