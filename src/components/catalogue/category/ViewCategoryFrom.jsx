import React, { useEffect, useState, useMemo } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from "react-router-dom";
import SeoForm from "../../seo-page/SeoForm";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import SelectWithDragDrop from "../../common/SelectWithDragDrop";
import slugify from "slugify";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import { useGetAllCategoryQuery, useGetAllCategorySelectQuery, useGetSingleCategoryQuery, useUpdateCategoryMutation } from "../../../redux/features/CategoryAPIEndPoint";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import { AddNewCategorySchema } from "../../../commondata/formvalidations";

export default function ViewCategoryFrom({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imagePreviewMen, setImagePreviewMen] = useState(null);
  const [imagePreviewWomen, setImagePreviewWomen] = useState(null);
  const [imagePreviewKid, setImagePreviewKid] = useState(null);
  const [bannerOnePreview, setBannerOnePreview] = useState(null);
  const [bannerTwoPreview, setBannerTwoPreview] = useState(null);
  const [megaMenuImagePreview, setMegaMenuImagePreview] = useState(null);

  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetSingleCategoryQuery(id, { skip: !id });
  const categoryData = useMemo(() => data?.data || {}, [data]);

  const { data: selectData, refetch: parentCategory } = useGetAllCategorySelectQuery();
  const allSelectCategoryData = selectData?.data || [];
  const { refetch } = useGetAllCategoryQuery();
  const [editBrand, { isLoading: loadingUpdateData }] = useUpdateCategoryMutation();

  const typeOptions = [
    { label: "Men", value: "Men" },
    { label: "Women", value: "Women" },
    { label: "Kid", value: "Kid" },
  ];

  const initialValues = {
    category_name: "",
    slug: "",
    type: [],
    featured_image: "",
    featured_image_women: "",
    featured_image_kid: "",
    description: "",
    parent_category: null,
    is_mega_menu: false,
    is_footer_menu: false,
    mega_menu_image: "",
    lang: lang,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
    product_type: "Frame",
    status: true,
    banner_one: "",
    banner_two: "",
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues,
    validationSchema: AddNewCategorySchema,
    onSubmit: async (values) => {
      console.log("values", values);
      // Form submission is not needed for view-only form
    },
  });

  const categoryOptions = Array.isArray(allSelectCategoryData) && allSelectCategoryData.length > 0
    ? allSelectCategoryData.map((item) => ({
      label: item?.category_name,
      value: item._id,
    }))
    : [];

  const productTypeOption = [
    { label: "Frame", value: "Frame" },
    { label: "Contact Lens", value: "Contact Lens" },
    { label: "Sunglasses", value: "Sunglasses" },
  ];

  const handleScrollToError = async () => {
    const formErrors = await validateForm();
    const errorFields = Object.keys(formErrors);
    if (errorFields.length > 0) {
      const errorElement = document.getElementsByName(errorFields[0])[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth" });
        errorElement.focus();
      }
    }
  };

  useEffect(() => {
    if (categoryData) {
      setFieldValue("category_name", categoryData?.category_name || "");
      setFieldValue("status", categoryData?.status ?? true);
      setFieldValue("slug", categoryData?.slug || "");
      setFieldValue("parent_category", categoryData?.parent_category?._id || null);
      setFieldValue("is_mega_menu", categoryData?.is_mega_menu ?? false);
      setFieldValue("is_footer_menu", categoryData?.is_footer_menu ?? false);
      setFieldValue("mega_menu_image", categoryData?.mega_menu_image || "");
      setFieldValue("meta_title", categoryData?.meta_title || "");
      setFieldValue("meta_description", categoryData?.meta_description || "");
      setFieldValue("meta_keywords", categoryData?.meta_keywords || "");
      setFieldValue("og_tag", categoryData?.og_tag || "");
      setFieldValue("schema_markup", categoryData?.schema_markup || "");
      setFieldValue("featured_image", categoryData?.featured_image || "");
      setFieldValue("featured_image_women", categoryData?.featured_image_women || "");
      setFieldValue("featured_image_kid", categoryData?.featured_image_kid || "");
      setFieldValue("banner_one", categoryData?.banner_one || "");
      setFieldValue("banner_two", categoryData?.banner_two || "");
      setFieldValue("description", categoryData?.description || "");
      setFieldValue("product_type", categoryData?.product_type || "Frame");
      setFieldValue("type", Array.isArray(categoryData?.type) ? categoryData?.type : []);
      setImagePreviewMen(categoryData?.featured_image || null);
      setImagePreviewWomen(categoryData?.featured_image_women || null);
      setImagePreviewKid(categoryData?.featured_image_kid || null);
      setBannerOnePreview(categoryData?.banner_one || null);
      setBannerTwoPreview(categoryData?.banner_two || null);
      setMegaMenuImagePreview(categoryData?.mega_menu_image || null);
    }
  }, [categoryData, isSuccess, setFieldValue]);

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }
  if (isSuccess) {
    return (
      <>
        {(isLoading || loadingUpdateData) && <Loader />}
        {/* <Row className="align-items-center">
          <Col>
            <PageHeader titles="View Category" active="View Category" items={["Home", "Category List"]} links={["/dashboard", "/catalogue/category/"]} />
          </Col>
        </Row> */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h3 className="card-title">View Category</h3>
              </Card.Header>
              <Card.Body className="edit_product">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                    handleScrollToError();
                  }}
                  className="add_category_form"
                >
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Category Name <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="category_name"
                        // onChange={handleCategoryNameChange}
                        onBlur={handleBlur}
                        value={values.category_name}
                        readOnly
                      />
                      {errors.category_name && touched.category_name ? (
                        <p className={`error`}>{errors.category_name}</p>
                      ) : null}
                    </Form.Group>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Slug <span className="required_icon">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="slug"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.slug}
                          readOnly
                        />
                        {errors.slug && touched.slug ? <p className={`error`}>{errors.slug}</p> : null}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Type <span className="text-danger">*</span>
                      </Form.Label>
                      <SelectWithDragDrop
                        isMulti
                        options={typeOptions}
                        value={values.type.map(id => typeOptions.find(opt => opt.value === id)).filter(Boolean)}
                        name="type"
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                          setFieldValue("type", selectedValues);
                        }}
                        onBlur={() => setFieldTouched("type", true)}
                        isDisabled
                      />
                      {errors.type && touched.type ? <p className="text-danger">{errors.type}</p> : ""}
                    </Form.Group>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Status <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select name="status" value={values.status} onChange={handleChange} onBlur={handleBlur} disabled>
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </Form.Select>
                        {errors.status && touched.status ? <p className={`error`}>{errors.status}</p> : null}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    {values.type.includes("Men") && (
                      <Form.Group as={Col} md="6">
                        <Form.Label>
                          Featured Image Men (JPG,JPEG,PNG) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          name="featured_image"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                        {errors.featured_image && touched.featured_image ? (
                          <p className="text-danger">{errors.featured_image}</p>
                        ) : null}
                        {imagePreviewMen && (
                          <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
                            <img
                              src={imagePreviewMen}
                              alt="Preview Men"
                              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                            />
                            <Button
                              variant="light"
                              className="position-absolute"
                              style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                              onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: imagePreviewMen }))}
                            >
                              <i className="fe fe-eye"></i>
                            </Button>
                          </div>
                        )}
                      </Form.Group>
                    )}
                    {values.type.includes("Women") && (
                      <Form.Group as={Col} md="6">
                        <Form.Label>
                          Featured Image Women (JPG,JPEG,PNG) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          name="featured_image_women"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                        {errors.featured_image_women && touched.featured_image_women ? (
                          <p className="text-danger">{errors.featured_image_women}</p>
                        ) : null}
                        {imagePreviewWomen && (
                          <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
                            <img
                              src={imagePreviewWomen}
                              alt="Preview Women"
                              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                            />
                            <Button
                              variant="light"
                              className="position-absolute"
                              style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                              onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: imagePreviewWomen }))}
                            >
                              <i className="fe fe-eye"></i>
                            </Button>
                          </div>
                        )}
                      </Form.Group>
                    )}
                    {values.type.includes("Kid") && (
                      <Form.Group as={Col} md="6">
                        <Form.Label>
                          Featured Image Kid (JPG,JPEG,PNG) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          name="featured_image_kid"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                        {errors.featured_image_kid && touched.featured_image_kid ? (
                          <p className="text-danger">{errors.featured_image_kid}</p>
                        ) : null}
                        {imagePreviewKid && (
                          <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
                            <img
                              src={imagePreviewKid}
                              alt="Preview Kid"
                              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                            />
                            <Button
                              variant="light"
                              className="position-absolute"
                              style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                              onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: imagePreviewKid }))}
                            >
                              <i className="fe fe-eye"></i>
                            </Button>
                          </div>
                        )}
                      </Form.Group>
                    )}
                  </Row>

                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Banner One (JPG,JPEG,PNG) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        name="banner_one"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
                      {errors.banner_one && touched.banner_one ? (
                        <p className="text-danger">{errors.banner_one}</p>
                      ) : null}
                      {bannerOnePreview && (
                        <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
                          <img
                            src={bannerOnePreview}
                            alt="Preview"
                            style={{ width: "100px", height: "100px", borderRadius: "8px" }}
                          />
                          <Button
                            variant="light"
                            className="position-absolute"
                            style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                            onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: bannerOnePreview }))}
                          >
                            <i className="fe fe-eye"></i>
                          </Button>
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Banner Two (JPG,JPEG,PNG) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        name="banner_two"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
                      {errors.banner_two && touched.banner_two ? (
                        <p className="text-danger">{errors.banner_two}</p>
                      ) : null}
                      {bannerTwoPreview && (
                        <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
                          <img
                            src={bannerTwoPreview}
                            alt="Preview"
                            style={{ width: "100px", height: "100px", borderRadius: "8px" }}
                          />
                          <Button
                            variant="light"
                            className="position-absolute"
                            style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                            onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: bannerTwoPreview }))}
                          >
                            <i className="fe fe-eye"></i>
                          </Button>
                        </div>
                      )}
                    </Form.Group>
                  </Row>

                  <Row className="mb-4">
                    <Form.Group as={Col}>
                      <Form.Label>Category Description</Form.Label>
                      <SunEditor
                        name="description"
                        onChange={(content) => setFieldValue("description", content)}
                        onBlur={() => setFieldTouched("description", true)}
                        setOptions={options_for_sunEditor}
                        setContents={values.description}
                        disable
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Parent Category</Form.Label>
                        <SelectWithDragDrop
                          options={categoryOptions}
                          value={categoryOptions.find((option) => option.value === values.parent_category) || null}
                          name="parent_category"
                          isDisabled
                          onChange={(selectedOption) => {
                            handleChange({
                              target: {
                                name: "parent_category",
                                value: selectedOption ? selectedOption.value : "",
                              },
                            });
                          }}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Product Type <span className="text-danger">*</span>
                        </Form.Label>
                        <SelectWithDragDrop
                          options={productTypeOption}
                          value={productTypeOption.find((option) => option.value === values.product_type) || null}
                          name="product_type"
                          isDisabled
                          onChange={(selectedOption) => {
                            handleChange({
                              target: {
                                name: "product_type",
                                value: selectedOption ? selectedOption.value : "",
                              },
                            });
                          }}
                          onBlur={handleBlur}
                        />
                        {errors.product_type && touched.product_type ? <p className="text-danger">{errors.product_type}</p> : null}
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
                      readOnlyStatus={true}
                    />
                  </Row>
                  <Row className="mt-4">
                    <Col xs={12} className="d-flex flex-wrap align-items-center gap-4">
                      <Form.Check
                        type="checkbox"
                        id="is_mega_menu"
                        name="is_mega_menu"
                        label="Add To Mega Menu"
                        className="mb-0"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.is_mega_menu}
                        disabled
                      />
                      <Form.Check
                        type="checkbox"
                        id="is_footer_menu"
                        name="is_footer_menu"
                        label="Add To Footer Menu"
                        className="mb-0"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.is_footer_menu}
                        disabled
                      />
                    </Col>
                  </Row>
                  {values.is_mega_menu && (
                    <Row className="mt-3">
                      <Form.Group as={Col} md="6">
                        <Form.Label>Mega Menu Image</Form.Label>
                        {megaMenuImagePreview ? (
                          <div className="image-preview mt-2 position-relative" style={{ maxWidth: "200px" }}>
                            <img
                              src={megaMenuImagePreview}
                              alt="Mega Menu Preview"
                              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                            />
                            <Button
                              variant="light"
                              type="button"
                              className="position-absolute"
                              style={{ top: "10px", right: "10px", borderRadius: "50%", padding: "8px" }}
                              onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: megaMenuImagePreview }))}
                            >
                              <i className="fe fe-eye"></i>
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted mb-0">No image uploaded</p>
                        )}
                      </Form.Group>
                    </Row>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
