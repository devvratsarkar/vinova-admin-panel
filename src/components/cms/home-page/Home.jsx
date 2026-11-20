import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import HomePageForm from "./HomePageForm";
import useLangTabs from "../../../hooks/useLangTabs";

export default function Home() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader
                        titles="CMS"
                        active={`Home Page (${activeTab?.toUpperCase()})`}
                        items={["Home"]}
                        links={["/dashboard"]}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <HomePageForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}