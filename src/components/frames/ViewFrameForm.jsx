import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetAllCategorySelectQuery } from "../../redux/features/CategoryAPIEndPoint";
import { useAddBrandMutation, useGetBrandsSelectQuery } from "../../redux/features/BrandAPIEndpoint";
import { useFormik } from "formik";
import * as Yup from "yup";
// import slugify from "react-slugify";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import SunEditor from "suneditor-react";
import { FaEye, FaTrash } from "react-icons/fa";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm";
import { FrameValidationSchema } from "../../commondata/formvalidations";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import toast from "react-hot-toast";
import { useAddFramesMutation, useGetFramesQuery, useGetSingleFramesQuery } from "../../redux/features/framesAPIEndPoint";
import { useGetAllContactLensTypeQuery } from "../../redux/features/contactLensTypeAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import { useGetAllMaterialsQuery, getMaterialSelectOptions } from "../../redux/features/materialAPIEndPoint";

export default function ViewFrameForm({ lang }) {
  const { id } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: categoryData } = useGetAllCategorySelectQuery();
  const { data: brandData } = useGetBrandsSelectQuery()
  const { data: contactLensTypeData } = useGetAllContactLensTypeQuery()
  const { data: materialData } = useGetAllMaterialsQuery()

  const tagOptions = Array.isArray(contactLensTypeData?.data?.data) && contactLensTypeData?.data?.data?.length > 0
    ? contactLensTypeData.data.data.map((item) => ({
      label: item?.name,
      value: item?.slug || item?._id,
    }))
    : [];

  const { data, isLoading, refetch: singleRefetch, isSuccess } = useGetSingleFramesQuery(id)

  const singleData = data?.data || null

  useEffect(() => {
    singleRefetch()
  }, [singleRefetch])


  const { refetch } = useGetFramesQuery()
  const [addData, { isLoading: loadingAddData }] = useAddFramesMutation()

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

  const typeOptions = [
    { value: "specs", label: "Specs" },
    { value: "sunglass", label: "Sunglass" }
  ];

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

  const frameTypeOptions = [
    { value: "rimmed", label: "Rimmed" },
    { value: "semi-rimmed", label: "Semi Rimmed" },
    { value: "rimless", label: "Rimless" },
    { value: "any-type", label: "Any Type" }
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
    category: "",
    brand: "",
    gender: "",
    rim_details: "",
    gallery_image: [],
    description: "",
    material: "",
    warranty: "",
    country_origin: "",
    type: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
    // is_prescription: true,
    // is_blue_filter: true,
    // is_rx_compatible: true,
    frame_type: "",
    is_premium: false,
    tags: [],
  };

  const { values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, setFieldTouched } = useFormik({
    initialValues,
    validationSchema: FrameValidationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "gallery_image" && Array.isArray(value)) {
          value.forEach((item) => {
            formData.append("gallery_image", item);
          });
        } else if (key === "category" && value) {
          formData.append("category", value);
        } else {
          formData.append(key, value);
        }
      });

      try {
        const resp = await addData(formData);
        if (resp?.data?.http_status_code === 201) {
          refetch();
          toast.success(resp?.data?.message);
          navigate("/catalogue/frames");
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

  useEffect(() => {
    setFieldValue("name", singleData?.name)
    setFieldValue("slug", singleData?.slug)
    setFieldValue("category", singleData?.category?.[0]?._id ?? singleData?.category?._id ?? "")
    setFieldValue("brand", singleData?.brand?._id)
    setFieldValue("type", singleData?.type)
    setFieldValue("gender", singleData?.gender)
    setFieldValue("status", singleData?.status)
    setFieldValue("featured_image", singleData?.featured_image)
    setFieldValue("gallery_image", singleData?.gallery_image?.map((item) => item))
    setFieldValue("short_desc", singleData?.short_desc)
    setFieldValue("description", singleData?.description)
    setFieldValue("rim_details", singleData?.rim_details)
    setFieldValue("material", singleData?.material)
    setFieldValue("warranty", singleData?.warranty)
    setFieldValue("country_origin", singleData?.country_origin)
    setFieldValue("meta_title", singleData?.meta_title)
    setFieldValue("meta_description", singleData?.meta_description)
    setFieldValue("meta_keywords", singleData?.meta_keywords)
    setFieldValue("og_tag", singleData?.og_tag)
    setFieldValue("schema_markup", singleData?.schema_markup)
    // setFieldValue("is_prescription", singleData?.is_prescription)
    // setFieldValue("is_blue_filter", singleData?.is_blue_filter)
    // setFieldValue("is_rx_compatible", singleData?.is_rx_compatible)
    setFieldValue("frame_type", singleData?.frame_type)
    setFieldValue("is_home_tryOn", singleData?.is_home_tryOn)
    setFieldValue("is_premium", singleData?.is_premium ?? false)
    setFieldValue(
      "tags",
      (() => {
        const t = singleData?.tags;
        if (!t) return [];
        if (typeof t === "string") return t.split(",").map((s) => s.trim()).filter(Boolean);
        if (Array.isArray(t)) {
          return t.map((item) =>
            typeof item === "object" && item !== null
              ? item?.slug || item?._id || item?.name || ""
              : item
          ).filter(Boolean);
        }
        return [];
      })()
    )

    setFeaturedImagePreview(singleData?.featured_image)
    setGalleryImagePreviews(singleData?.gallery_image?.map((item) => item))
  }, [isSuccess, singleData, setFieldValue])

  return (
    <>
      {
        (loadingAddData || isLoading) && <Loader />
      }
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Frame"
            active="View New Frame"
            items={["Home", "Frame List"]}
            links={["/dashboard", "/catalogue/frames"]}
          />
        </Col>
        <Col className="text-end">
          <Link to="/catalogue/frames" className="btn btn-success text-white me-3">
            View All Frame
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">View Frame</h3>
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
                        disabled
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
                        disabled
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
                        options={categoryOption}
                        name="category"
                        value={categoryOption?.find(option => option.value === values?.category)}
                        isDisabled
                        onChange={(selected) =>
                          setFieldValue("category", selected?.value || "")
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
                        isDisabled
                      />
                      {touched.brand && errors.brand && (
                        <div className="text-danger mt-1">{errors.brand}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                      <SelectWithDragDrop
                        options={typeOptions}
                        name="type"
                        value={typeOptions.find(option => option.value === values.type)}
                        onChange={(selected) => setFieldValue("type", selected?.value || "")}
                        onBlur={() => setFieldTouched("type", true)}
                        isDisabled
                      />
                      {touched.type && errors.type && (
                        <div className="text-danger mt-1">{errors.type}</div>
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
                        isDisabled
                      />
                      {touched.gender && errors.gender && (
                        <div className="text-danger mt-1">{errors.gender}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Frame Type <span className="text-danger">*</span></Form.Label>
                      <SelectWithDragDrop
                        options={frameTypeOptions}
                        name="frame_type"
                        value={frameTypeOptions.find(option => option.value === values.frame_type)}
                        onChange={(selected) => setFieldValue("frame_type", selected?.value || "")}
                        onBlur={() => setFieldTouched("frame_type", true)}
                        isDisabled
                      />
                      {touched.frame_type && errors.frame_type && (
                        <div className="text-danger mt-1">{errors.frame_type}</div>
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
                        isDisabled
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
                        value={(values?.tags || []).map((tag) => {
                          const opt = tagOptions?.find((o) => o.value === tag);
                          return opt || { value: tag, label: tag };
                        })}
                        isDisabled
                        placeholder="No tags selected"
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
                        disabled
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
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Home Try On Status</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label={''}
                        name="is_home_tryOn"
                        value={values?.is_home_tryOn}
                        checked={values?.is_home_tryOn}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Premium product</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label={''}
                        name="is_premium"
                        checked={!!values?.is_premium}
                        disabled
                      />
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
                        disabled
                      />
                      <Row className="mt-2 d-flex flex-wrap gap-2">
                        {Array.isArray(galleryImagePreviews) && galleryImagePreviews?.length > 0 && galleryImagePreviews?.map((preview, index) => (
                          <Col as={Col} md={2} key={index} className="position-relative" style={{ width: "100px" }} >
                            <img
                              src={preview.url || preview}
                              alt={`Gallery Preview ${index}`}
                              className="img-fluid"
                              style={{ width: "100%", height: "100%" }}
                            />
                            <div className="position-absolute" style={{ top: "5px", right: "10px", backgroundColor: "#0e0e0e99", margin: "3px", borderRadius: "30px" }}>
                              <FaEye
                                className="me-2 text-light"
                                style={{ cursor: "pointer" }}
                                onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: preview.url || preview }))}
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
                        disable
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
                        disable
                      />
                      {touched.description && errors.description && (
                        <div className="text-danger mt-1">{errors.description}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rim Details</Form.Label>
                      <Form.Control
                        type="text"
                        name="rim_details"
                        value={values.rim_details}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
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
                        isDisabled
                      />
                      {touched.material && errors.material && (
                        <div className="text-danger mt-1">{errors.material}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Warranty</Form.Label>
                      <Form.Control
                        type="text"
                        name="warranty"
                        value={values.warranty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
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
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  {/* <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rx Compatible</Form.Label>
                      <Form.Select
                        type="text"
                        name="is_rx_compatible"
                        value={values.is_rx_compatible}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col> */}
                  {/* <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prescription Required</Form.Label>
                      <Form.Select
                        type="text"
                        name="is_prescription"
                        value={values.is_prescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      >
                        <option value={true}>Required</option>
                        <option value={false}>Not Required</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>is BlueRay</Form.Label>
                      <Form.Select
                        type="text"
                        name="is_blue_filter"
                        value={values.is_blue_filter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col> */}
                </Row>
                <Row>
                  <SeoForm
                    handleChange={handleChange}
                    values={values}
                    errors={errors}
                    handleBlur={handleBlur}
                    touched={touched}
                    readOnlyStatus={true}
                  />
                </Row>
                {/* <Row className="justify-content-center mt-3">
                  <Button type="submit" variant="primary" className="w-auto">
                    Submit
                  </Button>
                </Row> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}