import { Card, Row, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";
import ViewLensThicknessForm from "./ViewLensThicknessForm";

export default function ViewLensThickness() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Refractive Index (${activeTab?.toUpperCase()})`} active="View Refractive Index" items={["Home", "Refractive Index List"]} links={["/dashoard", "/catalogue/lens-thickness"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <ViewLensThicknessForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}