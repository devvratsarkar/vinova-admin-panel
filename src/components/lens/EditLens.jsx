import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";
import EditLensForm from "./EditLensForm";

export default function EditLens() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Lens quality category (${activeTab?.toUpperCase()})`} active="Edit Lens quality category" items={["Home", "Lens quality category List"]} links={["/dashboard", "/catalogue/lenses"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <EditLensForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}