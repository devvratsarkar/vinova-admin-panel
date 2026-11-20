import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { hasPermission } from "../../commondata/permissions";

export default function CustomerDetails({ singleOrder }) {
  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const showOrderEdit = hasPermission(role, permissions, "Order", "edit");
  const customer_details = singleOrder?.shipping_address;

  return (
    <Card className="mb-3">
      <Card.Body className="order_details_data">
        <Row>
          <Card.Header className="justify-content-center border-0 mb-3 fs-6 fw-bolder text-decoration-underline">Customer Details</Card.Header>
        </Row>
        <Row className="mb-5">
          <div className="customer_details">
            <p><span className="fw-bolder">Name</span> - {singleOrder?.user?.name || "N/A"}</p>
            <p><span className="fw-bolder">Email ID</span> - {singleOrder?.user?.email || "N/A"}</p>
            <p><span className="fw-bolder">Phone</span> - {singleOrder?.user?.phone_number || "N/A"}</p>
          </div>
        </Row>
        <Row>
          <Card.Header className="justify-content-center border-0 mb-3 fs-6 fw-bolder text-decoration-underline">Shipping Address</Card.Header>
        </Row>
        <Row className="mb-3">
          <p>
            <span className="fw-bolder">Address</span> - {customer_details?.address_line_one}, {customer_details?.city || "N/A"}, {customer_details?.country || "N/A"}, {customer_details?.postal_code || "N/A"}
          </p>
          <p><span className="fw-bolder">Phone</span> - {customer_details?.phone_number || "N/A"}</p>
          <p><span className="fw-bolder">email</span> - {customer_details?.email || "N/A"}</p>
        </Row>
        <Row>
          <Card.Header className="justify-content-center border-0 mb-3 fs-6 fw-bolder text-decoration-underline">Billing Address</Card.Header>
        </Row>
        <Row>
          <p>
             <span className="fw-bolder">Address</span>{customer_details?.address_line_one}, {customer_details?.city || "N/A"}, {customer_details?.country || "N/A"}, {customer_details?.postal_code || "N/A"}
          </p>
          <p> <span className="fw-bolder">Phone</span> - {customer_details?.phone_number || "N/A"}</p>
          <p> <span className="fw-bolder">email</span> - {customer_details?.email || "N/A"}</p>
        </Row>
      </Card.Body>
    </Card>
  );
}