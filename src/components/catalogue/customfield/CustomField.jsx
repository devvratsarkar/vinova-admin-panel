import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddCustomField from "./AddCustomField";
import { CustomFieldDataTable } from "../../../commondata/customfielddata";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import { hasPermission } from "../../../commondata/permissions";
import { TrashButton } from "../../common/ListFilters";

export default function CustomField() {
    const dispatch = useDispatch();
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const [viewingTrash, setViewingTrash] = useState(false)
    const showAdd = hasPermission(role, permissions, "CustomField", "add")
    const showTrash = hasPermission(role, permissions, "CustomField", "view-trash")
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Catalogue - CustomField" active="Custom Field" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                     {
                        showAdd && ( 
                    <Button onClick={() => { dispatch(openModal({ componentName: 'AddCustomField', })) }} className="btn btn-success" variant="success" > Add Custom Fields </Button>
                     )
                    }
                    <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Custom Field Trashed" backLabel="All fields" />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <CustomFieldDataTable viewingTrash={viewingTrash} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
