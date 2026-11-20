import React, { useEffect } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { useFormik } from 'formik';
import SeoForm from '../../seo-page/SeoForm';
import { useAddContactUsPageMutation, useGetContactUsPageQuery, } from '../../../redux/features/cmsEndPoints';
import Loader from '../../../layouts/layoutcomponents/loader';
import { contactValidationSchema } from '../../../commondata/formvalidations';
import toast from 'react-hot-toast';

export default function ContactUsPageForm({ lang }) {


    const [addOptometristPage, { isLoading: adding }] = useAddContactUsPageMutation();
    const { data: res, isLoading, isSuccess, refetch } = useGetContactUsPageQuery();
    const data = res?.data;

    const initialValues = {
        label: '',
        main_heading: '',
        title: '',
        contact_text: '',
        email: '',
        phone: '',
        assistance_hours: '',
        lang: lang,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_tag: '',
        schema_markup: '',
    };

    const { values, touched, errors, handleSubmit, handleChange, handleBlur, setValues, } = useFormik({
        initialValues,
        validationSchema: contactValidationSchema,
        onSubmit: async (values) => {
            try {
                const response = await addOptometristPage(values);
                if (response?.error) {
                    toast.error(response.error?.data?.message || 'Failed to save');
                    return;
                }
                if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                    refetch();
                    toast.success(response?.data?.message || 'Contact page saved successfully');
                } else {
                    toast.error(response?.data?.message || 'Failed to save');
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred');
            }
        },
    });

    // ✅ Prefill form when API data is fetched
    useEffect(() => {
        if (data) {
            setValues({
                label: data.label || '',
                main_heading: data.main_heading || '',
                title: data.title || '',
                contact_text: data.contact_text || '',
                email: data.email || '',
                phone: data.phone || '',
                assistance_hours: data.assistance_hours || '',
                meta_title: data.meta_title || '',
                lang: lang,
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
                og_tag: data.og_tags || data.og_tag || '',
                schema_markup: data.schema_markup || '',
            });
        }
    }, [data, isSuccess]);

    return (
        <>
            {(isLoading || adding) && <Loader />}


            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Contact Us Page Content</h3>
                        </Card.Header>

                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Section 1: Contact Info */}
                                <h4 className="mb-3">Section 1: Contact Information</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Label <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="label"
                                                value={values.label}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.label && errors.label && (
                                                <p className="text-danger text-sm mt-1">{errors.label}</p>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Main Heading <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="main_heading"
                                                value={values.main_heading}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.main_heading && errors.main_heading && (
                                                <p className="text-danger text-sm mt-1">{errors.main_heading}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Title <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.title && errors.title && (
                                                <p className="text-danger text-sm mt-1">{errors.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Contact Text <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="contact_text"
                                                value={values.contact_text}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.contact_text && errors.contact_text && (
                                                <p className="text-danger text-sm mt-1">{errors.contact_text}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Email <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.email && errors.email && (
                                                <p className="text-danger text-sm mt-1">{errors.email}</p>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Phone <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.phone && errors.phone && (
                                                <p className="text-danger text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Assistance Hours <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="assistance_hours"
                                                value={values.assistance_hours}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.assistance_hours && errors.assistance_hours && (
                                                <p className="text-danger text-sm mt-1">{errors.assistance_hours}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 2: SEO Fields */}
                                <h4 className="mb-3">Section 2: SEO Meta Data</h4>
                                <Row>
                                    <SeoForm
                                        touched={touched}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        readOnlyStatus={false}
                                    />
                                </Row>

                                <Row className="mt-5 justify-content-center">
                                    <Button type="submit" variant="primary" className="w-auto submit_btn">Submit</Button>
                                    <Button type="submit" variant="primary" className="submit_btn_full">Submit</Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
