import React, { useState, useRef } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetAllCategorySelectQuery } from "../../redux/features/CategoryAPIEndPoint";
import { useGetBrandsSelectQuery } from "../../redux/features/BrandAPIEndpoint";
import { useFormik } from "formik";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import SunEditor from "suneditor-react";
import { FaEye, FaTrash } from "react-icons/fa";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm";
import { ContactLensValidationSchema } from "../../commondata/formvalidations";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import toast from "react-hot-toast";
import { useAddFramesMutation, useGetFramesQuery } from "../../redux/features/framesAPIEndPoint";
import { useGetAllContactLensTypeQuery } from "../../redux/features/contactLensTypeAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import { useGetAllMaterialsQuery, getMaterialSelectOptions } from "../../redux/features/materialAPIEndPoint";

export default function AddNewContactLensForm({ lang }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { data: categoryData } = useGetAllCategorySelectQuery();
    const { data: brandData } = useGetBrandsSelectQuery()

    const [addData, { isLoading: loadingAddData }] = useAddFramesMutation()
    const { data: contactLensTypeData } = useGetAllContactLensTypeQuery()
    const { data: materialData } = useGetAllMaterialsQuery()

    const tagOptions = Array.isArray(contactLensTypeData?.data?.data) && contactLensTypeData?.data?.data?.length > 0
        ? contactLensTypeData.data.data.map((item) => ({
            label: item?.name,
            value: item?.slug || item?._id,
        }))
        : [];

    const categoryOption = Array.isArray(categoryData?.data) && categoryData?.data?.length > 0
        ? categoryData?.data?.map((item) => ({
            label: item?.category_name,
            value: item?._id
        }))
        : [];

    const brandOptions = Array.isArray(brandData?.data) && brandData?.data?.length > 0
        ? brandData?.data?.map((item) => ({
            label: item?.name,
            value: item?._id
        }))
        : [];

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
    ];

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "kid", label: "Kid" },
        { value: "unisex", label: "Unisex" }
    ];

    const contactLensTypeOptions = [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
    ];

    const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
    const featuredImageRef = useRef(null);
    const galleryImageRef = useRef(null);

    const initialValues = {
        name: "",
        slug: "",
        status: true,
        featured_image: "",
        short_desc: "",
        category: [],
        brand: "",
        gender: "",
        gallery_image: [],
        description: "",
        material: "",
        country_origin: "",
        type: "contact-lens",
        contact_lens_type: "",
        tags: [],
        usage_duration: "",
        toric_lens: true,
        base_curv: "",
        diameter: "",
        contact_water_content: "",
        lens_color: "#000000",
        lang: lang,
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
    };

    const { values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: ContactLensValidationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (key === "gallery_image" && Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append("gallery_image", item);
                    });
                } else if (key === "category" && Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append("category", item);
                    });
                } else if (key === "tags" && Array.isArray(value)) {
                    formData.append("tags", value.join(","));
                } else {
                    formData.append(key, value);
                }
            });

            try {
                const resp = await addData(formData);
                if (resp?.data?.http_status_code === 201) {
                    toast.success(resp?.data?.message);
                    navigate("/catalogue/contact-lenses");
                } else {
                    toast.error(resp?.data?.message);
                }
            } catch (err) {
                toast.error(err?.message || "Something went wrong!");
            }
        }
    });


    const handleNameChange = (e) => {
        handleChange(e);
        const slugValue = slugify(e.target.value);
        setFieldValue("slug", slugValue);
    };

    const handleFeaturedImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFieldValue("featured_image", file);
            setFeaturedImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImages = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        setFieldValue("gallery_image", [...values.gallery_image, ...files]);
        setGalleryImagePreviews([...galleryImagePreviews, ...newPreviews]);
    };

    const removeGalleryImage = (index) => {
        const newPreviews = galleryImagePreviews.filter((_, i) => i !== index);
        const newFiles = values.gallery_image.filter((_, i) => i !== index);
        setGalleryImagePreviews(newPreviews);
        setFieldValue("gallery_image", newFiles);
    };

    const previewImage = (url) => {
        window.open(url, "_blank");
    };

    return (
        <>
            {
                loadingAddData && <Loader />
            }

            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Add New Contact Lens</h3>
                        </Card.Header>
                        <Card.Body className="add_new_product">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleNameChange}
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
                                            <Form.Label>Slug<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="slug"
                                                value={values.slug}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.slug && errors.slug}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.slug}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={categoryOption}
                                                name="category"
                                                value={categoryOption.filter(option =>
                                                    values.category.includes(option.value)
                                                )}
                                                onChange={(selected) =>
                                                    setFieldValue("category", selected.map(item => item.value))
                                                }
                                                onBlur={() => setFieldTouched("category", true)}
                                            />
                                            {touched.category && errors.category && (
                                                <div className="text-danger mt-1">{errors.category}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Brand <span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={brandOptions}
                                                name="brand"
                                                value={brandOptions.find(option => option.value === values.brand)}
                                                onChange={(selected) => setFieldValue("brand", selected?.value || "")}
                                                onBlur={() => setFieldTouched("brand", true)}
                                            />
                                            {touched.brand && errors.brand && (
                                                <div className="text-danger mt-1">{errors.brand}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={genderOptions}
                                                name="gender"
                                                value={genderOptions.find(option => option.value === values.gender)}
                                                onChange={(selected) => setFieldValue("gender", selected?.value || "")}
                                                onBlur={() => setFieldTouched("gender", true)}
                                            />
                                            {touched.gender && errors.gender && (
                                                <div className="text-danger mt-1">{errors.gender}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact Lens Type <span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={contactLensTypeOptions}
                                                name="contact_lens_type"
                                                value={contactLensTypeOptions.find(option => option.value === values.contact_lens_type)}
                                                onChange={(selected) => setFieldValue("contact_lens_type", selected?.value || "")}
                                                onBlur={() => setFieldTouched("contact_lens_type", true)}
                                            />
                                            {touched.contact_lens_type && errors.contact_lens_type && (
                                                <div className="text-danger mt-1">{errors.contact_lens_type}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status <span className="text-danger">*</span></Form.Label>
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
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tag (Lens Type)</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={tagOptions}
                                                name="tags"
                                                value={tagOptions.filter((option) =>
                                                    values.tags?.includes(option.value)
                                                )}
                                                onChange={(selected) =>
                                                    setFieldValue("tags", selected ? selected.map((item) => item.value) : [])
                                                }
                                                onBlur={() => setFieldTouched("tags", true)}
                                                placeholder="Select tags..."
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Featured Image <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                ref={featuredImageRef}
                                                onChange={handleFeaturedImage}
                                            />
                                            {touched.featured_image && errors.featured_image && (
                                                <div className="text-danger mt-1">{errors.featured_image}</div>
                                            )}
                                            {featuredImagePreview && (
                                                <div className="mt-2 position-relative" style={{ width: "100px" }}>
                                                    <img
                                                        src={featuredImagePreview}
                                                        alt="Featured Preview"
                                                        className="img-fluid"
                                                        style={{ width: "100px", height: "auto" }}
                                                    />
                                                    <FaEye
                                                        className="position-absolute text-light"
                                                        style={{ top: "5px", right: "10px", cursor: "pointer" }}
                                                        onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: featuredImagePreview }))}
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Gallery Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                ref={galleryImageRef}
                                                onChange={handleGalleryImages}
                                            />
                                            <Row className="mt-2 d-flex flex-wrap gap-2">
                                                {galleryImagePreviews.map((preview, index) => (
                                                    <Col as={Col} md={2} key={index} className="position-relative" style={{ width: "100px" }} >
                                                        <img
                                                            src={preview.url}
                                                            alt={`Gallery Preview ${index}`}
                                                            className="img-fluid"
                                                            style={{ width: "100%", height: "100%" }}
                                                        />
                                                        <div className="position-absolute" style={{ top: "5px", right: "10px", backgroundColor: "#0e0e0e99", margin: "3px", borderRadius: "30px" }}>
                                                            <FaEye
                                                                className="me-2 text-light"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: preview.url }))}
                                                            />
                                                            <FaTrash
                                                                style={{ cursor: "pointer", color: "red" }}
                                                                onClick={() => removeGalleryImage(index)}
                                                            />
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Short Description<span className="text-danger">*</span></Form.Label>
                                            <SunEditor
                                                setContents={values.short_desc}
                                                onChange={(content) => setFieldValue("short_desc", content)}
                                                onBlur={() => setFieldTouched("short_desc", true)}
                                                setOptions={options_for_sunEditor}
                                            />
                                            {touched.short_desc && errors.short_desc && (
                                                <div className="text-danger mt-1">{errors.short_desc}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                            <SunEditor
                                                setContents={values.description}
                                                onChange={(content) => setFieldValue("description", content)}
                                                onBlur={() => setFieldTouched("description", true)}
                                                setOptions={options_for_sunEditor}
                                            />
                                            {touched.description && errors.description && (
                                                <div className="text-danger mt-1">{errors.description}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Usage Duration</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="usage_duration"
                                                value={values.usage_duration}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Toric Lens</Form.Label>
                                            <Form.Check
                                                type="checkbox"
                                                name="toric_lens"
                                                label=''
                                                checked={values.toric_lens}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Base Curve</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="base_curv"
                                                value={values.base_curv}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Diameter</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="diameter"
                                                value={values.diameter}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact Water Content</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_water_content"
                                                value={values.contact_water_content}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lens Color</Form.Label>
                                            <Form.Control
                                                type="color"
                                                name="lens_color"
                                                value={values.lens_color}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.lens_color && errors.lens_color && (
                                                <div className="text-danger mt-1">{errors.lens_color}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Material<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={getMaterialSelectOptions(materialData, values.material)}
                                                name="material"
                                                value={getMaterialSelectOptions(materialData, values.material).find(option => option.value === values.material)}
                                                onChange={(selected) => setFieldValue("material", selected?.value || "")}
                                                onBlur={() => setFieldTouched("material", true)}
                                            />
                                            {touched.material && errors.material && (
                                                <div className="text-danger mt-1">{errors.material}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Country of Origin</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="country_origin"
                                                value={values.country_origin}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <SeoForm
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        readOnlyStatus={false}
                                    />
                                </Row>
                                <Row className="justify-content-center mt-3">
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