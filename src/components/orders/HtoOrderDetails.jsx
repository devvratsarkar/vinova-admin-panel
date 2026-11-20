import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Button, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import HtoOrderDetailsData from "./HtoOrderDetailsData";
import CustomerDetails from "./CustomerDetails";
import { useGetHtoOrderQuery, useUpdateHtoOrderStatusMutation } from "../../redux/features/ordersAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { hasPermission } from "../../commondata/permissions";

export default function HtoOrderDetails() {
  const { id } = useParams();
  const { data, isLoading: loading, isFetching } = useGetHtoOrderQuery(id);
  const singleOrder = data?.data || [];
  const [updateStatus, { isLoading }] = useUpdateHtoOrderStatusMutation();

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const showOrderEdit = hasPermission(role, permissions, "HtoOrder", "edit");

  const initialValues = {
    status: singleOrder?.status || "",
    remarks: singleOrder?.remarks || "",
  };
  const formikStatus = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.lazy(() => {
      if (
        formikStatus.values.status === "pending" ||
        formikStatus.values.status === "dispatched" ||
        formikStatus.values.status === "delivered" ||
        formikStatus.values.status === "accepted" ||
        formikStatus.values.status === "processed" ||
        formikStatus.values.status === "packed"
      ) {
        return Yup.object().shape({
          status: Yup.string().required("This field is required."),
        });
      } else {
        return Yup.object().shape({
          status: Yup.string().required("This field is required."),
          remarks: Yup.string().required("This field is required."),
        });
      }
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await updateStatus({ orderBody: values, orderId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response?.data?.message);
          navigate("/hto-orders");
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.error("Failed to update HTO order status:", error);
      }
    },
  });

  const [orderHistory, setOrderHistory] = useState(false);
  const [orderSections, setOrderSections] = useState([
    { value: "Order Action", order: 1 },
    { value: "Order History", order: 2 },
    { value: "Customer Details", order: 3 },
  ]);

  useEffect(() => {
    const savedOrderSections = localStorage.getItem("htoOrderSections");
    if (savedOrderSections) {
      setOrderSections(JSON.parse(savedOrderSections));
    }
  }, []);

  const handleSectionOrderChange = (index, direction) => {
    const newOrderSections = [...orderSections];
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < newOrderSections.length) {
      const temp = newOrderSections[newIndex];
      newOrderSections[newIndex] = newOrderSections[index];
      newOrderSections[index] = temp;
      setOrderSections(newOrderSections);
      localStorage.setItem("htoOrderSections", JSON.stringify(newOrderSections));
    }
  };

  return (
    <>
      {(loading || isLoading || isFetching) && <Loader />}
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="HTO Orders"
                active="HTO Order Details"
                items={["Home", "HTO Orders"]}
                links={["/dashboard", "/hto-orders"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Form onSubmit={formikStatus.handleSubmit}>
        <Row>
          <Col as={Col} xl={8} lg={7} md={12} sm={12} xs={12}>
            <HtoOrderDetailsData singleOrder={singleOrder} showOrderEdit={showOrderEdit} formik={formikStatus} />
          </Col>
          <Col as={Col} xl={4} lg={5} md={12} sm={12} xs={12}>
            {orderSections.map((section, index) => (
              <div key={index}>
                {section.value === "Order Action" && (
                  <div className="order_details_row">
                    {showOrderEdit && (
                      <Dropdown className="btn-group mb-2">
                        <Dropdown.Toggle
                          type="button"
                          className="btn custom_border_color dropdown-toggle bg-white custom_dropdown"
                          variant=""
                          title="Action"
                        >
                          {section.value}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100">
                          <Dropdown.Item>
                            <Link
                              to={`/notification/add-notification`}
                              state={{ order_data: singleOrder }}
                            >
                              Resend Order Notification
                            </Link>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    <div className="order_details_keys">
                      <i className="fa fa-angle-up" onClick={() => handleSectionOrderChange(index, -1)}></i>
                      <i className="fa fa-angle-down" onClick={() => handleSectionOrderChange(index, 1)}></i>
                    </div>
                  </div>
                )}
                {section.value === "Order History" && (
                  <div className="order_details_row">
                    <Button
                      className="btn btn-outline-default custom_border_color bg-white w-100 mb-2 text-start"
                      variant=""
                      onClick={() => setOrderHistory(!orderHistory)}
                    >
                      {section.value}
                    </Button>
                    <div className="order_details_keys">
                      <i className="fa fa-angle-up" onClick={() => handleSectionOrderChange(index, -1)}></i>
                      <i className="fa fa-angle-down" onClick={() => handleSectionOrderChange(index, 1)}></i>
                    </div>
                    {orderHistory && (
                      <Card>
                        <Card.Header>Order History</Card.Header>
                        <Card.Body className="p-4">
                          {singleOrder?.orderStatusHistory?.length > 0 ? (
                            singleOrder.orderStatusHistory.map((item, index) => (
                              <Row className="mb-3" key={index}>
                                <Col as={Col} className="order_history mx-3">
                                  <p>{item?.message}</p>
                                </Col>
                                <Row className="mt-1 g-2 px-3">
                                  <Col
                                    as={Col}
                                    xs={12}
                                    sm={7}
                                    md={4}
                                    lg={9}
                                    className="order_history_author_text"
                                  >
                                    <p>{item?.createdBy ? `(${item?.createdBy?.name})` : ""}</p>
                                    <p>{item?.createdAt}</p>
                                  </Col>
                                </Row>
                              </Row>
                            ))
                          ) : (
                            <p>No order status history available.</p>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </div>
                )}
                {section.value === "Customer Details" && (
                  <div className="order_details_row">
                    <CustomerDetails singleOrder={singleOrder} />
                    <div className="order_details_keys">
                      <i className="fa fa-angle-up" onClick={() => handleSectionOrderChange(index, -1)}></i>
                      <i className="fa fa-angle-down" onClick={() => handleSectionOrderChange(index, 1)}></i>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {showOrderEdit && (
              <Button
                type="submit"
                className="w-100 mb-4"
                disabled={formikStatus.values.status === singleOrder?.status}
              >
                Update
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
}
