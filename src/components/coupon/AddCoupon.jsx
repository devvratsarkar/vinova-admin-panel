import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateCouponMutation, useGetAllCouponsQuery } from "../../redux/features/couponAPIEndPoint";
import { useGetAllCategorySelectQuery } from "../../redux/features/CategoryAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import SelectWithDragDrop from "../common/SelectWithDragDrop"
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { couponValidationSchema } from "../../commondata/formvalidations";

export default function AddCoupon() {
  const navigate = useNavigate()

  const initialValues = {
    coupon_code: "",
    coupon_type: "",
    value: 0,
    no_coupon: "",
    expiry_date: "",
    minimum_cart_value: "",
    status: true,
    description: "",
    category: [],
  };

  const [addNewCoupon, { isLoading }] = useCreateCouponMutation()
  const { refetch } = useGetAllCouponsQuery()

  const { data: categoriesData, isLoading: categoriesDataLoading } = useGetAllCategorySelectQuery()
  const activeCategory = categoriesData?.data || [];
  const searchCategoryOptions = Array.isArray(activeCategory) && activeCategory?.length > 0 ? activeCategory?.map((item) => ({
    value: item._id,
    label: item.category_name,
  })) : []




  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: couponValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await addNewCoupon(values);
        if (response?.data?.http_status_code === 201) {
          refetch()
          toast.success(response.data.message)
          navigate("/coupons")
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error(error);
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

  return (
    <>
      {
        (categoriesDataLoading || isLoading) && <Loader />
      }
      <Row>
        <Col as={Col} sm={8} xs={12}>
          <PageHeader titles="Coupon" active="Add New Coupon" items={["Home", "Coupon List"]} links={["/dashboard", "/coupons"]} />
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <Link className="btn btn-success text-white me-3" to={"/coupon"}>
            View All Coupons
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add New Coupon</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                  handleScrollToError();
                }}
              >
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Coupon Code <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="coupon_code"
                      onChange={(e) => {
                        const sanitized = e.target.value.toUpperCase();
                        setFieldValue("coupon_code", sanitized);
                        setFieldTouched("coupon_code", true, false);
                      }}
                      onBlur={handleBlur}
                      value={values.coupon_code}
                      maxLength={8}
                      placeholder="e.g. SAVE20"
                      style={{ textTransform: "uppercase" }}
                    />
                    {errors.coupon_code && touched.coupon_code ? (
                      <p className={`error`}>{errors.coupon_code}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Coupon Type <span className="required_icon">*</span>
                    </Form.Label>
                    <SelectWithDragDrop
                      name="coupon_type"
                      options={[
                        { value: "fixed", label: "Fixed" },
                        { value: "percentage", label: "Percentage" },
                      ]}
                      isSearchable
                      onChange={(selectedOption) => setFieldValue("coupon_type", selectedOption.value)}
                      onBlur={handleBlur}
                      value={
                        [
                          { value: "fixed", label: "Fixed" },
                          { value: "percentage", label: "Percentage" },
                        ].find(option => option.value === values.coupon_type) || null
                      }
                    />
                    {errors.coupon_type && touched.coupon_type ? (
                      <p className="error">{errors.coupon_type}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Label>Value($)<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      name="value"
                      value={values.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Category</Form.Label>
                    <SelectWithDragDrop
                      name="category"
                      value={(values.category ?? []).map(id => searchCategoryOptions.find(opt => opt.value === id)).filter(Boolean) || []}
                      options={searchCategoryOptions}
                      isMulti
                      isSearchable
                      placeholder="Select Categories"
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                        setFieldValue('category', selectedValues);
                      }}
                      onBlur={handleBlur}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: '200px',
                          overflowY: 'auto'
                        })
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      No Of Coupons <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="no_coupon"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.no_coupon}
                    />
                    {errors.no_coupon && touched.no_coupon ? (
                      <p className={`error`}>{errors.no_coupon}</p>
                    ) : null}
                  </Form.Group>

                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Expiry Date <span className="required_icon">*</span>
                    </Form.Label>
                    <div className="wd-200 mg-b-30">
                      <input
                        type="datetime-local"
                        className="form-control fc-datepicker"
                        placeholder="MM/DD/YYYY"
                        name="expiry_date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.expiry_date}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.expiry_date && touched.expiry_date ? (
                      <p className={`error`}>{errors.expiry_date}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Minimum Cart Value($)<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="minimum_cart_value"
                      value={values.minimum_cart_value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.minimum_cart_value && touched.minimum_cart_value ? (
                      <p className="error"> {errors.minimum_cart_value}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <textarea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border border-black-3 rounded-3 w-100"
                        rows={5}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="w-100 justify-content-center mt-5">
                  <Button type="submit" className="w-auto">
                    Save
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}