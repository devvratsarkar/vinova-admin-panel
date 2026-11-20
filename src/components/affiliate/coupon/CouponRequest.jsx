import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import CouponRequestDataTable from "./CouponRequestDataTable";

export default function CouponRequest() {

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Coupon Request"
                active="Coupon Request"
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
              <CouponRequestDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
