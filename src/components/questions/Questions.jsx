import React from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LensColorDataTable } from "../../commondata/lensColorDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { QuestionDataTable } from "../../commondata/questionDataTable";



export default function Questions() {
    return (
        <>
            <Row className="align-items-center">
                <Col> <PageHeader titles="Questions" active="Question List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    <Link to="/question/add" className="btn btn-success text-white me-3" >Add Question</Link>
                    <Link className="btn btn-danger text-white" to={`/questions/deleted-items`}>Questions trash</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <QuestionDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
