import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import WithdrawalRequestDataTable from "./WithdrawalRequestDataTable";

export default function WithdrawalRequest() {

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Withdrawal Request"
                active="Withdrawal Request"
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
              <WithdrawalRequestDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
