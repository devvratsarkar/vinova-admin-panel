import { Card, Row, Col } from "react-bootstrap";
import AffiliatePageForm from "./AffiliatePageForm";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../../hooks/useLangTabs";

export default function Career() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="CMS" active={`Affiliate Page (${activeTab?.toUpperCase()})`} items={['Home']} links={['/dashboard']} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AffiliatePageForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}