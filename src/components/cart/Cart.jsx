import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartDataTable from "../../commondata/cartDataTable";

export default function Cart() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Cart"
                active="Cart"
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
              <CartDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
