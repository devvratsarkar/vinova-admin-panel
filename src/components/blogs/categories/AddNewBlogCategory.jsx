import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import slugify from "slugify";
import { AddBlogsCategoryValidation } from "../../../commondata/formvalidations";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useAddNewBlogCategoryMutation } from "../../../redux/features/postApiSecond";
import { useGetAllBlogsCategoryQuery } from "../../../redux/features/getApiSecond";
import SelectWithDragDrop from "../../common/SelectWithDragDrop";
import SeoForm from "../../seo-page/SeoForm";


export default function AddNewBlogCategory() {
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [addNewBlogCategory, { isLoading }] = useAddNewBlogCategoryMutation()
    const { refetch } = useGetAllBlogsCategoryQuery()
    // const { data: parentChildCategory } = useGetParentChildBlogsCategoryQuery()
    // const parentChildCategoryData = parentChildCategory?.context?.data;
    const { data: res } = useGetAllBlogsCategoryQuery()
    const categoryData = res?.data;

    const navigate = useNavigate()
    const initialValues = {
        category_name: "",
        slug: "",
        parent_category: null,
        description: "",
        banner_image: "",
        status: true,
        content: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: AddBlogsCategoryValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'banner_image') {
                    formData.append('banner_image', value);
                } else if (key === 'parent_category') {
                    const categories = Array.isArray(value) ? value : value ? [value] : [];
                    categories.forEach((cate) => {
                        if (cate?.value) {
                            formData.append('parent_category', cate.value);
                        }
                    });
                } else {
                    formData.append(key, value);
                }
            });

            try {
                const response = await addNewBlogCategory(formData);
                if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                    toast.success(response?.data?.message || "Category created successfully");
                    refetch();
                    navigate(`/all-blog-categories`);
                } else {
                    toast.error(response?.data?.message || "Failed to save category");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "An error occurred");
            }
        },
    });

    const options = Array.isArray(categoryData?.GetBlogCategory)
        ? categoryData.GetBlogCategory.map(category => ({
            value: category?._id,
            label: category?.name || category?.category_name
        }))
        : Array.isArray(categoryData)
            ? categoryData.map(category => ({
                value: category?._id,
                label: category?.name || category?.category_name
            }))
            : [];


    const generateSlug = (values) => {
        const slug = slugify(values, { lower: true });
        setFieldValue("slug", slug);
    };
    const handleCategorySlug = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };
    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles="Blog Categories" active={["Add Blog Categories"]} items={["Home", "Blog Categories List"]} links={["/dashboard", `/all-blog-categories`]} />
                </Col>
                <Col className="text-end">
                    <Link to={`/all-blog-categories`} className="btn btn-success text-white me-3" >View All Categories</Link>
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Body className="add_new_product">
                        <Form onSubmit={handleSubmit} className="add_category_form">
                            {isLoading && <Loader />}
                            <Row className="mb-5">
                                <Col as={Col} md="6">
                                    <Form.Group>
                                        <Form.Label>
                                            Name <span className="required_icon">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            title="text"
                                            name="category_name"
                                            onChange={handleCategorySlug}
                                            onBlur={handleBlur}
                                            value={values.category_name}
                                        />
                                        {errors.category_name && touched.category_name ? (
                                            <p className={`error`}>{errors.category_name}</p>
                                        ) : null}
                                    </Form.Group>
                                </Col>
                                <Col as={Col} md="6">
                                    <Form.Group>
                                        <Form.Label>
                                            Slug <span className="required_icon">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            title="text"
                                            name="slug"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.slug}
                                        />
                                        {errors.slug && touched.slug ? (
                                            <p className={`error`}>{errors.slug}</p>
                                        ) : null}
                                    </Form.Group>
                                </Col>
                                <Col as={Col} md="6">
                                    <Form.Group>
                                        <Form.Label>
                                            Parent Category
                                        </Form.Label>
                                        <SelectWithDragDrop
                                            options={options}
                                            name="parent_category"
                                            value={values.parent_category}
                                            onChange={(selectedOptions) =>
                                                setFieldValue("parent_category", selectedOptions)
                                            }
                                            onBlur={handleBlur}
                                            isMulti
                                            className="select_box rounded-4"
                                            isSearchable
                                            closeMenuOnSelect={false}
                                        />
                                        {errors.parent_category && touched.parent_category ? (
                                            <p className={`error`}>{errors.parent_category}</p>
                                        ) : null}
                                    </Form.Group>
                                </Col>
                                <Col as={Col} md={6}>
                                    <Form.Group>
                                        <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                        <Row>
                                            <Col as={Col} md={3} className="d-flex justify-content-center">
                                                <div className="selected_img_box">
                                                    <img src={
                                                        values.banner_image instanceof File
                                                            ? URL.createObjectURL(values.banner_image)
                                                            : values.banner_image
                                                    } alt="Banner Preview" />
                                                    <div className="selected_img_icon">
                                                        <i className="fa fa-close" onClick={() => { setFieldValue('banner_image', null) }}></i>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col as={Col} md={9}>
                                                <Form.Control
                                                    type="file"
                                                    name="banner_image"
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                            setFieldValue("banner_image", file);
                                                        } else {
                                                            toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                            e.target.value = null;
                                                        }
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                                {
                                                    errors.banner_image && touched.banner_image ? (
                                                        <p className="text-danger">{errors.banner_image}</p>
                                                    ) : null
                                                }
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col as={Col}>
                                    <Form.Group>
                                        <Form.Label>
                                            Description
                                        </Form.Label>

                                        <SunEditor onChange={(content) => setFieldValue("description", content)} onBlur={() => setFieldTouched("description", true)} name="description" setContents={values.description} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col as={Col} md="6">
                                    <Form.Group>
                                        <Form.Label>
                                            Status <span className="required_icon">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="status"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.status}
                                        >
                                            <option value={true}>Active</option>
                                            <option value={false}>Inactive</option>
                                        </Form.Select>
                                        {errors.status && touched.status ? (
                                            <p className={`error`}>{errors.status}</p>
                                        ) : null}
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
                            <Row className="mt-4">
                                <Button type="submit" className="btn-primary mx-auto w-auto" >Save</Button>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}
