import React, { useEffect } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import { AddBlogsValidation } from "../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../commondata/suneditorOptions";
import slugify from "slugify";
import "rsuite/TagInput/styles/index.css";
import SeoForm from "../seo-page/SeoForm"
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { useNavigate } from "react-router-dom";
import { useAddNewBlogMutation } from "../../redux/features/postApiSecond";
import { useGetAllBlogsCategoryQuery, useGetAllBlogsQuery, useGetAllBlogsTagsQuery } from "../../redux/features/getApiSecond";
import usePreventRefresh from "../../hooks/preventRefresh";


export default function AddNewPostForm() {
    usePreventRefresh();
    const dispatch = useDispatch();
    const [addNewBlog, { isLoading }] = useAddNewBlogMutation()
    // const [previewLink] = useGetPreviewLinkMutation()
    const { refetch } = useGetAllBlogsQuery()
    const { data: tag_res } = useGetAllBlogsTagsQuery()
    const tagData = tag_res?.data;
    const { data: res } = useGetAllBlogsCategoryQuery()
    const categoryData = res?.data;
    const navigate = useNavigate()
    const initialValues = {
        title: "",
        banner_image: "",
        status: true,
        slug: "",
        tags: [],
        excerpt: "",
        category: null,
        content: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, validateForm } = useFormik({
        initialValues: initialValues,
        validationSchema: AddBlogsValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'tags') {
                    formData.append('tags', Array.isArray(value) ? value.map(tag => tag.label).join(',') : '');
                } else if (key === 'category') {
                    value?.forEach(cate => {
                        formData.append('category', cate.value);
                    })
                }
                else {
                    formData.append(key, value);
                }
            });
            try {
                const response = await addNewBlog(formData);
                if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                    toast.success(response?.data?.message || "Blog created successfully");
                    refetch();
                    navigate(`/all-posts`);
                } else {
                    toast.error(response?.data?.message || "Failed to create blog");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "An error occurred");
            }
        },
    });


    const handleScrollToError = async () => {
        const formErrors = await validateForm();
        const errorFields = Object.keys(formErrors);

        if (errorFields.length > 0) {
            const errorElement = document.getElementsByName(errorFields[0])[0];
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth' });
                errorElement.focus();
            }
        }
    };
    const generateSlug = (values) => {
        const slug = slugify(values, { lower: true });
        setFieldValue("slug", slug);
    };

    const handleBlogSlug = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };

    const tagOptions = Array.isArray(tagData) && tagData ? tagData.map(tag => ({
        value: tag?._id || tag?.id || tag?.name,
        label: tag?.name,
    })) : [];

    const options = Array.isArray(categoryData?.GetBlogCategory)
        ? categoryData.GetBlogCategory.map((category) => ({
            value: category?._id,
            label: category?.name || category?.category_name,
        }))
        : Array.isArray(categoryData)
            ? categoryData.map((category) => ({
                value: category?._id,
                label: category?.name || category?.category_name,
            }))
            : [];



    const handlePreview = async () => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'tags') {
                formData.append('tags', Array.isArray(value) ? value.map(tag => tag.label).join(',') : '');
            } else if (key === 'category') {
                value.forEach(cate => {
                    formData.append('category', cate.value);
                });
            } else {
                formData.append(key, value);
            }
        });

        try {
            // const response = await previewLink(formData);

            // if (response?.data?.http_status_code === 201) {
            //     toast.success(response?.data?.message)
            //     window.open(`${USER_BASE_URL}/blogs/${response?.data?.data}`)
            // } else {
            //     toast.error(response?.data?.message)

            // }

        } catch (error) {
            console.error("error:", error);
        }
    };


    return (
        <>
            <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                handleScrollToError();
            }} className="add_category_form">
                {isLoading && <Loader />}
                <Row className="mb-4">
                    <Form.Group as={Col} md="4">
                        <Form.Label>
                            Title <span className="required_icon">*</span>
                        </Form.Label>
                        <Form.Control
                            title="text"
                            name="title"
                            onChange={handleBlogSlug}
                            onBlur={handleBlur}
                            value={values.title}
                        />
                        {errors.title && touched.title ? (
                            <p className={`error`}>{errors.title}</p>
                        ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>
                            Banner Image (JPG,JPEG,PNG,2MB Size)
                            <span className="required_icon">*</span>
                        </Form.Label>
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
                        // value={values.banner_image}
                        />
                        {values.banner_image && (() => {
                            const previewUrl = values.banner_image instanceof File ? URL.createObjectURL(values.banner_image) : values.banner_image;
                            return (
                                <div className="selected_img_box position-relative">
                                    <img src={previewUrl} alt="Banner Preview" />
                                    <div className="selected_img_icon d-flex gap-1">
                                        <i className="fe fe-eye" style={{ cursor: "pointer" }} onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: previewUrl }))}></i>
                                        <i className="fa fa-close" onClick={() => { setFieldValue('banner_image', null) }}></i>
                                    </div>
                                </div>
                            );
                        })()}
                        {errors.banner_image && touched.banner_image ? (
                            <p className={`error`}>{errors.banner_image}</p>
                        ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>
                            Status <span className="required_icon">*</span>
                        </Form.Label>
                        <Form.Select
                            name="status"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.status}
                        >
                            <option value="">select</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </Form.Select>
                        {errors.status && touched.status ? (
                            <p className={`error`}>{errors.status}</p>
                        ) : null}
                    </Form.Group>
                </Row>
                <Row className="mb-6">
                    <Form.Group as={Col} md="4">
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
                    <Form.Group as={Col} md="4">
                        <Form.Label>
                            Excerpt <span className="required_icon">*</span>
                        </Form.Label>
                        <Form.Control
                            title="text"
                            name="excerpt"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.excerpt}
                        />
                        {errors.excerpt && touched.excerpt ? (
                            <p className={`error`}>{errors.excerpt}</p>
                        ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Category <span className="required_icon">*</span></Form.Label>
                        <SelectWithDragDrop
                            options={options}
                            name="category"
                            value={values.category}
                            onChange={(selectedOptions) =>
                                setFieldValue("category", selectedOptions)
                            }
                            onBlur={handleBlur}
                            isMulti
                            className="select_box rounded-4"
                            isSearchable
                        // closeMenuOnSelect={false}
                        />
                        {errors.category && touched.category ? (
                            <p className={`error`}>{errors.category}</p>
                        ) : null}
                    </Form.Group>
                </Row>
                <Row className="mb-6">
                    <Form.Group as={Col} md="12">
                        <Form.Label>Tags</Form.Label>
                        <SelectWithDragDrop creatable
                            options={tagOptions}
                            name="tags"
                            value={values.tags}
                            onChange={(selectedOptions) => setFieldValue("tags", selectedOptions || [])}
                            onBlur={handleBlur}
                            className="rounded-4"
                            isSearchable
                            placeholder="Add Tags..."
                            isMulti
                            closeMenuOnSelect={false}
                        />
                    </Form.Group>
                </Row>


                <Row className="mb-6">
                    <Form.Group as={Col} md="12">
                        <Form.Label>
                            Content <span className="required_icon">*</span>
                        </Form.Label>
                        <SunEditor
                            name="content"
                            onChange={(content) => setFieldValue("content", content)}
                            onBlur={() => setFieldTouched("content", true)}
                            setContents={values.content}
                            setOptions={options_for_sunEditor}
                        />
                        {errors.content && touched.content ? (
                            <p className={`error`}>{errors.content}</p>
                        ) : null}
                    </Form.Group>
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
                    <Col as={Col} md={6} className="text-end">
                        <Button
                            type="submit"
                            className="btn-primary mx-auto w-auto"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
