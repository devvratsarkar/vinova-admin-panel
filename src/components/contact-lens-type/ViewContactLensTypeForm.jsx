import React, { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useGetSingleContactLensTypeQuery } from "../../redux/features/contactLensTypeAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import { useParams } from "react-router-dom";

export default function ViewContactLensTypeForm() {
    const { id } = useParams();
    const { data, isLoading, isSuccess, refetch } = useGetSingleContactLensTypeQuery(id);
    const singleData = data?.data || null;

    const { values, setFieldValue } = useFormik({
        initialValues: {
            name: "",
            slug: "",
            description: "",
            status: false,
        },
        onSubmit: () => {},
    });

    useEffect(() => {
        refetch();
    }, [id, refetch]);

    useEffect(() => {
        if (isSuccess && singleData) {
            setFieldValue("name", singleData?.name || "");
            setFieldValue("slug", singleData?.slug || "");
            setFieldValue("description", singleData?.description || "");
            setFieldValue("status", singleData?.status ?? false);
        }
    }, [isSuccess, singleData, setFieldValue]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={values.name} disabled readOnly />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicSlug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control type="text" value={values.slug} disabled readOnly />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-3" controlId="formBasicDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={values.description} disabled readOnly />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            value={values.status ? "Active" : "Inactive"}
                            disabled
                            readOnly
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}
