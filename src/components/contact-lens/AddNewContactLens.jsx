import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddNewContactLensForm from "./AddNewContactLensForm";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function AddNewContactLens() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles={`Contact Lens (${activeTab?.toUpperCase()})`} active="Add New Contact Lens" items={["Home", "Contact Lens List"]} links={["/dashboard", "/catalogue/contact-lenses"]} />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/contact-lenses" className="btn btn-success text-white me-3">
                        View All Contact Lenses
                    </Link>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AddNewContactLensForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}