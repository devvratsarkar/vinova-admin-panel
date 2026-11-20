import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CarrierDatas } from "../../../commondata/carrierDatas";
import { allow } from "../../../commondata/permissions";
import { TrashButton } from "../../common/ListFilters";

export default function Carrier() {
  const [viewingTrash, setViewingTrash] = useState(false)
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Shipping-Carrier" active="Carrier List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {allow("Carrier", "add") && <Link to="/shipping/carrier/add-new-carrier" className="btn btn-success text-white me-3" > Add New </Link>}
          <TrashButton show={allow("Carrier", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Carrier Trashed" backLabel="All carriers" />

        </Col>
      </Row>
      <Card>
        <CarrierDatas viewingTrash={viewingTrash} />
      </Card>
    </>
  );
}
