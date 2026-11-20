import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import {
  Row,
  Card,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { BrandDataTable } from "../../commondata/brandData";
import { hasPermission } from "../../commondata/permissions";
import { TrashButton } from "../../components/common/ListFilters";

export default function Brand() {

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const [viewingTrash, setViewingTrash] = useState(false)
  const showAdd = hasPermission(role, permissions, "Brand", "add")
  const showTrash = hasPermission(role, permissions, "Brand", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Brand" active="Brand List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
           {
            showAdd && ( 
          <Link to="/add-brand" className="btn btn-success text-white me-3">Add Brand</Link>
           )
          }
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Brand Trashed" backLabel="All brands" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BrandDataTable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
