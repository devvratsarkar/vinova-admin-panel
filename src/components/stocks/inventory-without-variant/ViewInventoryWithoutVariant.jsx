import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { AddInventoryWithoutVariantdatasValidation } from "../../../commondata/formvalidations";
import {
  useEditInventoryWithoutVariantMutation,
  useGetAllInventoryWithoutVariantQuery,
  useGetSingleInventoryWithoutVariantQuery,
} from "../../../redux/features/inventory";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";

export default function ViewInventoryWithoutVariant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [discount, setDiscount] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const [editInventoryWithoutVariant, { isLoading }] =
    useEditInventoryWithoutVariantMutation();
  const { refetch } = useGetAllInventoryWithoutVariantQuery();
  const { data, isError, error, isLoading: loading, isFetching, isSuccess } =
    useGetSingleInventoryWithoutVariantQuery(id);

  const singleData = data?.data;

  const initialValues = {
    sku: singleData?.sku || "",
    stock_quantity: singleData?.stock_quantity || "",
    mrp: singleData?.mrp || "",
    selling_price: singleData?.selling_price || "",
    discount_percent: singleData?.discount_percent?.toFixed(2) || "",
    isOutOfStock: singleData?.isOutOfStock || false,
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: AddInventoryWithoutVariantdatasValidation,
    // enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await editInventoryWithoutVariant({
          id,
          formData: values,
        });
        if (
          response?.data?.http_status_code === 201 ||
          response?.data?.http_status_code === 200
        ) {
          toast.success(response.data.message);
          refetch();
          navigate("/stocks/inventory-without-variant");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  // 🧮 Calculate Discount %
  const calculateDiscountPercentage = () => {
    const mrp = parseFloat(values.mrp);
    const offerPrice = parseFloat(values.selling_price);
    if (!isNaN(mrp) && !isNaN(offerPrice) && mrp > 0) {
      const difference = mrp - offerPrice;
      const discountPercentage = (difference * 100) / mrp;
      setFieldValue("discount_percent", Number(discountPercentage.toFixed(2)));
    } else {
      setFieldValue("discount_percent", "");
    }
  };

  // 🧮 Calculate Selling Price
  const calculateOfferPrice = () => {
    const mrp = parseFloat(values.mrp);
    const discountPrice = parseFloat(values.discount_percent);
    if (!isNaN(mrp) && !isNaN(discountPrice)) {
      const selling_price = mrp - (mrp * discountPrice) / 100;
      setFieldValue("selling_price", Number(selling_price.toFixed(2)));
    } else {
      setFieldValue("selling_price", "");
    }
  };

  // Set initial form values when API data arrives
  useEffect(() => {
    if (singleData && isSuccess) {
      setIsInitialized(true);
    }
  }, [singleData, isSuccess]);

  // 🔄 Sync selling_price → discount_percent (only after initialized)
  useEffect(() => {
    if (isInitialized && discount) {
      calculateDiscountPercentage();
    }
  }, [values.selling_price]);

  // 🔄 Sync mrp/discount_percent → selling_price (only after initialized)
  useEffect(() => {
    if (isInitialized && !discount) {
      calculateOfferPrice();
    }
  }, [values.mrp, values.discount_percent]);

  // Manual handlers
  const handleOfferPriceChange = (e) => {
    let inputValue = e.target.value;
    const mrp = parseFloat(values.mrp);
    setDiscount(true);
    if (parseFloat(inputValue) > mrp) inputValue = mrp;
    setFieldValue("selling_price", inputValue);
  };

  const handleDiscountChange = (e) => {
    let inputValue = e.target.value;
    setDiscount(false);
    if (parseFloat(inputValue) > 100) inputValue = "100";
    setFieldValue("discount_percent", inputValue);
  };
  
  useEffect(() => {
    if (singleData) {
      setFieldValue('sku', singleData?.sku || '');
      setFieldValue('stock_quantity', singleData?.stock_quantity || '');
      setFieldValue('mrp', singleData?.mrp || '');
      setFieldValue('selling_price', singleData?.selling_price || '');
      setFieldValue('isOutOfStock', singleData?.isOutOfStock || false);
    }
  }, [singleData, isSuccess]);

  if (isError) return <Error error_mes={error} />;

  return (
    <>
      <PageHeader
        titles="Stocks-Inventory"
        active={["View Inventory"]}
        items={["Home", "Inventory Without Variant List"]}
        links={["/dashboard", "/stocks/inventory-without-variant"]}
      />
      <Row>
        <Col>
          <Card>
            <Card.Body className="p-4">
              {(isLoading || loading || isFetching) && <Loader />}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>SKU</Form.Label>
                    <Form.Control
                      type="text"
                      name="sku"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.sku}
                      readOnly
                    />
                    {errors.sku && touched.sku && (
                      <p className="error">{errors.sku}</p>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Stock Quantity <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="stock_quantity"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.stock_quantity}
                      readOnly
                    />
                    {errors.stock_quantity && touched.stock_quantity && (
                      <p className="error">{errors.stock_quantity}</p>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} md="4">
                    <Form.Label>MRP($)</Form.Label>
                    <Form.Control
                      type="text"
                      name="mrp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.mrp}
                      readOnly
                    />
                    {errors.mrp && touched.mrp && (
                      <p className="error">{errors.mrp}</p>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="4">
                    <Form.Label>Selling Price / Offer Price($)</Form.Label>
                    <Form.Control
                      type="text"
                      name="selling_price"
                      onChange={handleOfferPriceChange}
                      onBlur={handleBlur}
                      value={values.selling_price}
                      readOnly
                    />
                    {errors.selling_price && touched.selling_price && (
                      <p className="error">{errors.selling_price}</p>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="4">
                    <Form.Label>Discount Percentage</Form.Label>
                    <Form.Control
                      type="text"
                      name="discount_percent"
                      onChange={handleDiscountChange}
                      onBlur={handleBlur}
                      value={values.discount_percent}
                      readOnly
                    />
                    {errors.discount_percent && touched.discount_percent && (
                      <p className="error">{errors.discount_percent}</p>
                    )}
                  </Form.Group>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="isOutOfStock">
                      <Form.Check
                        type="checkbox"
                        label="Out Of Stock"
                        name="isOutOfStock"
                        onChange={(e) =>
                          setFieldValue("isOutOfStock", e.target.checked)
                        }
                        onBlur={handleBlur}
                        checked={values.isOutOfStock}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
