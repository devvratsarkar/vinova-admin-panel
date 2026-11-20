import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CategoryDataTable } from "../../../commondata/categorydata";
import { getCategoryDeletedItemsPage } from "../../../utils/routes";
import { allow } from "../../../commondata/permissions";

export default function Category() {
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Category" active="Category List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {allow("Category", "add") && <Link to="/catalogue/add-new-category" className="btn btn-success text-white me-3" >Add category</Link>}
          {allow("Category", "view-trash") && <Link className="btn btn-danger text-white" to={`${getCategoryDeletedItemsPage()}`}>Category Trashed</Link>}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CategoryDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
