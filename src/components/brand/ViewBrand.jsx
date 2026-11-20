import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import ViewBrandForm from "./ViewBrandForm";

export default function ViewBrand() {
  const { activeTab } = useLangTabs();

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles={`Brand (${activeTab?.toUpperCase()})`} active="View Brand" items={["Home", "Brand List"]} links={["/dashboard", "/brand"]} />
        </Col>
        <Col className="text-end">
          <Link to="/brand" className="btn btn-success text-white me-3">
            View All Brands
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="custom_tab_wrapper">
            <Card.Body>
              <Row className="mt-4">
                <ViewBrandForm lang={activeTab} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}