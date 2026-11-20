import React, { useState } from "react";
import { hasPermission } from "../../commondata/permissions";
// import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FrameDataTable } from "../../commondata/frameDataTable";
import { TrashButton } from "../../components/common/ListFilters";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function Frame() {
  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const [viewingTrash, setViewingTrash] = useState(false)
  const showAdd = hasPermission(role, permission, "Frame", "add")
  const showTrash = hasPermission(role, permission, "Frame", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Frame" active="Frame List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
           {
            showAdd && ( 
          <Link to="/catalogue/frames/add" className="btn btn-success text-white me-3" >Add Frame</Link>
           )
          }
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Frame Trashed" backLabel="All frames" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <FrameDataTable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
