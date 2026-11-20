import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Card, Button } from 'react-bootstrap';
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { openModal } from '../../redux/slices/allModalSlice';
import SunEditor from 'suneditor-react';
import { options_for_sunEditor } from '../../commondata/formEditorOptions';
import { careerPageValidationSchema } from '../../commondata/formvalidations';
import { useAddUpdateCareerPageMutation, useGetCareerPageQuery } from '../../redux/features/careerPageAPIEndPoint';
import Loader from '../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import SeoForm from '../seo-page/SeoForm';


export default function CareerPageForm({ lang }) {
    const dispatch = useDispatch();
    const [viewImage, setViewImage] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const [addData, { isLoading }] = useAddUpdateCareerPageMutation()
    const { data, isLoading: loadingData, refetch, isSuccess } = useGetCareerPageQuery()
    const singleData = data?.data || null


    const initialValues = {
        image: '',
        title: '',
        desc: '',
        btn_txt: '',
        lang: lang,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        og_tag: '',
        schema_markup: '',
    };

    const { values, errors, touched, setFieldTouched, setFieldValue, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues,
        validationSchema: careerPageValidationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            try {
                const resp = await addData(formData)
                if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
                    toast.success(resp?.data?.message)
                } else {
                    toast.error(resp?.data?.message)
                }
            } catch (error) {
                toast.error(error?.response?.data?.message)
            }
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFieldValue('image', file);

        if (file) {
            setViewImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setViewImage(true);
            setSelectedImage(null);
        }
    };

    useEffect(() => {
        if (singleData) {
            setFieldValue("title", singleData?.title)
            setFieldValue("image", singleData?.image)
            setFieldValue("desc", singleData?.desc)
            setFieldValue("btn_txt", singleData?.btn_txt)
            setSelectedImage(singleData?.image)
        }
    }, [isSuccess, singleData, setFieldValue])

    return (
        <>
            {
                (isLoading || loadingData) && <Loader />
            }
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Career Page Content</h3>
                        </Card.Header>
                        <Card.Body className="add_new_product">
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
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
                                            {errors.title && touched.title && (
                                                <p className="text-danger text-sm mt-1">{errors.title}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                Image <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Row>
                                                <Col md={3} className="d-flex justify-content-center">
                                                    {viewImage ? (
                                                        <div className="position-relative">
                                                            <p>No image</p>
                                                            <span className="position-absolute">
                                                                <button
                                                                    type="button"
                                                                    className="p-0 px-1"
                                                                    onClick={() => {
                                                                        setViewImage(true);
                                                                        setFieldValue('image', null);
                                                                    }}
                                                                >
                                                                    <i className="icon icon-close text-danger"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="position-relative">
                                                            <img src={selectedImage} alt="Selected Image" width={64} height={64} />
                                                            <span className="position-absolute d-flex gap-1">
                                                                <button
                                                                    type="button"
                                                                    className="p-0 px-1"
                                                                    onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: selectedImage }))}
                                                                >
                                                                    <i className="fe fe-eye"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="p-0 px-1"
                                                                    onClick={() => {
                                                                        setViewImage(true);
                                                                        setFieldValue('image', null);
                                                                    }}
                                                                >
                                                                    <i className="icon icon-close text-danger"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    )}
                                                </Col>
                                                <Col md={9}>
                                                    <Form.Control
                                                        type="file"
                                                        name="image"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                        onChange={handleImageChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.image && touched.image && (
                                                        <p className="text-danger text-sm mt-1">{errors.image}</p>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>
                                                Description <span className="text-danger">*</span>
                                            </Form.Label>
                                            <SunEditor
                                                name="desc"
                                                onChange={(content) => setFieldValue('desc', content)}
                                                onBlur={() => setFieldTouched('desc', true)}
                                                setOptions={options_for_sunEditor}
                                                setContents={values.desc}
                                            />
                                            {errors.desc && touched.desc && (
                                                <p className="text-danger text-sm mt-1">{errors.desc}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                Button Text <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="btn_txt"
                                                value={values.btn_txt}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.btn_txt && touched.btn_txt && (
                                                <p className="text-danger text-sm mt-1">{errors.btn_txt}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <SeoForm
                                        touched={touched}
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        readOnlyStatus={false}
                                    />
                                </Row>
                                <Row className="mt-5">
                                    <Button type="submit" className="btn-primary mx-auto w-auto submit_btn">Submit</Button>
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