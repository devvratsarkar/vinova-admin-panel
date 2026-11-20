import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { Link } from 'react-router-dom'
import PolicyDatatable from '../../../commondata/policyDatatable'
import { allow } from '../../../commondata/permissions'

export default function PolicyPage() {
    return (
        <>
            <Row className="justify-content-between">
                <Col>
                    <PageHeader titles="Policy Page" active="Policy Page List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className='d-flex justify-content-end align-items-center'>
                    {allow("Policy", "add") && <Link to={"/add-policy"} className=' btn btn-success'>Add Policies</Link>}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <PolicyDatatable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}