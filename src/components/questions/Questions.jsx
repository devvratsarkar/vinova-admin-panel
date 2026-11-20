import React, { useState } from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LensColorDataTable } from "../../commondata/lensColorDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { QuestionDataTable } from "../../commondata/questionDataTable";
import { allow } from "../../commondata/permissions";
import { TrashButton } from "../../components/common/ListFilters";



export default function Questions() {
    const [viewingTrash, setViewingTrash] = useState(false)
    return (
        <>
            <Row className="align-items-center">
                <Col> <PageHeader titles="Questions" active="Question List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {allow("Question", "add") && <Link to="/question/add" className="btn btn-success text-white me-3" >Add Question</Link>}
                    <TrashButton show={allow("Question", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Questions trash" backLabel="All questions" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <QuestionDataTable viewingTrash={viewingTrash} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
