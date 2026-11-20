import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { hasPermission } from "../../commondata/permissions";

import { Link } from "react-router-dom";
import { CouponData } from "../../commondata/couponDatas";
import { TrashButton } from "../../components/common/ListFilters";

export default function Coupon() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const [viewingTrash, setViewingTrash] = useState(false)
  const showAdd = hasPermission(role, permissions, "Coupon", "add")
  const showTrash = hasPermission(role, permissions, "Coupon", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Coupons" active="Coupon List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-2">
           {
            showAdd && ( 
          <Link className="btn btn-success text-white" to={`/add-coupon`}> Add New Coupon </Link>
           )
          }
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Coupon Trashed" backLabel="All coupons" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CouponData viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}