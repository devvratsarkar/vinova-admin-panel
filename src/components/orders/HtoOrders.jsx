import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { HtoOrdersDataTable } from "../../commondata/htoOrdersdata";

export default function HtoOrders() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="HTO Orders"
                active="HTO Orders"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <HtoOrdersDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
