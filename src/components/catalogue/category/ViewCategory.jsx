import { Card, Row, Col } from "react-bootstrap";
import useLangTabs from "../../../hooks/useLangTabs";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import ViewCategoryFrom from "./ViewCategoryFrom";

export default function ViewCategory() {
  const { activeTab } = useLangTabs();

  return (
    <>
      <PageHeader titles="View Category" active={`View Category (${activeTab?.toUpperCase()})`} items={["Home", "Category List"]} links={["/dashboard", "/catalogue/category/"]} />

      <Row>
        <Col>
          <Card className="custom_tab_wrapper">
            <Card.Body>
              <Row className="mt-4">
                <ViewCategoryFrom lang={activeTab} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}