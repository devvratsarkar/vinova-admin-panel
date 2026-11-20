import React, { useState } from "react";
import { useFormik } from "formik";
import { AddCustomFieldValueSchema } from "../../../commondata/formvalidations";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useAddCustomFieldValuesMutation, useGetAllCustomFieldValuesQuery } from "../../../redux/features/customFieldValueAPIEndPoint";
import { useGetAllFiltersQuery } from "../../../redux/features/FiltersAPIEndPoint";
import SelectWithDragDrop from "../../common/SelectWithDragDrop";

export default function AddCustumFieldValue() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const { refetch } = useGetAllCustomFieldValuesQuery(data?.data?.custom_field?._id);
  const { data: filtersResponse } = useGetAllFiltersQuery();
  const filterPayload = filtersResponse?.data;
  const filtersList = Array.isArray(filterPayload) ? filterPayload : Array.isArray(filterPayload?.data) ? filterPayload.data : [];
  const [addCustomFieldValues, { isLoading }] = useAddCustomFieldValuesMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const initialValues = {
    custom_id: data?.data?.custom_field?._id,
    attribute_type: "",
    attribute_name: "",
    list_order: "",
    color: "",
    shape_image: "",
    filter_id: "",
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: AddCustomFieldValueSchema,
    onSubmit: async (values) => {
      try {
        if (!values.color) {
          values.color = null;
        }
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await addCustomFieldValues(formData);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message);
          refetch();
          dispatch(closeModal());
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error?.message);
      }
    },
  });

  const isSelectType =
    data?.data?.custom_field?.attribute_type === "Select" ||
    data?.data?.custom_field?.attribute_type === "select";
  const filterOptions = filtersList
    .filter((f) => f?.deletedAt == null)
    .map((filter) => ({ value: filter._id, label: filter.name }));
  const selectedFilterOption =
    filterOptions?.find((opt) => opt.value === values.filter_id) || null;
  const handleFilterChange = (selected) => {
    setFieldValue("filter_id", selected?.value ?? "");
    setFieldValue("attribute_name", selected?.label ?? "");
  };

  const colorField = () => {
    const handleColorChange = (e) => {
      const color = e.target.value;
      setFieldValue("color", color);
    };

    const handleColorCodeChange = (e) => {
      const colorCode = e.target.value;
      setFieldValue("color", colorCode);
    };

    const handleImageChange = (event) => {
      const file = event.currentTarget.files[0];
      setFieldValue("shape_image", file);
      // Generate and set the image preview URL
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    };

    if (data?.data?.custom_field.attribute_type === "Color" || data?.data?.custom_field.attribute_type === "color") {
      return (
        <Form.Group controlId="formBasicColorPicker" className="mb-3">
          <Form.Label>Color</Form.Label>
          <Row className="color_code_input">
            <Form.Control
              type="text"
              name="color"
              value={values.color}
              onChange={handleColorCodeChange}
              onBlur={handleBlur}
              placeholder="Enter color hex code"
              disabled
            />
            <Form.Control
              type="color"
              name="color"
              value={values.color}
              onChange={handleColorChange}
              onBlur={handleBlur}
            />
          </Row>
        </Form.Group>
      );
    } else if (data?.data?.custom_field.attribute_type === "Shape" || data?.data?.custom_field.attribute_type === "shape") {
      return (
        <Form.Group controlId="formBasicShapeImage" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Row className="color_code_input">
            <Form.Control
              type="file"
              name="shape_image"
              onChange={handleImageChange}
              onBlur={handleBlur}
              accept="image/*"
            />
          </Row>
          <Row>
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                />
              </div>
            )}
          </Row>
        </Form.Group>
      );
    }
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Add Custom Field Value
          </Modal.Title>
        </Modal.Header>
        <Button
          onClick={() => dispatch(closeModal())}
          className="btn-close position-absolute end-0 p-3"
          variant=""
        >
          <i className="fe fe-x fw-bolder"></i>
        </Button>
        <Modal.Body className="p-2">
          {isLoading && <Loader />}
          <Form onSubmit={handleSubmit} className="border rounded-2 p-2 overflow-hidden">
            <Row className="border-bottom pb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Attribute Value <span className="required_icon">*</span>
                </Form.Label>
                {isSelectType ? (
                  <>
                    <SelectWithDragDrop
                      options={filterOptions || []}
                      value={selectedFilterOption}
                      onChange={handleFilterChange}
                      onBlur={() => setFieldTouched("filter_id", true)}
                      placeholder="Select Lens Type"
                      isSearchable
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                    {(errors.filter_id && touched.filter_id) || (errors.attribute_name && touched.attribute_name) ? (
                      <p className="error">{errors.filter_id || errors.attribute_name}</p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Form.Control
                      type="text"
                      name="attribute_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.attribute_name}
                    />
                    {errors.attribute_name && touched.attribute_name ? (
                      <p className="error">{errors.attribute_name}</p>
                    ) : null}
                  </>
                )}
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>
                  List Order <span className="required_icon">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="list_order"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.list_order}
                  min={0}
                />
                {errors.list_order && touched.list_order ? (
                  <p className={`error`}>{errors.list_order}</p>
                ) : null}
              </Form.Group>
            </Row>
            <Row>{colorField()}</Row>
            <Row className="mx-1">
              <Button type="submit" className="btn-primary ms-auto w-auto">
                Save
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}