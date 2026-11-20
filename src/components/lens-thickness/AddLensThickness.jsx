import { Card, Row, Col } from "react-bootstrap";
import AddLensThicknessForm from "./AddLensThicknessForm";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import useLangTabs from "../../hooks/useLangTabs";

export default function AddLensThickness() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles={`Refractive Index (${activeTab?.toUpperCase()})`} active="Add Refractive Index" items={["Home", "Refractive Index List"]} links={["/dashboard", "/catalogue/lens-thickness"]} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AddLensThicknessForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}