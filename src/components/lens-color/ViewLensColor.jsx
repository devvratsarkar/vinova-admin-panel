import { Card, Row, Col } from "react-bootstrap";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import ViewLensColorForm from "./ViewLensColorForm";

export default function ViewLensColor() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles={`Lens Color (${activeTab?.toUpperCase()})`} active="View Lens Color" items={["Home", "Lens Color List"]} links={['/dashboard', '/catalogue/lens-color']} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <ViewLensColorForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}