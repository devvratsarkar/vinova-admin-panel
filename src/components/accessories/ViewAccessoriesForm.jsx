import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetAllCategorySelectQuery } from "../../redux/features/CategoryAPIEndPoint";
import { useGetBrandsSelectQuery } from "../../redux/features/BrandAPIEndpoint";
import { useFormik } from "formik";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import SunEditor from "suneditor-react";
import { FaTrash } from "react-icons/fa";
import { ImagePreviewWithEye } from "../common/ImageFileInput";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm";
import { accessoriesValidationSchema } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import toast from "react-hot-toast";
import { useGetAccessoriesDataQuery, useUpdateAccessoriesDataMutation } from "../../redux/features/framesAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import { useGetAllMaterialsQuery, getMaterialSelectOptions } from "../../redux/features/materialAPIEndPoint";

export default function ViewAccessoriesForm({ lang }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: categoryData } = useGetAllCategorySelectQuery();
    const { data: brandData } = useGetBrandsSelectQuery();
    const { data: materialData } = useGetAllMaterialsQuery();
    const [updateAccessoriesData, { isLoading: updating }] = useUpdateAccessoriesDataMutation()
    const { data, isLoading, refetch: singleRefetch, isSuccess } = useGetAccessoriesDataQuery(id)
    const singleData = data?.data || null

    const categoryOption = Array.isArray(categoryData?.data) ? categoryData.data.map(item => ({
        label: item.category_name,
        value: item._id
    })) : [];

    const brandOptions = Array.isArray(brandData?.data) ? brandData.data.map(item => ({
        label: item.name,
        value: item._id
    })) : [];

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
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
        box_content: "",
        gallery_image: [],
        description: "",
        material: "",
        country_origin: "",
        type: "accessories",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
    };

    const { values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: accessoriesValidationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === "gallery_image" && Array.isArray(value)) {
                    value.forEach(item => formData.append("gallery_image", item));
                } else if (key === "category" && Array.isArray(value)) {
                    value.forEach(item => formData.append("category", item));
                } else {
                    formData.append(key, value);
                }
            });

            try {
                const resp = await updateAccessoriesData({ id, formData });
                if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
                    singleRefetch();
                    toast.success(resp?.data?.message);
                    navigate("/catalogue/accessories");
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
        setFieldValue("slug", slugify(e.target.value));
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
        const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), file }));
        setFieldValue("gallery_image", [...values.gallery_image, ...files]);
        setGalleryImagePreviews([...galleryImagePreviews, ...newPreviews]);
    };

    const removeGalleryImage = (index) => {
        setGalleryImagePreviews(galleryImagePreviews.filter((_, i) => i !== index));
        setFieldValue("gallery_image", values.gallery_image.filter((_, i) => i !== index));
    };


    useEffect(() => {
        if (isSuccess && singleData) {
            // Simple fields
            setFieldValue("name", singleData.name || "");
            setFieldValue("slug", singleData.slug || "");
            setFieldValue("status", singleData.status ?? true);
            setFieldValue("box_content", singleData.box_content || "");
            setFieldValue("country_origin", singleData.country_origin || "");
            setFieldValue("material", singleData.material || "");
            setFieldValue("type", singleData.type || "accessories");
            setFieldValue("featured_image", singleData?.featured_image)
            setFieldValue("gallery_image", singleData?.gallery_image?.map((item) => item))
            // SEO fields
            setFieldValue("meta_title", singleData.meta_title || "");
            setFieldValue("meta_description", singleData.meta_description || "");
            setFieldValue("meta_keywords", singleData.meta_keywords || "");
            setFieldValue("og_tag", singleData.og_tag || "");
            setFieldValue("schema_markup", singleData.schema_markup || "");

            // Select fields
            setFieldValue(
                "category",
                singleData.category?.map(item => item._id) || []
            );
            setFieldValue(
                "brand",
                singleData.brand?._id || ""
            );

            // Rich text fields
            setFieldValue("short_desc", singleData.short_desc || "");
            setFieldValue("description", singleData.description || "");

            // Images
            setFeaturedImagePreview(singleData.featured_image || null);
            setGalleryImagePreviews(
                Array.isArray(singleData.gallery_image)
                    ? singleData.gallery_image.map(img => ({ url: img, file: null }))
                    : []
            );
            setFieldValue(
                "gallery_image",
                Array.isArray(singleData.gallery_image) ? singleData.gallery_image : []
            );
        }
    }, [isSuccess, singleData]);
    return (
        <>
            {(isLoading || updating) && <Loader />}
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader
                        titles="Accessories"
                        active="Edit Accessories"
                        items={["Home", "Accessories List"]}
                        links={["/dashboard", "/catalogue/accessories"]}
                    />
                </Col>
                <Col className="text-end">
                    <Link to="/catalogue/category" className="btn btn-success text-white me-3">
                        View All category
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Add New Accessories</h3>
                        </Card.Header>
                        <Card.Body className="add_new_product">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {/* Name & Slug */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="name" value={values.name} onChange={handleNameChange} onBlur={handleBlur} isInvalid={touched.name && errors.name} readOnly />
                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Slug<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="slug" value={values.slug} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.slug && errors.slug} readOnly />
                                            <Form.Control.Feedback type="invalid">{errors.slug}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    {/* Category & Brand */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop isMulti options={categoryOption} name="category" value={values.category.map(id => categoryOption.find(opt => opt.value === id)).filter(Boolean)} onChange={selected => setFieldValue("category", selected.map(s => s.value))} onBlur={() => setFieldTouched("category", true)} isDisabled />
                                            {touched.category && errors.category && <div className="text-danger mt-1">{errors.category}</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Brand<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop options={brandOptions} name="brand" value={brandOptions.find(option => option.value === values.brand)} onChange={selected => setFieldValue("brand", selected?.value || "")} onBlur={() => setFieldTouched("brand", true)} isDisabled />
                                            {touched.brand && errors.brand && <div className="text-danger mt-1">{errors.brand}</div>}
                                        </Form.Group>
                                    </Col>

                                    {/* Material & Status */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Material<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop options={getMaterialSelectOptions(materialData, values.material)} name="material" value={getMaterialSelectOptions(materialData, values.material).find(option => option.value === values.material)} onChange={selected => setFieldValue("material", selected?.value || "")} onBlur={() => setFieldTouched("material", true)} isDisabled />
                                            {touched.material && errors.material && <div className="text-danger mt-1">{errors.material}</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status<span className="text-danger">*</span></Form.Label>
                                            <SelectWithDragDrop options={statusOptions} name="status" value={statusOptions.find(option => option.value === values.status)} onChange={selected => setFieldValue("status", selected?.value)} onBlur={() => setFieldTouched("status", true)} isDisabled />
                                            {touched.status && errors.status && <div className="text-danger mt-1">{errors.status}</div>}
                                        </Form.Group>
                                    </Col>

                                    {/* Featured & Gallery Images */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Featured Image<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="file" accept="image/*" ref={featuredImageRef} onChange={handleFeaturedImage} readOnly />
                                            {touched.featured_image && errors.featured_image && <div className="text-danger mt-1">{errors.featured_image}</div>}
                                            <ImagePreviewWithEye src={featuredImagePreview} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Gallery Images</Form.Label>
                                            <Form.Control type="file" accept="image/*" multiple ref={galleryImageRef} onChange={handleGalleryImages} readOnly />
                                            <Row className="mt-2 d-flex flex-wrap gap-2">
                                                {galleryImagePreviews.map((preview, i) => (
                                                    <Col key={i} style={{ width: "100px", position: "relative" }}>
                                                        <ImagePreviewWithEye src={preview.url} alt={`Gallery ${i}`} compact />
                                                        <FaTrash style={{ cursor: "pointer", color: "red" }} onClick={() => removeGalleryImage(i)} />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Form.Group>
                                    </Col>

                                    {/* Short Description & Description */}
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Short Description<span className="text-danger">*</span></Form.Label>
                                            <SunEditor setContents={values.short_desc} onChange={content => setFieldValue("short_desc", content)} onBlur={() => setFieldTouched("short_desc", true)} setOptions={options_for_sunEditor} readOnly />
                                            {touched.short_desc && errors.short_desc && <div className="text-danger mt-1">{errors.short_desc}</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                            <SunEditor setContents={values.description} onChange={content => setFieldValue("description", content)} onBlur={() => setFieldTouched("description", true)} setOptions={options_for_sunEditor} readOnly />
                                            {touched.description && errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                                        </Form.Group>
                                    </Col>

                                    {/* Box Content & Country */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Box Content</Form.Label>
                                            <Form.Control type="text" name="box_content" value={values.box_content} onChange={handleChange} onBlur={handleBlur} readOnly />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Country of Origin</Form.Label>
                                            <Form.Control type="text" name="country_origin" value={values.country_origin} onChange={handleChange} onBlur={handleBlur} readOnly />
                                        </Form.Group>
                                    </Col>

                                    {/* SEO Fields */}
                                    <Col md={12}>
                                        <SeoForm
                                            handleChange={handleChange}
                                            values={values}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            touched={touched}
                                            readOnlyStatus={true}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}