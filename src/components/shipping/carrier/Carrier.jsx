import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CarrierDatas } from "../../../commondata/carrierDatas";
import { getCarrierTrashPage } from "../../../utils/routes";

export default function Carrier() {
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Shipping-Carrier" active="Carrier List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          <Link to="/shipping/carrier/add-new-carrier" className="btn btn-success text-white me-3" > Add New </Link>

          <Link className="btn btn-danger text-white border-danger" to={`${getCarrierTrashPage()}`}>Carrier Trashed</Link>

        </Col>
      </Row>
      <Card>
        <CarrierDatas />
      </Card>
    </>
  );
}
