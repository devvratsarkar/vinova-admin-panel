import React, { useEffect } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { useFormik } from 'formik';
import SeoForm from '../../seo-page/SeoForm';
import Loader from '../../../layouts/layoutcomponents/loader';
import { optometristValidationSchema } from '../../../commondata/formvalidations';
import { useAddOptometristPageMutation, useGetOptometristPageQuery } from '../../../redux/features/cmsEndPoints';
import toast from 'react-hot-toast';

export default function BecomeAnOptometrist() {
    const [addOptometristPage, { isLoading: adding }] = useAddOptometristPageMutation();
    const { data: res, isLoading, isSuccess, refetch } = useGetOptometristPageQuery();
    const data = res?.data;

    const initialValues = {
        title: '',
        desc: '',
        image: '',
        btn_text: '',
        optometrist_rate: '',
        years_expertise: '',
        evenue_partners: '',
        happy_customers: '',
        enquiry_title: '',
        enquiry_desc: '',
        email: '',
        phone: '',
        office_address: '',
        follow_us: [
            {
                name: '',
                link: '',
            }
        ],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_tag: '',
        schema_markup: '',
    };

    const { values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched, setValues } = useFormik({
        initialValues,
        validationSchema: optometristValidationSchema,
        onSubmit: async (values) => {
            try {
                // ✅ Convert to FormData
                const formData = new FormData();

                // Append primitive fields
                Object.keys(values).forEach((key) => {
                    if (key === "follow_us") {
                        // Convert array of objects to JSON string
                        formData.append("follow_us", JSON.stringify(values.follow_us));
                    } else if (key === "image") {
                        // Append image file if selected
                        if (values.image instanceof File) {
                            formData.append("image", values.image);
                        }
                    } else {
                        formData.append(key, values[key] ?? "");
                    }
                });

                const res = await addOptometristPage(formData);
                if (res?.data?.http_status_code === 200 || res?.data?.http_status_code === 201) {
                    toast.success(res?.data?.message);
                    refetch();
                } else {
                    toast.error(res?.data?.message || 'Failed to save');
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred');
            }
        },
    });

    const addSocialLink = () => {
        const current = [...values.follow_us];
        current.push({ name: '', link: '' });
        setFieldValue('follow_us', current);
    };

    const removeSocialLink = (index) => {
        const current = [...values.follow_us];
        if (current.length > 1) { // Prevent removing the last one
            current.splice(index, 1);
            setFieldValue('follow_us', current);
        }
    };

    const handleSocialChange = (index, field, value) => {
        const current = [...values.follow_us];
        const updatedSocial = { ...current[index], [field]: value };
        current[index] = updatedSocial;
        setFieldValue('follow_us', current);
        // Optionally set touched
        setFieldTouched(`follow_us[${index}].${field}`, true);
    };


    // ✅ Prefill form when data is fetched
    useEffect(() => {
        if (data) {
            setValues({
                title: data.title || '',
                desc: data.desc || '',
                image: data.image || '',
                btn_text: data.btn_text || '',
                optometrist_rate: data.optometrist_rate || '',
                years_expertise: data.years_expertise || '',
                evenue_partners: data.evenue_partners || '',
                happy_customers: data.happy_customers || '',
                enquiry_title: data.enquiry_title || '',
                enquiry_desc: data.enquiry_desc || '',
                email: data.email || '',
                phone: data.phone || '',
                office_address: data.office_address || '',
                follow_us: Array.isArray(data.follow_us) && data.follow_us.length > 0
                    ? data.follow_us
                    : [{ name: '', link: '' }],
                meta_title: data.meta_title || '',
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
                og_tag: data.og_tag || '',
                schema_markup: data.schema_markup || '',
            });
        }
    }, [data, isSuccess]);
    return (
        <>
            {(isLoading || adding) && <Loader />}
            <Row>
                <Col>
                    <PageHeader titles="CMS" active="Become an optometrist page content" items={['Home']} links={['/dashboard']} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Become an Optometrist Page Content</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Section 1: Hero Section */}
                                <h4 className="mb-3">Section 1: Hero</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.title && errors?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="desc"
                                                value={values.desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.desc && errors?.desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                onChange={(e) => setFieldValue('image', e.target.files[0])}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.image && errors?.image && (
                                                <p className="text-danger text-sm mt-1">{errors?.image}</p>
                                            )}

                                            {/* ✅ Show image preview below input */}
                                            {values.image && !(values.image instanceof File) && (
                                                <div className="mt-3">
                                                    <p className="mb-2">Current Image Preview:</p>
                                                    <img
                                                        src={values.image}
                                                        alt="Optometrist"
                                                        style={{
                                                            width: '150px',
                                                            height: 'auto',
                                                            borderRadius: '8px',
                                                            border: '1px solid #ddd',
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* ✅ If a new image is selected, show preview of that */}
                                            {values.image && values.image instanceof File && (
                                                <div className="mt-3">
                                                    <p className="mb-2">New Image Preview:</p>
                                                    <img
                                                        src={URL.createObjectURL(values.image)}
                                                        alt="New upload"
                                                        style={{
                                                            width: '150px',
                                                            height: 'auto',
                                                            borderRadius: '8px',
                                                            border: '1px solid #ddd',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Button Text<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="btn_text"
                                                value={values.btn_text}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.btn_text && errors?.btn_text && (
                                                <p className="text-danger text-sm mt-1">{errors?.btn_text}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 2: Stats */}
                                <h4 className="mb-3">Section 2: Stats</h4>
                                <Row className="mb-4">
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Optometrist Rate<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="optometrist_rate"
                                                value={values.optometrist_rate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.optometrist_rate && errors?.optometrist_rate && (
                                                <p className="text-danger text-sm mt-1">{errors?.optometrist_rate}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Years of Expertise<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="years_expertise"
                                                value={values.years_expertise}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.years_expertise && errors?.years_expertise && (
                                                <p className="text-danger text-sm mt-1">{errors?.years_expertise}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>eVenue Partners<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="evenue_partners"
                                                value={values.evenue_partners}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.evenue_partners && errors?.evenue_partners && (
                                                <p className="text-danger text-sm mt-1">{errors?.evenue_partners}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Happy Customers<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="happy_customers"
                                                value={values.happy_customers}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.happy_customers && errors?.happy_customers && (
                                                <p className="text-danger text-sm mt-1">{errors?.happy_customers}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 3: Enquiry */}
                                <h4 className="mb-3">Section 3: Enquiry</h4>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Enquiry Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="enquiry_title"
                                                value={values.enquiry_title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.enquiry_title && errors?.enquiry_title && (
                                                <p className="text-danger text-sm mt-1">{errors?.enquiry_title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Enquiry Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="enquiry_desc"
                                                value={values.enquiry_desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.enquiry_desc && errors?.enquiry_desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.enquiry_desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.email && errors?.email && (
                                                <p className="text-danger text-sm mt-1">{errors?.email}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.phone && errors?.phone && (
                                                <p className="text-danger text-sm mt-1">{errors?.phone}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Office Address<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="office_address"
                                                value={values.office_address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.office_address && errors?.office_address && (
                                                <p className="text-danger text-sm mt-1">{errors?.office_address}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Section 4: Follow Us */}
                                <h4 className="mb-3">Section 4: Follow Us</h4>
                                {values?.follow_us && values?.follow_us?.length > 0 && values?.follow_us?.map((social, index) => (
                                    <Row key={index} className="mb-3 align-items-end">
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Social Name {index + 1}<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={social.name || ''}
                                                    onChange={(e) => handleSocialChange(index, 'name', e.target.value)}
                                                    onBlur={() => setFieldTouched(`follow_us[${index}].name`, true)}
                                                />
                                                {touched.follow_us?.[index]?.name && errors.follow_us?.[index]?.name && (
                                                    <p className="text-danger text-sm mt-1">{errors.follow_us[index].name}</p>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Social Link {index + 1}<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={social.link || ''}
                                                    onChange={(e) => handleSocialChange(index, 'link', e.target.value)}
                                                    onBlur={() => setFieldTouched(`follow_us[${index}].link`, true)}
                                                />
                                                {touched.follow_us?.[index]?.link && errors.follow_us?.[index]?.link && (
                                                    <p className="text-danger text-sm mt-1">{errors.follow_us[index].link}</p>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="d-flex justify-content-end">
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeSocialLink(index)}
                                                className="me-2"
                                                disabled={values.follow_us.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Row className="mb-4">
                                    <Col>
                                        <Button type="button" variant="secondary" onClick={addSocialLink}>
                                            Add Social Link
                                        </Button>
                                    </Col>
                                </Row>

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
                                    <Button type="submit" variant="primary" className="w-auto">
                                        Save
                                    </Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}