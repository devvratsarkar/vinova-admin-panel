import React, { useState, useRef } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useFormik } from "formik";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { useAddOptometristStoreMutation } from "../../redux/features/optometristAPIEndPoint";
import { OptometristStoreValidationSchema } from "../../commondata/formvalidations";
import { State } from "country-state-city";

export default function AddOptometristStore() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addOptometristStore, { isLoading: loadingAddData }] = useAddOptometristStoreMutation();

    const [imagePreview, setImagePreview] = useState(null);
    const imageRef = useRef(null);

    const servicesOptions = [
        { value: "Eye Test", label: "Eye Test" },
        { value: "Frame Fitting", label: "Frame Fitting" },
        { value: "Contact Lens Fitting", label: "Contact Lens Fitting" },
        { value: "Eye Examination", label: "Eye Examination" },
        { value: "Lens Replacement", label: "Lens Replacement" },
    ];

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
    ];
    
    const allStates = State.getAllStates().map((state) => ({
        value: state.name,
        label: `${state.name}, ${state.countryCode}`,
    }));

    const initialValues = {
        name: "",
        address: "",
        open_at: "",
        close_at: "",
        services: [],
        our_presence: [],
        map_link: "",
        phone_number: "",
        description: "",
        lat: "",
        long: "",
        status: true,
        image: ""
    };

    const { values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: OptometristStoreValidationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            // const currentDate = new Date().toISOString().split('T')[0];

            Object.entries(values).forEach(([key, value]) => {
                let processedValue = value;
                if (key === "open_at" || key === "close_at") {
                    if (value) {
                        processedValue = `${value}:00`;
                    }
                }
                if (key === "services" && Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append("services[]", item);
                    });
                } if (key === "our_presence" && Array.isArray(value)) {
                    value.forEach((item) => formData.append("our_presence[]", item));
                }
                else {
                    formData.append(key, processedValue);
                }
            });

            try {
                const resp = await addOptometristStore(formData);
                if (resp?.data?.http_status_code === 201) {
                    toast.success(resp?.data?.message);
                    navigate("/optometrist/all-stores");
                } else {
                    toast.error(resp?.data?.message);
                }
            } catch (err) {
                toast.error(err?.message || "Something went wrong!");
            }
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFieldValue("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            {
                loadingAddData && <Loader />
            }
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader
                        titles="Lens Store"
                        active="Add New Lens Store"
                        items={["Home", "Optometrist Store List"]}
                        links={["/dashboard", "/optometrist/all-stores"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Add New Lens Store</h3>
                        </Card.Header>
                        <Card.Body className="add_new_product">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                ref={imageRef}
                                                onChange={handleImageChange}
                                            />
                                            {touched.image && errors.image && (
                                                <div className="text-danger mt-1">{errors.image}</div>
                                            )}
                                            {imagePreview && (
                                                <div className="mt-2 position-relative" style={{ width: "100px" }}>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Image Preview"
                                                        className="img-fluid"
                                                        style={{ width: "100px", height: "auto" }}
                                                    />
                                                    <FaEye
                                                        className="position-absolute text-light"
                                                        style={{ top: "5px", right: "10px", cursor: "pointer" }}
                                                        onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: imagePreview }))}
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.name && errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Address<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.address && errors.address}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.address}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Open At<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="time"
                                                name="open_at"
                                                value={values.open_at}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.open_at && errors.open_at}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.open_at}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Close At<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="time"
                                                name="close_at"
                                                value={values.close_at}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.close_at && errors.close_at}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.close_at}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone_number"
                                                value={values.phone_number}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.phone_number && errors.phone_number}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone_number}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Map Link<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="map_link"
                                                value={values.map_link}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.map_link && errors.map_link}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.map_link}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Latitude<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                name="lat"
                                                value={values.lat}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.lat && errors.lat}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lat}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Longitude<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                name="long"
                                                value={values.long}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.long && errors.long}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.long}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Our Presence<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={allStates}
                                                name="our_presence"
                                                value={allStates.filter(option =>
                                                    values.our_presence.includes(option.value)
                                                )}
                                                onChange={(selected) =>
                                                    setFieldValue("our_presence", selected.map(item => item.value))
                                                }
                                                onBlur={() => setFieldTouched("our_presence", true)}
                                            />
                                            {touched.our_presence && errors.our_presence && (
                                                <div className="text-danger mt-1">{errors.our_presence}</div>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Services<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={servicesOptions}
                                                name="services"
                                                value={servicesOptions.filter(option =>
                                                    values.services.includes(option.value)
                                                )}
                                                onChange={(selected) =>
                                                    setFieldValue("services", selected.map(item => item.value))
                                                }
                                                onBlur={() => setFieldTouched("services", true)}
                                            />
                                            {touched.services && errors.services && (
                                                <div className="text-danger mt-1">{errors.services}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.description && errors.description}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={statusOptions}
                                                name="status"
                                                value={statusOptions.find(option => option.value === values.status)}
                                                onChange={(selected) => setFieldValue("status", selected?.value)}
                                                onBlur={() => setFieldTouched("status", true)}
                                            />
                                            {touched.status && errors.status && (
                                                <div className="text-danger mt-1">{errors.status}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="justify-content-center mt-3">
                                    <Button type="submit" variant="primary" className="w-auto">
                                        Submit
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