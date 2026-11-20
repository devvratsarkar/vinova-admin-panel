import React from "react";
import { Row, Card, Col, } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import { BlogsDataTable } from "./BlogsDataTable";

export default function AllPosts() {
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Blogs" active="Blog List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end">
          <Link to={`/add-new-post`} className="btn btn-success text-white me-3" > Add New Blogs </Link>
          <Link to={`/all-posts/trash`} className="btn btn-danger">Blog Trashed</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BlogsDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
