import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { useFormik } from 'formik';
import { useAddHomeTryOnPageMutation, useGetHomeTryOnPageQuery } from '../../../redux/features/cmsEndPoints';
import Loader from '../../../layouts/layoutcomponents/loader';
import SeoForm from '../../seo-page/SeoForm';
import SelectWithDragDrop from '../../common/SelectWithDragDrop';
import { HomeTryOnPageValidationSchema } from '../../../commondata/formvalidations';
import { useGetFramesQuery } from '../../../redux/features/framesAPIEndPoint';

export default function HomeTryOnPageForm({ lang }) {
    const { data: allFramesRes } = useGetFramesQuery()
    const [addHomeTryOnPage, { isLoading: adding }] = useAddHomeTryOnPageMutation();
    const { data: res, isLoading, isSuccess } = useGetHomeTryOnPageQuery();
    const data = res?.data;
    const allFrames = Array.isArray(allFramesRes?.data?.frames)
        ? allFramesRes.data.frames
        : Array.isArray(allFramesRes?.data)
            ? allFramesRes.data
            : [];

    const frameOptions = allFrames?.map(frame => ({
        label: frame.name,
        value: frame._id
    }));


    const initialValues = data || {
        banner: null,
        img1: null,
        img2: null,
        img3: null,
        sec1: {
            title: '',
            desc: '',
            btn1: { name: '', link: '' },
            btn2: { name: '', link: '' },
        },
        sec2: {
            title: '',
            first: { title: '', desc: '' },
            second: { title: '', desc: '' },
            third: { title: '', desc: '' },
        },
        home_tryOn_fav: [],
        BestSelling_Frames: [],
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
            validationSchema: HomeTryOnPageValidationSchema,
            onSubmit: async (values) => {
                try {
                    const formData = new FormData();

                    // Append files
                    if (values.banner) formData.append('banner', values.banner);
                    if (values.img1) formData.append('img1', values.img1);
                    if (values.img2) formData.append('img2', values.img2);
                    if (values.img3) formData.append('img3', values.img3);

                    // Append sec1
                    formData.append('sec1.title', values.sec1.title);
                    formData.append('sec1.desc', values.sec1.desc);
                    formData.append('sec1.btn1.name', values.sec1.btn1.name);
                    formData.append('sec1.btn1.link', values.sec1.btn1.link);
                    formData.append('sec1.btn2.name', values.sec1.btn2.name);
                    formData.append('sec1.btn2.link', values.sec1.btn2.link);

                    // Append sec2
                    formData.append('sec2.title', values.sec2.title);
                    formData.append('sec2.first.title', values.sec2.first.title);
                    formData.append('sec2.first.desc', values.sec2.first.desc);
                    formData.append('sec2.second.title', values.sec2.second.title);
                    formData.append('sec2.second.desc', values.sec2.second.desc);
                    formData.append('sec2.third.title', values.sec2.third.title);
                    formData.append('sec2.third.desc', values.sec2.third.desc);
                    formData.append('lang', values.lang);
                    formData.append('meta_title', values.meta_title || '');
                    formData.append('meta_description', values.meta_description || '');
                    formData.append('meta_keywords', values.meta_keywords || '');
                    formData.append('og_tag', values.og_tag || '');
                    formData.append('schema_markup', values.schema_markup || '');

                    // Append arrays
                    values.home_tryOn_fav.forEach((id) => {
                        formData.append('home_tryOn_fav', id);
                    });
                    values.BestSelling_Frames.forEach((id) => {
                        formData.append('BestSelling_Frames', id);
                    });

                    const response = await addHomeTryOnPage(formData);
                    if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                        // toast.success('Home Try On Page updated successfully');
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        });

    const handleFileChange = (field, file) => {
        setFieldValue(field, file);
        setFieldTouched(field, true);
    };

    const handleSelectChange = (field, selectedOptions) => {
        setFieldValue(field, selectedOptions ? selectedOptions.map(option => option.value) : []);
        setFieldTouched(field, true);
    };

    // Prefill form when API data is fetched
    useEffect(() => {
        if (isSuccess && data) {
            setValues({
                banner: data?.sec1?.banner,
                img1: data?.sec2?.first?.image,
                img2: data?.sec2?.second?.image,
                img3: data?.sec2?.third?.image,
                sec1: {
                    title: data?.sec1?.title || '',
                    desc: data?.sec1?.desc || '',
                    btn1: {
                        name: data?.sec1?.btn1?.name || '',
                        link: data?.sec1?.btn1?.link || '',
                    },
                    btn2: {
                        name: data?.sec1?.btn2?.name || '',
                        link: data?.sec1?.btn2?.link || '',
                    },
                },
                sec2: {
                    title: data?.sec2?.title || '',
                    first: {
                        title: data?.sec2?.first?.title || '',
                        desc: data?.sec2?.first?.desc || '',
                    },
                    second: {
                        title: data?.sec2?.second?.title || '',
                        desc: data?.sec2?.second?.desc || '',
                    },
                    third: {
                        title: data?.sec2?.third?.title || '',
                        desc: data?.sec2?.third?.desc || '',
                    },
                },
                home_tryOn_fav: data?.home_tryOn_fav?.map(item => item._id) || [],
                BestSelling_Frames: data?.BestSelling_Frames?.map(item => item._id) || [],
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
                            <h3 className="card-title">Home Try On Page Content</h3>
                        </Card.Header>

                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h4 className="mb-3">Section 1: Basic Info</h4>

                                <Row>
                                    <Col md={12}>
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
                                                                ? values.banner
                                                                : URL.createObjectURL(values.banner)
                                                        }
                                                        alt="Banner Preview"
                                                        style={{ width: "100px", height: "auto" }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Title<span className="text-danger">*</span></Form.Label>
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
                                </Row>

                                <Row className="mt-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec1.desc"
                                                value={values.sec1.desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.desc && errors?.sec1?.desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button 1 Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.btn1.name"
                                                value={values.sec1.btn1.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.btn1?.name && errors?.sec1?.btn1?.name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.btn1?.name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button 1 Link<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.btn1.link"
                                                value={values.sec1.btn1.link}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.btn1?.link && errors?.sec1?.btn1?.link && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.btn1?.link}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button 2 Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.btn2.name"
                                                value={values.sec1.btn2.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.btn2?.name && errors?.sec1?.btn2?.name && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.btn2?.name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Button 2 Link<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec1.btn2.link"
                                                value={values.sec1.btn2.link}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec1?.btn2?.link && errors?.sec1?.btn2?.link && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec1?.btn2?.link}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h4 className="mt-4">Section 2: Why Choose Us</h4>

                                <Row className="mt-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec2.title"
                                                value={values.sec2.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.title && errors?.sec2?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Image 1<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('img1', e.target.files[0])}
                                            />
                                            {touched.img1 && errors.img1 && (
                                                <p className="text-danger text-sm mt-1">{errors.img1}</p>
                                            )}
                                            {values.img1 && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.img1 === "string"
                                                                ? values.img1
                                                                : URL.createObjectURL(values.img1)
                                                        }
                                                        alt="Image 1 Preview"
                                                        style={{ width: '100px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec2.first.title"
                                                value={values.sec2.first.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.first?.title && errors?.sec2?.first?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.first?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec2.first.desc"
                                                value={values.sec2.first.desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.first?.desc && errors?.sec2?.first?.desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.first?.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Image 2<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('img2', e.target.files[0])}
                                            />
                                            {touched.img2 && errors.img2 && (
                                                <p className="text-danger text-sm mt-1">{errors.img2}</p>
                                            )}
                                            {values.img2 && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.img2 === "string"
                                                                ? values.img2
                                                                : URL.createObjectURL(values.img2)
                                                        }
                                                        alt="Image 2 Preview"
                                                        style={{ width: '100px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Second Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec2.second.title"
                                                value={values.sec2.second.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.second?.title && errors?.sec2?.second?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.second?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Second Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec2.second.desc"
                                                value={values.sec2.second.desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.second?.desc && errors?.sec2?.second?.desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.second?.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Image 3<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('img3', e.target.files[0])}
                                            />
                                            {touched.img3 && errors.img3 && (
                                                <p className="text-danger text-sm mt-1">{errors.img3}</p>
                                            )}
                                            {values.img3 && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof values.img3 === "string"
                                                                ? values.img3
                                                                : URL.createObjectURL(values.img3)
                                                        }
                                                        alt="Image 3 Preview"
                                                        style={{ width: '100px', height: 'auto' }}
                                                        className="img-thumbnail"
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Third Title<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="sec2.third.title"
                                                value={values.sec2.third.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.third?.title && errors?.sec2?.third?.title && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.third?.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Third Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="sec2.third.desc"
                                                value={values.sec2.third.desc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched?.sec2?.third?.desc && errors?.sec2?.third?.desc && (
                                                <p className="text-danger text-sm mt-1">{errors?.sec2?.third?.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mt-4">
                                            <Form.Label>Home Try On Favorites</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                name="home_tryOn_fav"
                                                options={frameOptions}
                                                value={values.home_tryOn_fav?.map(id => frameOptions?.find(opt => opt.value === id)).filter(Boolean) ?? []}
                                                onChange={(selected) => handleSelectChange('home_tryOn_fav', selected)}
                                                classNamePrefix="select"
                                            />
                                            {touched.home_tryOn_fav && errors.home_tryOn_fav && (
                                                <p className="text-danger text-sm mt-1">{errors.home_tryOn_fav}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mt-4">
                                            <Form.Label>Best Selling Frames</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                name="BestSelling_Frames"
                                                options={frameOptions}
                                                value={values.BestSelling_Frames?.map(id => frameOptions?.find(opt => opt.value === id)).filter(Boolean) ?? []}
                                                onChange={(selected) => handleSelectChange('BestSelling_Frames', selected)}
                                                classNamePrefix="select"
                                            />
                                            {touched.BestSelling_Frames && errors.BestSelling_Frames && (
                                                <p className="text-danger text-sm mt-1">{errors.BestSelling_Frames}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

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