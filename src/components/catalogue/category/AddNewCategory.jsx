import { Card, Row, Col } from "react-bootstrap";
import useLangTabs from "../../../hooks/useLangTabs";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AddNewCategoryForm from "./AddNewCategoryForm";
import { Link } from "react-router-dom";

export default function AddNewCategory() {
  const { activeTab } = useLangTabs();

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Category" active={`Add New Category (${activeTab?.toUpperCase()})`} items={["Home", "Category List"]} links={["/dashboard", "/catalogue/category/"]} />
        </Col>
        <Col className="text-end">
          <Link to="/catalogue/category" className="btn btn-success text-white me-3">View All category</Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="custom_tab_wrapper">
            <Card.Body>
              <Row className="mt-4">
                <AddNewCategoryForm lang={activeTab} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}