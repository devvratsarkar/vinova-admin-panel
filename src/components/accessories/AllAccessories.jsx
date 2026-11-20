import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { AccessoriesDataTable } from "../../commondata/AccessoriesDataTable";

export default function AllAccessories() {
  const role = localStorage.getItem("role")
  const permission = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permission.Frame.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permission.Frame.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col> <PageHeader titles="Accessories" active="Accessories List" items={["Home"]} links={['/dashboard']} /> </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {/* {
            showAdd && ( */}
          <Link to="/catalogue/accessories/add" className="btn btn-success text-white me-3">Add Accessories</Link>
          {/* )
          }
          { */}
          {/* showTrash && ( */}
          <Link className="btn btn-danger text-white" to={`/catalogue/accessories/deleted`}>Accessories Trashed</Link>
          {/* )
          } */}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <AccessoriesDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
