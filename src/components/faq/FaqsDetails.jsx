import React from 'react'
import PageHeader from "../../layouts/layoutcomponents/pageheader"
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FaqsDatatable from '../../commondata/faqDataTable'


export default function FaqsDetails() {

    return (
        <>
            <Row className='align-items-center'>
                <Col as={Col} md={6}>
                    <PageHeader titles="Add FAQs" active="Add FAQs" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col as={Col} md={6} className='text-end'>
                    <Link to={'/cms/faqs/add'} className='btn btn-success'>Add FAQs</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <FaqsDatatable />
                    </Card>
                </Col>
            </Row>
        </>

    )
}

