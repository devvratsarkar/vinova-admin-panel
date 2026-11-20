import React, { useState } from "react";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { AccessoriesDataTable } from "../../commondata/AccessoriesDataTable";
import { hasPermission } from "../../commondata/permissions";
import { TrashButton } from "../../components/common/ListFilters";

export default function AllAccessories() {
  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const [viewingTrash, setViewingTrash] = useState(false)
  const showAdd = hasPermission(role, permission, "Accessories", "add")
  const showTrash = hasPermission(role, permission, "Accessories", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Accessories" active="Accessories List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
           {
            showAdd && ( 
          <Link to="/catalogue/accessories/add" className="btn btn-success text-white me-3">Add Accessories</Link>
           )
          }
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Accessories Trashed" backLabel="All accessories" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <AccessoriesDataTable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
