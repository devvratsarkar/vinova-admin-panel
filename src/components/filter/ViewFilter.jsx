import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";
import ViewFilterForm from "./ViewFilterForm";

export default function ViewFilter() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Coating (${activeTab?.toUpperCase()})`} active="View Coating" items={["Home", "Coating List"]} links={["/dashboard", "/catalogue/lens-type"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <ViewFilterForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}