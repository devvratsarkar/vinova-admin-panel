import { Card, Row, Col } from "react-bootstrap";
import useLangTabs from "../../../hooks/useLangTabs";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import EditCategoryForm from "./EditCategoryForm";

export default function EditCategory() {
  const { activeTab } = useLangTabs();

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Category" active={`Edit Category (${activeTab?.toUpperCase()})`} items={["Home", "Category List"]} links={["/dashboard", "/catalogue/category/"]} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="custom_tab_wrapper">
            <Card.Body>
              <Row className="mt-4">
                <EditCategoryForm lang={activeTab} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}