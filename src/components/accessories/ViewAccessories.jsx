import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import ViewAccessoriesForm from "./ViewAccessoriesForm";

export default function ViewAccessories() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles={`Accessories (${activeTab?.toUpperCase()})`} active="View Accessories" items={["Home", "Accessories List"]} links={["/dashboard", "/catalogue/accessories"]} />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/accessories" className="btn btn-success text-white me-3">View All Accessories</Link>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <ViewAccessoriesForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}