import React from 'react'
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import ImageFileInput from "../../common/ImageFileInput";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useAddNewCarrierMutation, useGetAllCarrierQuery } from "../../../redux/features/shippingZoneEndPoints";
import { useFormik } from "formik";
import { AddNewCarrierSchema } from "../../../commondata/formvalidations";
import toast from "react-hot-toast";
import Loader from '../../../layouts/layoutcomponents/loader';


export default function AddNewCarrier() {
  const navigate = useNavigate()

  const [addNewCarrier, { isLoading }] = useAddNewCarrierMutation()
  const { refetch } = useGetAllCarrierQuery()

  const initialValues = {
    name: "",
    tracking_url: "",
    phone: "",
    email: "",
    logo: "",
    status: true,
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCarrierSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await addNewCarrier(formData);
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          navigate(`/shipping/carrier`)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Shipping-Carrier" active="Add New Carrier" items={["Home", "Carrier List"]} links={["/dashboard", "/shipping/carrier"]} />
        </Col>
        <Col className="text-end">
          <Link to="/shipping/carrier" className="btn btn-success text-white me-3" > View All Carriers </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add Carrier</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
              <Form onSubmit={handleSubmit} className="add_category_form">
                {isLoading && <Loader />}
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Name <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    {errors.name && touched.name ? (
                      <p className={`error`}>{errors.name}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Tracking Url <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="url"
                      name="tracking_url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tracking_url}
                    />
                    {errors.tracking_url && touched.tracking_url ? (
                      <p className={`error`}>{errors.tracking_url}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Phone <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    {errors.phone && touched.phone ? (
                      <p className={`error`}>{errors.phone}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Email <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <p className={`error`}>{errors.email}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Col md={6}>
                    <ImageFileInput
                      label="Logo Only (JPG,JPEG,PNG, 2mb Size)"
                      name="logo"
                      onChange={(e) => setFieldValue('logo', e.target.files?.[0])}
                      onBlur={handleBlur}
                      accept=".jpg,.jpeg,.png,.webp"
                      error={errors.logo}
                      touched={touched.logo}
                    />
                  </Col>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Status</Form.Label>
                    <Form.Group>
                      <label className="custom-switch">
                        <input
                          type="checkbox"
                          name="status"
                          className="custom-switch-input"
                          checked={values.status}
                          onChange={(e) => {
                            setFieldValue("status", e.target.checked);
                          }}
                        />
                        <span className="custom-switch-indicator custum-green-btn"></span>
                      </label>
                    </Form.Group>
                    {errors.status && touched.status ? (
                      <p className={`error`}>{errors.status}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Button type="submit" className="btn-primary mx-auto w-auto">
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

