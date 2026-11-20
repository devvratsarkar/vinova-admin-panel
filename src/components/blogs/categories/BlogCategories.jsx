import React, { useState } from 'react'
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { BlogsCategoriesDatatable } from './BlogsCategoriesDatatable';
import { allow } from '../../../commondata/permissions';
import { TrashButton } from '../../common/ListFilters';
export default function BlogCategories() {
  const [viewingTrash, setViewingTrash] = useState(false)
  return (
    <>
      <Row className="align-items-center">
        <Col><PageHeader titles="Blog Categories" active="Blog Categories List" items={["Home",]} links={["/dashboard"]} /></Col>
        <Col className="text-end">
          {allow("BlogCategory", "add") && <Link to={`/add-new-blog-category`} className="btn btn-success text-white me-3" >Add New Category</Link>}
          <TrashButton show={allow("BlogCategory", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Categories Trashed" backLabel="All categories" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BlogsCategoriesDatatable viewingTrash={viewingTrash} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
