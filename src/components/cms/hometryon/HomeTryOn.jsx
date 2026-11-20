import { Card, Row, Col } from "react-bootstrap";
import HomeTryOnPageForm from "./HomeTryOnPageForm";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../../hooks/useLangTabs";

export default function HomeTryOn() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="CMS" active={`Home Try On Page (${activeTab?.toUpperCase()})`} items={['Home']} links={['/dashboard']} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <HomeTryOnPageForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}