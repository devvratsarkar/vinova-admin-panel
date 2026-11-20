import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AboutUsPageForm from "./AboutUsPageForm";
import useLangTabs from "../../../hooks/useLangTabs";

export default function AboutUs() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="CMS" active={`AboutUs Page (${activeTab?.toUpperCase()})`} items={['Home']} links={['/dashboard']} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AboutUsPageForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}