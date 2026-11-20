import React, { useState } from "react";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { ContactLenseDataTable } from "../../commondata/contactLenseDataTable";
import { hasPermission } from "../../commondata/permissions";
import { TrashButton } from "../../components/common/ListFilters";

export default function AllContactLens() {
  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const [viewingTrash, setViewingTrash] = useState(false)
  const showAdd = hasPermission(role, permission, "ContactLens", "add")
  const showTrash = hasPermission(role, permission, "ContactLens", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Contact Lenses" active="Contact Lenses List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
           {
            showAdd && ( 
          <Link to="/catalogue/contact-lenses/add" className="btn btn-success text-white me-3" >Add Contact Lens</Link>
           )
          }
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Contact Lenses Trashed" backLabel="All contact lenses" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ContactLenseDataTable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
