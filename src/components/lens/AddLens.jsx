import { Card, Row, Col } from "react-bootstrap";
import AddLensForm from "./AddLensForm";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";

export default function AddLens() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Lens quality category (${activeTab?.toUpperCase()})`} active="Add Lens quality category" items={["Home", "Lens quality category List"]} links={["/dashoard", "/catalogue/lenses"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AddLensForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}