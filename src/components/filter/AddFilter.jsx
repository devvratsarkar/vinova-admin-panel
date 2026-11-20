import { Card, Row, Col } from "react-bootstrap";
import AddFilterForm from "./AddFilterForm";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";

export default function AddFilter() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Coating (${activeTab?.toUpperCase()})`} active="Add Coating" items={["Home", "Coating List"]} links={["/dashoard", "/catalogue/lens-type"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AddFilterForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}