import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";
import EditFilterForm from "./EditFilterForm";

export default function EditFilter() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Coating (${activeTab?.toUpperCase()})`} active="Edit Coating" items={["Home", "Coating List"]} links={["/dashoard", "/catalogue/lens-type"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <EditFilterForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}