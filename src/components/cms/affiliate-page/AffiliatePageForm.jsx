import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { useFormik } from 'formik';
import { useAddAffiliatePageMutation, useGetAffiliatePageQuery } from '../../../redux/features/cmsEndPoints';
import Loader from '../../../layouts/layoutcomponents/loader';
import SunEditor from 'suneditor-react';
import { options_for_sunEditor } from '../../../commondata/formEditorOptions';
import { affiliateValidationSchema } from '../../../commondata/formvalidations';
import SeoForm from '../../seo-page/SeoForm';
import toast from 'react-hot-toast';


export default function AffiliatePageForm({ lang }) {

    const [addAffiliatePage, { isLoading: adding }] = useAddAffiliatePageMutation();
    const { data: res, isLoading, isSuccess, refetch } = useGetAffiliatePageQuery();
    const data = res?.data;

    const initialValues = {
        banner: null,
        first_image: null,
        second_image: null,
        third_image: null,
        sec1: { title: '', sub_title: '', btn_name: '', btn_link: '' },
        sec2: { title1: '', desc1: '', title2: '', desc2: '', why_join: '' },
        sec3: {
            title: '',
            desc: '',
            first: { name: '' },
            second: { name: '' },
            third: { name: '' },
            btn_name: '',
            btn_link: '',
        },
        sec4: {
            note: '',
            faqs: [
                { question: '', ans: '' },
            ],
        },
        lang: lang,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_tag: '',
        schema_markup: '',
    };

    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, setValues, touched, errors } =
        useFormik({
            initialValues,
            validationSchema: affiliateValidationSchema,
            onSubmit: async (values) => {

                try {
                    const formData = new FormData();

                    // Append files
                    if (values.banner) formData.append('banner', values.banner);
                    if (values.first_image) formData.append('first_image', values.first_image);
                    if (values.second_image) formData.append('second_image', values.second_image);
                    if (values.third_image) formData.append('third_image', values.third_image);

                    // Append text fields (nested)
                    formData.append('sec1.title', values.sec1.title);
                    formData.append('sec1.sub_title', values.sec1.sub_title);
                    formData.append('sec1.btn_name', values.sec1.btn_name);
                    formData.append('sec1.btn_link', values.sec1.btn_link);

                    formData.append('sec2.title1', values.sec2.title1);
                    formData.append('sec2.desc1', values.sec2.desc1);
                    formData.append('sec2.title2', values.sec2.title2);
                    formData.append('sec2.desc2', values.sec2.desc2);
                    formData.append('sec2.why_join', values.sec2?.why_join);

                    formData.append('sec3.title', values.sec3.title);
                    formData.append('sec3.desc', values.sec3.desc);
                    formData.append('sec3.first.name', values.sec3.first.name);
                    formData.append('sec3.second.name', values.sec3.second.name);
                    formData.append('sec3.third.name', values.sec3.third.name);
                    formData.append('sec3.btn_name', values.sec3.btn_name);
                    formData.append('sec3.btn_link', values.sec3.btn_link);

                    formData.append('sec4.note', values.sec4.note);
                    formData.append('lang', values.lang);
                    formData.append('meta_title', values.meta_title || '');
                    formData.append('meta_description', values.meta_description || '');
                    formData.append('meta_keywords', values.meta_keywords || '');
                    formData.append('og_tag', values.og_tag || '');
                    formData.append('schema_markup', values.schema_markup || '');

                    values.sec4.faqs.forEach((faq, i) => {
                        formData.append(`sec4.faqs[${i}].question`, faq.question);
                        formData.append(`sec4.faqs[${i}].ans`, faq.ans);
                    });

                    const response = await addAffiliatePage(formData);
                    if (response?.error) {
                        toast.error(response.error?.data?.message || 'Failed to save affiliate page');
                        return;
                    }
                    if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                        refetch();
                        toast.success(response?.data?.message || 'Affiliate page saved successfully');
                    } else {
                        toast.error(response?.data?.message || 'Failed to save affiliate page');
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message || 'An error occurred');
                }
            },
        });

    const addFaq = () => {
        setFieldValue('sec4.faqs', [...values.sec4.faqs, { question: '', ans: '' }]);
    };

    const removeFaq = (index) => {
        const newFaqs = values.sec4.faqs.filter((_, i) => i !== index);
        setFieldValue('sec4.faqs', newFaqs);
    };

    const handleFileChange = (field, file) => {
        setFieldValue(field, file);
        setFieldTouched(field, true);
    };

    // ✅ Prefill form when API data is fetched
    useEffect(() => {
        if (isSuccess && data) {
            setValues({
                banner: data?.sec1?.banner,
                first_image: data?.sec3?.first?.image,
                second_image: data?.sec3?.second?.image,
                third_image: data?.sec3?.third?.image,
                sec1: {
                    title: data?.sec1?.title || '',
                    sub_title: data?.sec1?.sub_title || '',
                    btn_name: data?.sec1?.btn_name || '',
                    btn_link: data?.sec1?.btn_link || '',
                },
                sec2: {
                    title1: data?.sec2?.title1 || '',
                    desc1: data?.sec2?.desc1 || '',
                    title2: data?.sec2?.title2 || '',
                    desc2: data?.sec2?.desc2 || '',
                    why_join: data?.sec2?.why_join || '',
                },
                sec3: {
                    title: data?.sec3?.title || '',
                    desc: data?.sec3?.desc || '',
                    first: { name: data?.sec3?.first?.name || '' },
                    second: { name: data?.sec3?.second?.name || '' },
                    third: { name: data?.sec3?.third?.name || '' },
                    btn_name: data?.sec3?.btn_name || '',
                    btn_link: data?.sec3?.btn_link || '',
                },
                sec4: {
                    note: data?.sec4?.note || '',
                    faqs: data?.sec4?.faqs?.length ? data.sec4.faqs : [{ question: '', ans: '' }],
                },
                lang: lang,
                meta_title: data?.meta_title || '',
                meta_description: data?.meta_description || '',
                meta_keywords: data?.meta_keywords || '',
                og_tag: data?.og_tag || '',
                schema_markup: data?.schema_markup || '',
            });
        }
    }, [isSuccess, data]);

    return (
        <>
            {(isLoading || adding) && <Loader />}

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Affiliate Page Content</h3>
                        </Card.Header>

                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h4 className="mb-3">Section 1: Basic Info</h4>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('banner', e.target.files[0])}
                                            />
                                            {touched.banner && errors.banner && (
                                                <p className="text-danger text-sm mt-1">{errors.banner}</p>
                                            )}
                                            {values.banner && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.banner === "string"
                                                                ? values.banner // existing image URL
                                                                : URL.createObjectURL(values.banner) // newly selected file
                                                        }
                                                        alt="Banner Preview"
                                                        style={{ width: "100px", height: "auto" }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}

                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>

                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Section 1 Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.title"
                                                value={values.sec1.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.title && errors?.sec1?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Sub Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.sub_title"
                                                value={values.sec1.sub_title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.sub_title && errors?.sec1?.sub_title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.sub_title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.btn_name"
                                                value={values.sec1.btn_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.btn_name && errors?.sec1?.btn_name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.btn_name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button Link<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.btn_link"
                                                value={values.sec1.btn_link}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.btn_link && errors?.sec1?.btn_link && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.btn_link}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h4 className="mt-4">Section 2: Why Join</h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Title 1<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec2.title1"
                                                value={values.sec2.title1}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.title1 && errors?.sec2?.title1 && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.title1}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Description 1<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec2.desc1"
                                                value={values.sec2.desc1}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.desc1 && errors?.sec2?.desc1 && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.desc1}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Title 2<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec2.title2"
                                                value={values.sec2.title2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.title2 && errors?.sec2?.title2 && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.title2}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Description 2<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec2.desc2"
                                                value={values.sec2.desc2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.desc2 && errors?.sec2?.desc2 && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.desc2}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Why Join Description<span className="text-danger">*</span></Form.Label>
                                            <SunEditor
                                                setContents={values.sec2?.why_join}
                                                onChange={(content) => setFieldValue("sec2.why_join", content)}
                                                onBlur={() => setFieldTouched("sec2.why_join", true)}
                                                setOptions={options_for_sunEditor}
                                            />
                                            {touched?.sec2?.why_join && errors?.sec2?.why_join && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.why_join}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h4 className="mt-4">Section 3: Steps</h4>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Section 3 Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec3.title"
                                                value={values.sec3.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.title && errors?.sec3?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Section 3 Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec3.desc"
                                                value={values.sec3.desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.desc && errors?.sec3?.desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('first_image', e.target.files[0])}
                                            />
                                            {touched.first_image && errors.first_image && (
                                                <p className="text-danger text-sm mt-1">{errors.first_image}</p>
                                            )}
                                            {values.first_image && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.first_image === "string"
                                                                ? values.first_image
                                                                : URL.createObjectURL(values.first_image)
                                                        }

                                                        alt="First Step Preview"
                                                        style={{ width: '100px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Step 1 Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec3.first.name"
                                                value={values.sec3.first.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.first?.name && errors?.sec3?.first?.name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.first?.name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Second Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('second_image', e.target.files[0])}
                                            />
                                            {touched.second_image && errors.second_image && (
                                                <p className="text-danger text-sm mt-1">{errors.second_image}</p>
                                            )}
                                            {values.second_image && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.second_image === "string"
                                                                ? values.second_image
                                                                : URL.createObjectURL(values.second_image)
                                                        }
                                                        alt="Second Step Preview"
                                                        style={{ width: '100px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Step 2 Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec3.second.name"
                                                value={values.sec3.second.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.second?.name && errors?.sec3?.second?.name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.second?.name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Third Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('third_image', e.target.files[0])}
                                            />
                                            {touched.third_image && errors.third_image && (
                                                <p className="text-danger text-sm mt-1">{errors.third_image}</p>
                                            )}
                                            {values.third_image && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.third_image === "string"
                                                                ? values.third_image
                                                                : URL.createObjectURL(values.third_image)
                                                        }
                                                        alt="Third Step Preview"
                                                        style={{ width: '100px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Step 3 Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec3.third.name"
                                                value={values.sec3.third.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.third?.name && errors?.sec3?.third?.name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.third?.name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec3.btn_name"
                                                value={values.sec3.btn_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.btn_name && errors?.sec3?.btn_name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.btn_name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button Link<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec3.btn_link"
                                                value={values.sec3.btn_link}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec3?.btn_link && errors?.sec3?.btn_link && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec3?.btn_link}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h4 className="mt-4">Section 4: FAQs</h4>

                                <Row className="mt-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Note<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="sec4.note"
                                                value={values.sec4.note}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec4?.note && errors?.sec4?.note && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec4?.note}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {values.sec4.faqs.map((faq, i) => (
                                    <Row key={i} className="mb-3">
                                        <Col md={5}>
                                            <Form.Group>
                                                <Form.Label>Question {i + 1}<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name={`sec4.faqs[${i}].question`}
                                                    value={faq.question}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {touched?.sec4?.faqs?.[i]?.question && errors?.sec4?.faqs?.[i]?.question && (
                                                    <p className="text-danger text-sm mt-1">{errors?.sec4?.faqs?.[i]?.question}</p>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={5}>
                                            <Form.Group>
                                                <Form.Label>Answer {i + 1}<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name={`sec4.faqs[${i}].ans`}
                                                    value={faq.ans}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {touched?.sec4?.faqs?.[i]?.ans && errors?.sec4?.faqs?.[i]?.ans && (
                                                    <p className="text-danger text-sm mt-1">{errors?.sec4?.faqs?.[i]?.ans}</p>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFaq(i)}
                                                disabled={values.sec4.faqs.length <= 1}
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}

                                <Row className="mb-3">
                                    <Col md={12}>
                                        <Button type="button" variant="secondary" onClick={addFaq}>
                                            Add FAQ
                                        </Button>
                                    </Col>
                                </Row>

                                {/* Section 5: SEO Fields */}
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
                                    <Button type="submit" variant="primary" className="w-auto submit_btn" disabled={adding}>{adding ? 'Saving...' : 'Save'}</Button>
                                    <Button type="submit" variant="primary" className="submit_btn_full" disabled={adding}>{adding ? 'Saving...' : 'Save'}</Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
