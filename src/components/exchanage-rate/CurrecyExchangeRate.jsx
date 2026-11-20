import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from "../../layouts/layoutcomponents/pageheader"
import { Link } from 'react-router-dom'
import CurrrencyExchangeRateDataTable from '../../commondata/currencyExchangerateDataTable'
export default function CurrencyExchangeRate() {
    return (
        <>
            <Row>
                <Col as={Col} md={6}>
                    <PageHeader titles="Currency Exchange Rate" active="Currency Exchange Rate List" items={["Home"]} links={["/dashoards"]} />
                </Col>
                {/* <Col as={Col} md={6} className='d-flex justify-content-end align-items-center gap-3'>
                    <Link className='btn btn-success' to={"/add-currency-exchange-rate"}>Add Currency Exchange Rate</Link>
                    <Link className='btn btn-danger' to={"/trash-currency"} >Trash</Link>
                </Col> */}
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <CurrrencyExchangeRateDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
