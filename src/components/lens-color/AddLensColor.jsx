import { Card, Row, Col } from "react-bootstrap";
import AddLensColorForm from "./AddLensColorForm";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function AddLensColor() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles={`Lens Color (${activeTab?.toUpperCase()})`} active="Add Lens Color" items={["Home", "Lens Color List"]} links={['/dashboard', '/catalogue/lens-color']} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AddLensColorForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}