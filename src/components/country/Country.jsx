import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from "../../layouts/layoutcomponents/pageheader"
import CountryDataTable from '../../commondata/countryDataTable'
export default function Country() {
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="Country" active="CountryList" items={["Home"]} links={["/dashoards"]} />
                </Col>
            </Row>,
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <CountryDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
