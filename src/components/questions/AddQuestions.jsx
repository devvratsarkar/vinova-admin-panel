import { Card, Row, Col } from "react-bootstrap";
import AddQuestionsForm from "./AddQuestionsForm";
import useLangTabs from "../../hooks/useLangTabs";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export default function AddNewCategory() {
    const { activeTab } = useLangTabs();

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles={`Questions (${activeTab?.toUpperCase()})`} active="Add Question" items={["Home", "Question List"]} links={['/dashboard', '/questions']} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="custom_tab_wrapper">
                        <Card.Body>
                            <Row className="mt-4">
                                <AddQuestionsForm lang={activeTab} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}