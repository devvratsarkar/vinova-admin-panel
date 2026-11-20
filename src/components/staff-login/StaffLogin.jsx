import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import LoginDataTale from "../../commondata/LoginDataTale";

export default function StaffLogin() {
  return (
    <>
      <Row>
        <Col>
          <PageHeader titles="Login Data" active="Staff Login" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <LoginDataTale />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
