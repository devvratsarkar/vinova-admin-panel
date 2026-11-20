import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { hasPermission } from "../../commondata/permissions";

import { Link } from "react-router-dom";
import { CouponData } from "../../../commondata/couponDatas";
import { CouponUsageDataTable } from "../../../commondata/couponDataTable";

export default function Couponusage() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = hasPermission(role, permissions, "Coupon", "add")
    const showTrash = hasPermission(role, permissions, "Coupon", "view-trash")
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Coupons" active="Coupon Usage List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <CouponUsageDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}