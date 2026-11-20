import React, { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { hasPermission } from "../../../commondata/permissions";
Link;
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import { PushNotificationDataTable } from "../../../commondata/pushNotificationData";
import { TrashButton } from "../../common/ListFilters";

function PushNotification() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const [viewingTrash, setViewingTrash] = useState(false)
  const showAdd = hasPermission(role, permissions, "PushNotification", "add")
  const showTrash = hasPermission(role, permissions, "PushNotification", "view-trash")
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Support Desk" active="Push Notification List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {
            showAdd && (
              <Link className="btn btn-success border-success fit-content" to="/push-notification/add-push-notification" >Add New Push Notification</Link>
            )
          }
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Push Notification Trashed" backLabel="All notifications" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <PushNotificationDataTable viewingTrash={viewingTrash} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default PushNotification;
