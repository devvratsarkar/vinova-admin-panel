import React from "react";
// import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
// import { getCategoryDeletedItemsPage } from "../../../utils/routes";
import { FrameDataTable } from "../../commondata/frameDataTable";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function Frame() {
  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permission.Frame.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permission.Frame.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Frame" active="Frame List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {/* {
            showAdd && ( */}
          <Link to="/catalogue/frames/add" className="btn btn-success text-white me-3" >Add Frame</Link>
          {/* )
          }
          { */}
          {/* showTrash && ( */}
          <Link className="btn btn-danger text-white" to={`/catalogue/frames/deleted`}>Frame Trashed</Link>
          {/* )
          } */}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <FrameDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
