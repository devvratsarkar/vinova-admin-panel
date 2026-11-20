import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Image } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { useFormik } from 'formik'
import Suneditor from "suneditor-react";
import { options_for_sunEditor } from '../../../commondata/suneditorOptions'
import SeoForm from '../../seo-page/SeoForm'
import { useGetPolicyQuery } from '../../../redux/features/policyAPIEndPoint'
import Loader from '../../../layouts/layoutcomponents/loader'
import Error from '../../../layouts/layoutcomponents/Error'
import { useParams } from 'react-router-dom';

export default function ViewPolicy() {
    const { id } = useParams()
    const { data, isLoading, isSuccess, isError, error } = useGetPolicyQuery(id)
    const singleData = data?.data || null
    const [previewImage, setPreviewImage] = useState(null)

    const initialValues = {
        type: "",
        title: "",
        banner: "",
        content: "",
        status: true,
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
    }

    const { values, handleChange, handleBlur, setFieldValue } = useFormik({
        initialValues,
        onSubmit: () => {},
    })

    useEffect(() => {
        if (isSuccess && singleData) {
            setFieldValue("type", singleData?.type || "")
            setFieldValue("title", singleData?.title || "")
            setFieldValue("content", singleData?.content || "")
            setFieldValue("status", singleData?.status ?? true)
            setFieldValue("banner", singleData?.banner || "")
            setPreviewImage(singleData?.banner || null)
            setFieldValue("meta_title", singleData?.meta_title || "")
            setFieldValue("meta_description", singleData?.meta_description || "")
            setFieldValue("meta_keywords", singleData?.meta_keywords || "")
            setFieldValue("og_tag", singleData?.og_tag || "")
            setFieldValue("schema_markup", singleData?.schema_markup || "")
        }
    }, [isSuccess, singleData, setFieldValue])

    if (isLoading) {
        return <Loader />
    }
    if (isError) {
        return <Error error_mes={error} />
    }

    return (
        <>
            <Row className="justify-content-between">
                <Col>
                    <PageHeader titles="Policy Pages" active="View Policy" items={["Home", "Policy Page List"]} links={["/dashboard", "/all-policies"]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Type</Form.Label>
                                            <Form.Select
                                                name='type'
                                                onChange={handleChange}
                                                value={values.type}
                                                onBlur={handleBlur}
                                                disabled
                                            >
                                                <option value="">Select</option>
                                                <option value="terms-conditions">Terms And Condition</option>
                                                <option value="privacy-policy">Privacy Policy</option>
                                                <option value="cancelation-policy">Cancelation Policy</option>
                                                <option value="refund-return">Refund Return Policy</option>
                                                <option value="vendor-policy">Vendor Policy</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                name='title'
                                                value={values.title}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image</Form.Label>
                                            {previewImage && (
                                                <div className="mt-2">
                                                    <Image src={previewImage} alt="Banner Preview" fluid style={{ maxHeight: '100px' }} />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select
                                                name='status'
                                                value={String(values.status)}
                                                disabled
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Content</Form.Label>
                                            <Suneditor
                                                name='content'
                                                setOptions={options_for_sunEditor}
                                                setContents={values.content}
                                                disable
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <SeoForm
                                        handleChange={handleChange}
                                        values={values}
                                        errors={{}}
                                        handleBlur={handleBlur}
                                        touched={{}}
                                        readOnlyStatus={true}
                                    />
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
