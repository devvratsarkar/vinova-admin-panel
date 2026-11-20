import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { AddBrandValidation } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { useAddBrandMutation, useGetBrandsQuery, useGetBrandsSelectQuery, useGetSingleBrandQuery, useUpdateBrandMutation } from "../../redux/features/BrandAPIEndpoint";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";

export default function EditBrandForm({ lang }) {
  const { id } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [featuredImage, setFeaturedImage] = useState(null);


  const { data: singleData, isLoading: loadingSingleData, refetch: refetchSingleData, isSuccess } = useGetSingleBrandQuery(id)

  const singleBrandData = singleData?.data || null

  const initialValues = {
    name: "",
    slug: "",
    status: true,
    is_top: false,
    type: "Frame",
    featured_image: null,
    short_description: "",
    description: "",
    lang: lang,
    meta_title: "",
    og_tag: "",
    meta_description: "",
    meta_keywords: "",
    schema_markup: "",
  };

  const { refetch } = useGetBrandsQuery();
  const { refetch: selectBrand } = useGetBrandsSelectQuery();
  const [addNewBrand, { isLoading }] = useUpdateBrandMutation();

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: AddBrandValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await addNewBrand({ id: id, formData: formData });
        if (response?.data?.http_status_code === 200) {
          refetch();
          refetchSingleData()
          selectBrand();
          toast.success(response?.data?.message);
          navigate("/brand");
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.log("error", error)
        toast.error(error?.message);
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

  const handleBrandNameChange = (event) => {
    handleChange(event);
    const productName = event.target.value;
    generateSlug(productName);
  };

  useEffect(() => {
    setFieldValue("name", singleBrandData?.name)
    setFieldValue("status", singleBrandData?.status)
    setFieldValue("is_top", singleBrandData?.is_top ?? false)
    setFieldValue("slug", singleBrandData?.slug)
    setFieldValue("type", singleBrandData?.type)
    setFieldValue("featured_image", singleBrandData?.featured_image)
    setFieldValue("short_description", singleBrandData?.short_description)
    setFieldValue("description", singleBrandData?.description)
    setFieldValue("meta_title", singleBrandData?.meta_title)
    setFieldValue("meta_description", singleBrandData?.meta_description)
    setFieldValue("meta_keywords", singleBrandData?.meta_keywords)
    setFieldValue("og_tag", singleBrandData?.og_tag)
    setFieldValue("schema_markup", singleBrandData?.schema_markup)

    setFeaturedImage(singleBrandData?.featured_image)
  }, [singleBrandData, isSuccess, setFieldValue])

  console.log("featured_image", values)

  return (
    <>
      {isLoading && <Loader />}
      <Row>
        <Col>
          <Card>
            {/* <Card.Header>Edit Brand</Card.Header> */}
            <Card.Body>
              <Form onSubmit={handleSubmit} className="p-2" encType="multipart/form-data">
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Brand Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleBrandNameChange}
                        onBlur={handleBlur}
                      />
                      {errors.name && touched.name ? (
                        <p className="error">{errors.name}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Slug <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="slug"
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.slug && touched.slug ? (
                        <p className="error">{errors.slug}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Row>
                        <Col as={Col} md={10}>
                          <Form.Label>Featured Image <span className="text-danger">*</span></Form.Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col as={Col} md={12}>
                          <Form.Control
                            type="file"
                            name="featured_image"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const fileUrl = URL.createObjectURL(file);
                                setFieldValue("featured_image", file);
                                setFeaturedImage(fileUrl);
                                setShowFeaturedImage(true);
                              }
                            }}
                            accept=".jpg,.jpeg,.png,.webp"
                            onBlur={handleBlur}
                          />
                        </Col>
                      </Row>
                      {featuredImage && (
                        <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
                          <img
                            src={featuredImage}
                            alt="Preview"
                            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                          />
                          <Button
                            variant="light"
                            className="position-absolute"
                            style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                            onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: featuredImage }))}
                          >
                            <i className="fe fe-eye"></i>
                          </Button>
                        </div>
                      )}
                      {errors.featured_image && touched.featured_image ? (
                        <p className="error">{errors.featured_image}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Form.Label>Short Description</Form.Label>
                      <SunEditor
                        setOptions={options_for_sunEditor}
                        name="short_description"
                        onChange={(short_description) =>
                          setFieldValue("short_description", short_description)
                        }
                        onBlur={() => setFieldTouched("short_description", true)}
                        setContents={values.short_description}
                      />
                      {errors.short_description && touched.short_description ? (
                        <p className="error">{errors.short_description}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <SunEditor
                        setOptions={options_for_sunEditor}
                        name="description"
                        onChange={(description) => setFieldValue("description", description)}
                        onBlur={() => setFieldTouched("description", true)}
                        setContents={values.description}
                      />
                      {errors.description && touched.description ? (
                        <p className="error">{errors.description}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        type="text"
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="Frame">Frame</option>
                        <option value="Lens">Lens</option>
                        <option value="Contact Lenses">Contact Lenses</option>
                        <option value="Glases">Glases</option>
                      </Form.Select>
                      {errors.type && touched.type ? (
                        <p className="error">{errors.type}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6} className="d-flex align-items-end">
                    <Form.Check
                      type="checkbox"
                      id="is_top"
                      name="is_top"
                      label="Is Top Brand"
                      className="mb-3"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.is_top}
                    />
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

                <Row className="my-2 justify-content-center">
                  <Button type="submit" className="btn btn-primary w-auto submit_btn">Submit</Button>
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