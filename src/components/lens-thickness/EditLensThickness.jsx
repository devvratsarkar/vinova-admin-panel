import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";
import EditLensThicknessForm from "./EditLensThicknessForm";

export default function EditLensThickness() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Refractive Index (${activeTab?.toUpperCase()})`} active="Edit Refractive Index" items={["Home", "Refractive Index List"]} links={["/dashoard", "/catalogue/lens-thickness"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <EditLensThicknessForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}