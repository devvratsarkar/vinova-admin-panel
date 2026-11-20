import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAddCategoryMutation, useGetAllCategoryQuery, useGetAllCategorySelectQuery } from "../../../redux/features/CategoryAPIEndPoint";
import { AddNewCategorySchema } from "../../../commondata/formvalidations";
import Loader from "../../../layouts/layoutcomponents/loader";
import { openModal } from "../../../redux/slices/allModalSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import SelectWithDragDrop from "../../common/SelectWithDragDrop";
import SeoForm from "../../seo-page/SeoForm";

export default function AddNewCategoryForm({ lang }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refetch } = useGetAllCategoryQuery();
  const { data, refetch: parentCategory } = useGetAllCategorySelectQuery();
  const allSelectCategoryData = data?.data || [];
  const [addNewCategory, { isLoading }] = useAddCategoryMutation();
  const [imagePreviewMen, setImagePreviewMen] = useState(null);
  const [imagePreviewWomen, setImagePreviewWomen] = useState(null);
  const [imagePreviewKid, setImagePreviewKid] = useState(null);
  const [bannerOnePreview, setBannerOnePreview] = useState(null);
  const [bannerTwoPreview, setBannerTwoPreview] = useState(null);
  const [megaMenuImagePreview, setMegaMenuImagePreview] = useState(null);

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
    meta_title: "",
    meta_description: "",
    lang: lang,
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
    product_type: "Frame",
    banner_one: "",
    banner_two: "",
    status: true,
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCategorySchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "type") {
          value.forEach((type) => {
            formData.append("type", type);
          });
        } else {
          formData.append(key, value);
        }
      });

      try {
        const response = await addNewCategory(formData);
        if (response?.data?.http_status_code === 201) {
          refetch();
          parentCategory();
          navigate("/catalogue/category/");
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const categoryOptions = Array.isArray(allSelectCategoryData) && allSelectCategoryData?.length > 0
    ? allSelectCategoryData?.map((item) => ({
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

  // const generateSlug = (value) => {
  //   const slug = slugify(value, { lower: true });
  //   setFieldValue("slug", slug);
  // };

  const generateSlug = (value) => {

    // ✅ Keep Arabic, Persian, Urdu, etc. characters intact
    const slug = value
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[.,/#!$%^&*;:{}=\_`~()؟،]/g, "")
      .toLowerCase();

    setFieldValue("slug", slug);
  };


  const handleCategoryNameChange = (event) => {
    const productName = event.target.value;
    setFieldValue("category_name", productName)
    generateSlug(productName);
  };

  const handleImageChangeMen = (e) => {
    const file = e.target.files[0];
    setFieldValue("featured_image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewMen(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewMen(null);
    }
  };

  const handleImageChangeWomen = (e) => {
    const file = e.target.files[0];
    setFieldValue("featured_image_women", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewWomen(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewWomen(null);
    }
  };

  const handleImageChangeKid = (e) => {
    const file = e.target.files[0];
    setFieldValue("featured_image_kid", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewKid(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewKid(null);
    }
  };

  const handleMegaMenuImageChange = (e) => {
    const file = e.target.files[0];
    setFieldValue("mega_menu_image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMegaMenuImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMegaMenuImagePreview(null);
    }
  };

  const handleMegaMenuToggle = (e) => {
    handleChange(e);
    if (!e.target.checked) {
      setFieldValue("mega_menu_image", "");
      setMegaMenuImagePreview(null);
    }
  };

  const handleBannerOneChange = (e) => {
    const file = e.target.files[0];
    setFieldValue("banner_one", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerOnePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerOnePreview(null);
    }
  };

  const handleBannerTwoChange = (e) => {
    const file = e.target.files[0];
    setFieldValue("banner_two", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerTwoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerTwoPreview(null);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add Category</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
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
                      onChange={handleCategoryNameChange}
                      onBlur={handleBlur}
                      value={values.category_name}
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
                    />
                    {errors.type && touched.type ? <p className="text-danger">{errors.type}</p> : ""}
                  </Form.Group>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Status <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select name="status" value={values.status} onChange={handleChange} onBlur={handleBlur}>
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
                        onChange={handleImageChangeMen}
                        onBlur={handleBlur}
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
                            type="button"
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
                        onChange={handleImageChangeWomen}
                        onBlur={handleBlur}
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
                            type="button"
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
                        onChange={handleImageChangeKid}
                        onBlur={handleBlur}
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
                            type="button"
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
                      onChange={handleBannerOneChange}
                      onBlur={handleBlur}
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
                          type="button"
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
                      onChange={handleBannerTwoChange}
                      onBlur={handleBlur}
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
                          type="button"
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
                      value={values.description}
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
                      {errors.product_type && touched.product_type ? <p className="text-danger">{errors.product_type}</p> : ""}
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
                  <Col xs={12} className="d-flex flex-wrap align-items-center gap-4">
                    <Form.Check
                      type="checkbox"
                      id="is_mega_menu"
                      name="is_mega_menu"
                      label="Add To Mega Menu"
                      className="mb-0"
                      onChange={handleMegaMenuToggle}
                      onBlur={handleBlur}
                      checked={values.is_mega_menu}
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
                    />
                  </Col>
                </Row>
                {values.is_mega_menu && (
                  <Row className="mt-3">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Mega Menu Image (JPG,JPEG,PNG) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        name="mega_menu_image"
                        onChange={handleMegaMenuImageChange}
                        onBlur={handleBlur}
                      />
                      {errors.mega_menu_image && touched.mega_menu_image ? (
                        <p className="text-danger">{errors.mega_menu_image}</p>
                      ) : null}
                      {megaMenuImagePreview && (
                        <div className="image-preview mt-3 position-relative" style={{ maxWidth: "200px" }}>
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
                      )}
                    </Form.Group>
                  </Row>
                )}
                <Row className="mt-5">
                  <Button type="submit" className="btn-primary mx-auto w-auto submit_btn">Submit</Button>
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