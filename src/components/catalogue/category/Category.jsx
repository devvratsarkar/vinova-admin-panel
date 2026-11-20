import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CategoryDataTable } from "../../../commondata/categorydata";
import { allow } from "../../../commondata/permissions";
import { TrashButton } from "../../common/ListFilters";

export default function Category() {
  const [viewingTrash, setViewingTrash] = useState(false)
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Category" active="Category List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {allow("Category", "add") && <Link to="/catalogue/add-new-category" className="btn btn-success text-white me-3" >Add category</Link>}
          <TrashButton show={allow("Category", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Category Trashed" backLabel="All categories" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CategoryDataTable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
