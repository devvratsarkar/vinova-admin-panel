import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";
import ViewFrameForm from "./ViewFrameForm";

export default function ViewFrame() {
  const { activeTab } = useLangTabs();

  return (
    <>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader titles="Frame" active={`View Frame (${activeTab?.toUpperCase()})`} items={["Home", "Frame List"]} links={["/dashboard", "/catalogue/frames"]}
          />
        </Col>
        <Col className="text-end">
          <Link to="/catalogue/frames" className="btn btn-success text-white me-3">
            View All Frames
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="custom_tab_wrapper">
            <Card.Body>
              <Row className="mt-4">
                <ViewFrameForm lang={activeTab} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}