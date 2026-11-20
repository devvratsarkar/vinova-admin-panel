import React, { useState } from "react";
import { Row, Card, Col, } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import { BlogsDataTable } from "./BlogsDataTable";
import { allow } from "../../commondata/permissions";
import { TrashButton } from "../common/ListFilters";

export default function AllPosts() {
  const [viewingTrash, setViewingTrash] = useState(false)
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Blogs" active="Blog List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end">
          {(allow("BlogPost", "add") || allow("BlogPostAdd", "view")) && <Link to={`/add-new-post`} className="btn btn-success text-white me-3" > Add New Blogs </Link>}
          <TrashButton show={allow("BlogPost", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Blog Trashed" backLabel="All posts" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BlogsDataTable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
