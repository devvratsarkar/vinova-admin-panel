import { hasPermission } from "../../commondata/permissions";
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { Link } from 'react-router-dom'
import { LensDataTable } from '../../commondata/lensDataTable'
import { TrashButton } from '../../components/common/ListFilters'

export default function Lens() {
    const role = localStorage.getItem("role")
    const permission = JSON.parse(localStorage.getItem("permissions"))

    const [viewingTrash, setViewingTrash] = useState(false)
    const showAdd = hasPermission(role, permission, "Lens", "add")
    const showTrash = hasPermission(role, permission, "Lens", "view-trash")
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Lens quality category" active="Lens quality category List" items={["Home"]} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                     {
                        showAdd && ( 
                    <Link to="/catalogue/lens/add" className="btn btn-success text-white me-3" >Add Lens quality category</Link>
                     )
                    }
                    <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Trashed Lens quality category" backLabel="All lenses" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <LensDataTable viewingTrash={viewingTrash} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    )
}
