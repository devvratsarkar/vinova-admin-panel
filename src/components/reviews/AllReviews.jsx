import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { AllReviewssData } from "../../commondata/allReviewsData";

export default function AllReviews() {

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="All Reviews" active="All Review" items={["Home"]} links={["/dashboard"]} />
        </Col>
        {/* <Col className="text-end d-flex justify-content-end gap-4">
          <Link to={``} className="btn btn-success text-white me-3">
            Add New Review
          </Link>
        </Col> */}
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <AllReviewssData  />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
