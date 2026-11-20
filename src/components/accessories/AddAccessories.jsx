import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddAccessoriesForm from "./AddAccessoriesForm";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function AddAccessories() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles={`Accessories (${activeTab?.toUpperCase()})`} active="Add New Accessories" items={["Home", "Accessories List"]} links={["/dashboard", "/catalogue/accessories"]} />
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
                                <AddAccessoriesForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}