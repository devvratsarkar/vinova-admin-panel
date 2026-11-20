import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import AddNewPostForm from "./AddNewPostForm";

export default function AddNewPost() {
  return (
    <>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader titles="Blogs" active="Add Blog" items={["Home", "Blog List"]} links={["/dashboard", `/all-posts`]} />
        </Col>
        <Col className="text-end">
          <Link to={`/all-posts`} className="btn btn-success text-white me-3" > View All Post </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>Add New Blog</Card.Header>
            <Card.Body className="add_new_product">
              <AddNewPostForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
