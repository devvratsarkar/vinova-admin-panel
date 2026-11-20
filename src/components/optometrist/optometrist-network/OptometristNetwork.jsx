import React, { useEffect } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { useFormik } from 'formik';
import Loader from '../../../layouts/layoutcomponents/loader';
import SeoForm from '../../seo-page/SeoForm';
import SelectWithDragDrop from '../../common/SelectWithDragDrop';
import { OptometristPageContentValidationSchema } from '../../../commondata/formvalidations';
import { useAddOptometristContentPageMutation, useGetOptometristContentPageQuery } from '../../../redux/features/cmsEndPoints';
import { State } from "country-state-city";
import toast from 'react-hot-toast';

export default function OptometristNetwork() {
    const [addOptometristPage, { isLoading: adding }] = useAddOptometristContentPageMutation();
    const { data: res, isLoading, isSuccess, refetch } = useGetOptometristContentPageQuery();
    const data = res?.data;

    // Dummy data for selects (presence locations)
    // const presenceOptions = [
    //     { value: 'Delhi', label: 'Delhi' },
    //     { value: 'Mumbai', label: 'Mumbai' },
    //     { value: 'Chennai', label: 'Chennai' },
    //     { value: 'Bangalore', label: 'Bangalore' },
    //     { value: 'Kolkata', label: 'Kolkata' },
    // ];
    const allStates = State.getAllStates().map((state) => ({
        value: state.name,
        label: `${state.name}, ${state.countryCode}`,
    }));

    const initialValues = data || {
        first_banner: null,
        second_banner: null,
        presence: [],
        services: '',
        about: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_tag: '',
        schema_markup: '',
    };

    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, setValues, touched, errors, } = useFormik({
        initialValues,
        validationSchema: OptometristPageContentValidationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();

                if (values.first_banner) formData.append('first_banner', values.first_banner);
                if (values.second_banner) formData.append('second_banner', values.second_banner);

                values.presence.forEach((item) => formData.append('presence[]', item));
                formData.append('services', values.services);
                formData.append('about', values.about);
                formData.append('meta_title', values.meta_title);
                formData.append('meta_description', values.meta_description);
                formData.append('meta_keywords', values.meta_keywords);
                formData.append('og_tag', values.og_tag);
                formData.append('schema_markup', values.schema_markup);

                const response = await addOptometristPage(formData);

                if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                    toast.success(response?.data?.message);
                    refetch();
                } else {
                    toast.error(response?.data?.message || 'Failed to save');
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred');
            }
        },
    });

    const handleFileChange = (field, file) => {
        setFieldValue(field, file);
        setFieldTouched(field, true);
    };

    const handleSelectChange = (field, selectedOptions) => {
        setFieldValue(
            field,
            selectedOptions ? selectedOptions.map((option) => option.value) : []
        );
        setFieldTouched(field, true);
    };

    // Prefill when API data is ready
    useEffect(() => {
        if (isSuccess && data) {
            setValues({
                first_banner: data?.first_banner || null,
                second_banner: data?.second_banner || null,
                presence: data?.presence || [],
                services: data?.services || '',
                about: data?.about || '',
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
                    <PageHeader
                        titles="CMS"
                        active="Optometrist Network page content"
                        items={['Home']}
                        links={['/dashboard']}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Optometrist Network Page Content</h3>
                        </Card.Header>

                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h4 className="mb-3">Banner Section</h4>

                                {/* First Banner */}
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First Banner<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('first_banner', e.target.files[0])}
                                            />
                                            {touched.first_banner && errors.first_banner && (
                                                <p className="text-danger text-sm mt-1">{errors.first_banner}</p>
                                            )}
                                            {values.first_banner && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.first_banner === 'string'
                                                                ? values.first_banner
                                                                : URL.createObjectURL(values.first_banner)
                                                        }
                                                        alt="First Banner Preview"
                                                        style={{ width: '120px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    {/* Second Banner */}
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Second Banner<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('second_banner', e.target.files[0])}
                                            />
                                            {touched.second_banner && errors.second_banner && (
                                                <p className="text-danger text-sm mt-1">{errors.second_banner}</p>
                                            )}
                                            {values.second_banner && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.second_banner === 'string'
                                                                ? values.second_banner
                                                                : URL.createObjectURL(values.second_banner)
                                                        }
                                                        alt="Second Banner Preview"
                                                        style={{ width: '120px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Presence Section */}
                                <h4 className="mt-4">Presence</h4>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mt-2">
                                            <Form.Label>Available Locations<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                name="presence"
                                                options={allStates}
                                                value={allStates.filter(option =>
                                                    values.presence.includes(option.value)
                                                )}
                                                onChange={(selected) => handleSelectChange('presence', selected)}
                                                classNamePrefix="select"
                                            />
                                            {touched.presence && errors.presence && (
                                                <p className="text-danger text-sm mt-1">{errors.presence}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Services */}
                                <h4 className="mt-4">Services</h4>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Services Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="services"
                                                value={values.services}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.services && errors.services && (
                                                <p className="text-danger text-sm mt-1">{errors.services}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* About */}
                                <h4 className="mt-4">About</h4>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>About Optometrist Network<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="about"
                                                value={values.about}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.about && errors.about && (
                                                <p className="text-danger text-sm mt-1">{errors.about}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* SEO Meta Data */}
                                <h4 className="mb-3 mt-4">SEO Meta Data</h4>
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
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-auto"
                                        disabled={adding}
                                    >
                                        {adding ? 'Saving...' : 'Save'}
                                    </Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
