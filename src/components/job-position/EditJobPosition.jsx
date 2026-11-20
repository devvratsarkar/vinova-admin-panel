import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddJobOpeningMutation, useEditJobOpeningMutation, useGetJobOpeningsQuery, useGetSingleJobOpeningQuery } from "../../redux/features/jobOpeningAPIEndPoint";
import { useFormik } from "formik";
import slugify from "slugify";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { AddCmsJobApplicationValidation } from "../../commondata/formvalidations";

export default function EditJobPosition() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);

    const { data, isLoading: singleDataLoading, refetch: singleDataRefetch, isSuccess } = useGetSingleJobOpeningQuery(id)
    const singleData = data?.data || null

    const [addJobPosition, { isLoading }] = useEditJobOpeningMutation();
    const { refetch } = useGetJobOpeningsQuery();

    const initialValues = {
        position: "",
        slug: "",
        description: "",
        requirement: "",
        location: "",
        category: "",
        work_type: "",
        experience: "",
        status: true,
        banner: ""
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, setFieldTouched, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: AddCmsJobApplicationValidation,
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });

            try {
                const response = await addJobPosition({ id: id, formData: formData });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message);
                    refetch();
                    resetForm();
                    singleDataRefetch()
                    navigate("/cms/job-positions");
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        },
    });

    const generateSlug = (value) => {
         const slug = value
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[.,/#!$%^&*;:{}=\_`~()؟،]/g, "")
      .toLowerCase();
        setFieldValue("slug", slug);
    };

    const handlePositionChange = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        setFieldValue('banner', file);

        if (file) {
            setViewThumbnail(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setViewThumbnail(true);
            setSelectedThumbnail(null);
        }
    };



    useEffect(() => {
        if (singleData) {
            setFieldValue("position", singleData?.position)
            setFieldValue("slug", singleData?.slug)
            setFieldValue("banner", singleData?.banner)
            setFieldValue("location", singleData?.location)
            setFieldValue("location", singleData?.location)
            setFieldValue("category", singleData?.category)
            setFieldValue("experience", singleData?.experience)
            setFieldValue("work_type", singleData?.work_type)
            setFieldValue("description", singleData?.description)
            setFieldValue("requirement", singleData?.requirement)
            setFieldValue("status", singleData?.status)

            setSelectedThumbnail(singleData?.banner)
        }
    }, [singleData, isSuccess, setFieldValue])


    return (
        <>
            {(isLoading || singleDataLoading) && <Loader />}
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles="CMS" active="Edit New Job Position" items={["Home", "Job Position"]} links={["/dashboard", "/cms/job-positions"]} />
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Edit Job Position</h3>
                        </Card.Header>
                        <Card.Body className="add_new_product">
                            <Form onSubmit={handleSubmit} className="add_category_form">

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Position <span className="required_icon">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="position"
                                                onChange={handlePositionChange}
                                                onBlur={handleBlur}
                                                value={values.position}
                                            />
                                            {errors.position && touched.position && <p className="error">{errors.position}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={values.status.toString()}
                                                onChange={(e) => {
                                                    const newValue = e.target.value === 'true';
                                                    setFieldValue("status", newValue);
                                                }}
                                                onBlur={handleBlur}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </Form.Select>
                                            {errors.status && touched.status && <p className="error">{errors.status}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Slug <span className="required_icon">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="slug"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.slug}
                                            />
                                            {errors.slug && touched.slug && <p className="error">{errors.slug}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Work Type <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="work_type"
                                                value={values.work_type}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.work_type && touched.work_type && <p className="text-danger">{errors.work_type}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="category"
                                                value={values.category}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.category && touched.category && <p className="text-danger">{errors.category}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Experience <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="experience"
                                                value={values.experience}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.experience && touched.experience && <p className="text-danger">{errors.experience}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner <span className="text-danger">*</span></Form.Label>
                                            <Row>
                                                <Col md={3} className="d-flex justify-content-center">
                                                    {viewThumbnail ? (
                                                        <div className="position-relative">
                                                            <p>No image</p>
                                                            {/* <span className="position-absolute">
                                                                <button className="p-0 px-1" onClick={() => { setViewThumbnail(true); setFieldValue('banner', null); }}>
                                                                    <i className="icon icon-close text-danger"></i>
                                                                </button>
                                                            </span> */}
                                                        </div>
                                                    ) : (
                                                        <div className="position-relative">
                                                            <img src={selectedThumbnail} alt="Selected Thumbnail" width={100} height={100} />
                                                            {/* <span className="position-absolute"> */}
                                                            {/* <button className="p-0 px-1" onClick={() => { setViewThumbnail(true); setFieldValue('banner', null); }}>
                                                                    <i className="icon icon-close text-danger"></i>
                                                                </button> */}
                                                            {/* </span> */}
                                                        </div>
                                                    )}
                                                </Col>
                                                <Col md={9}>
                                                    <Form.Control
                                                        type="file"
                                                        name="banner"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                        onChange={handleThumbnailChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.banner && touched.banner ? (
                                                        <p className="error">{errors.banner}</p>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="location"
                                                value={values.location}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.location && touched.location && <p className="text-danger">{errors.location}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col}>
                                        <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                        <SunEditor
                                            name="description"
                                            onChange={(content) => setFieldValue("description", content)}
                                            onBlur={() => setFieldTouched("description", true)}
                                            setOptions={options_for_sunEditor}
                                            setContents={values.description}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col}>
                                        <Form.Label>Requirement</Form.Label>
                                        <SunEditor
                                            name="requirement"
                                            onChange={(content) => setFieldValue("requirement", content)}
                                            onBlur={() => setFieldTouched("requirement", true)}
                                            setOptions={options_for_sunEditor}
                                            setContents={values.requirement}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mt-5">
                                    <Button type="submit" className="btn-primary mx-auto w-auto">
                                        Save
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