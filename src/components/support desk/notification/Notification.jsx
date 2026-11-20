import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { hasPermission } from "../../../commondata/permissions";
Link;
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import { NotificationDataTable } from "../../../commondata/notificationData";

function Notification() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = hasPermission(role, permissions, "Notification", "add")
  const showTrash = hasPermission(role, permissions, "Notification", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Support Desk" active="Email Notification List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {
            showAdd && (
              <Link className="btn btn-success border-success fit-content" to="/support-desk/notification/add-notification" > Add New Notification </Link>
            )
          }
          {
            showTrash && (
              <Link className="btn btn-danger text-white fit-content" to={`/support-desk/notification-deleted-items`}>Notification Trashed</Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <NotificationDataTable />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Notification;
