import React, { useEffect } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { useFormik } from "formik";
import slugify from "slugify";
import { contactLensTypeValidationSchema } from "../../commondata/formvalidations";
import {
    useGetSingleContactLensTypeQuery,
    useGetAllContactLensTypeQuery,
    useUpdateContactLensTypeMutation,
} from "../../redux/features/contactLensTypeAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function EditContactLensTypeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { refetch } = useGetAllContactLensTypeQuery();
    const { data, isLoading: loadingSingleData, isSuccess, refetch: refetchSingle } =
        useGetSingleContactLensTypeQuery(id);
    const [updateData, { isLoading: loadingUpdate }] = useUpdateContactLensTypeMutation();

    const singleData = data?.data || null;

    const initialValues = {
        name: "",
        slug: "",
        description: "",
        status: true,
    };

    const { errors, values, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } =
        useFormik({
            initialValues,
            validationSchema: contactLensTypeValidationSchema,
            onSubmit: async (values) => {
                try {
                    const resp = await updateData({ id, data: values });
                    if (resp?.data?.http_status_code === 200) {
                        refetch();
                        refetchSingle();
                        toast.success(resp?.data?.message || "Contact lens type updated successfully");
                        navigate("/catalogue/contact-lens-type");
                    } else {
                        toast.error(resp?.data?.message || "Failed to update contact lens type");
                    }
                } catch (err) {
                    toast.error(err?.message || "Something went wrong");
                }
            },
        });

    useEffect(() => {
        refetchSingle();
    }, [id, refetchSingle]);

    useEffect(() => {
        if (isSuccess && singleData) {
            setFieldValue("name", singleData?.name || "");
            setFieldValue("slug", singleData?.slug || "");
            setFieldValue("description", singleData?.description || "");
            setFieldValue("status", singleData?.status ?? true);
        }
    }, [isSuccess, singleData, setFieldValue]);

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: "38px",
            height: "38px",
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: "38px",
            padding: "0 6px",
        }),
        input: (provided) => ({
            ...provided,
            margin: "0px",
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: "38px",
        }),
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        handleChange(e);
        setFieldValue("slug", slugify(name, { lower: true, strict: true }));
    };

    return (
        <>
            {(loadingUpdate || loadingSingleData) && <Loader />}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>
                                Name<span className="text-color">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name (e.g., Daily Lens)"
                                name="name"
                                value={values.name}
                                onChange={handleNameChange}
                                onBlur={handleBlur}
                                isInvalid={touched.name && errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="formBasicSlug">
                            <Form.Label>
                                Slug<span className="text-color">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter slug (e.g., daily-lens)"
                                name="slug"
                                value={values.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.slug && errors.slug}
                            />
                            <Form.Control.Feedback type="invalid">{errors.slug}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <Form.Label>
                                Description<span className="text-color">*</span>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.description && errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="formBasicStatus">
                            <Form.Label>
                                Status<span className="text-color">*</span>
                            </Form.Label>
                            <SelectWithDragDrop
                                options={statusOptions}
                                value={statusOptions.find((option) => option.value === values.status)}
                                onChange={(option) => {
                                    setFieldValue("status", option.value);
                                    setFieldTouched("status", true);
                                }}
                                styles={customStyles}
                                classNamePrefix="react-select"
                            />
                            {touched.status && errors.status && (
                                <div className="invalid-feedback d-block">{errors.status}</div>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Button type="submit" className="w-auto submit_btn">
                        Update
                    </Button>
                </Row>
            </Form>
        </>
    );
}
