import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from "../../layouts/layoutcomponents/pageheader"
import { Link } from 'react-router-dom'
import CurrrencyDataTable from '../../commondata/currencyDataTable'
export default function Currency() {
    return (
        <>
            <Row>
                <Col as={Col} md={6}>
                    <PageHeader titles="Currency" active="Currency List" items={["Home"]} links={["/dashoards"]} />
                </Col>
                {/* <Col as={Col} md={6} className='d-flex justify-content-end align-items-center gap-3'>
                    <Link className='btn btn-success' to={"/add-currency"}>Add Currency</Link>
                    <Link className='btn btn-danger' to={"/trash-currency"} >Trash</Link>
                </Col> */}
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <CurrrencyDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
