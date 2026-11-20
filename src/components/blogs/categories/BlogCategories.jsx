import React from 'react'
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { BlogsCategoriesDatatable } from './BlogsCategoriesDatatable';
import { allow } from '../../../commondata/permissions';
export default function BlogCategories() {
  return (
    <>
      <Row className="align-items-center">
        <Col><PageHeader titles="Blog Categories" active="Blog Categories List" items={["Home",]} links={["/dashboard"]} /></Col>
        <Col className="text-end">
          {allow("BlogCategory", "add") && <Link to={`/add-new-blog-category`} className="btn btn-success text-white me-3" >Add New Category</Link>}
          {allow("BlogCategory", "view-trash") && <Link to={`/all-blog-categories/trash`} className="btn btn-danger">Categories Trashed</Link>}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BlogsCategoriesDatatable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
