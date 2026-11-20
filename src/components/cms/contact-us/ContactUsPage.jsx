import { Card, Row, Col } from "react-bootstrap";
import ContactUsPageForm from "./ContactUsPageForm";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../../hooks/useLangTabs";

export default function ContactUsPage() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="CMS" active={`Contact Us Page (${activeTab?.toUpperCase()})`} items={['Home']} links={['/dashboard']} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <ContactUsPageForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}