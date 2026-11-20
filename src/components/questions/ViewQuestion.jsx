import { Card, Row, Col } from "react-bootstrap";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import ViewQuestionForm from "./ViewQuestionForm";

export default function ViewQuestion() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles={`Questions (${activeTab?.toUpperCase()})`} active="View Question" items={["Home", "Question List"]} links={['/dashboard', '/questions']} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <ViewQuestionForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}