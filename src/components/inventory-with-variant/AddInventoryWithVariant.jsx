import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { AddInventoryWithVariantSchema } from "../../commondata/formvalidations";
import Loader from "../../layouts/layoutcomponents/loader";
import { useAddInventoryVariantMutation, useGetAllInventoryVariantsQuery, useGetProductInventoryVariantQuery } from "../../redux/features/inventory";

const AddInventoryWithVariant = () => {
  const [discount, setDiscount] = useState(true);
  const navigate = useNavigate();

  const [size, setSize] = useState("XS")
  const location = useLocation();
  const formData = location?.state?.values || null;
  console.log('location', location);

  const ProductData = location?.state?.productData;
  const allAttributes = location?.state?.attributes;
  const [combinations, setCombinations] = useState([]);
  const [displayCombinations, setDisplayCombinations] = useState([]);
  const [attributeValuesCombinations, setAttributeValuesCombinations] = useState([]);
  console.log('ProductData', ProductData);
  // Extract attributes and their values
  const attributesArray = Object.keys(formData || {});
  const selectedAttributesIds = attributesArray.map((attributeName) => {
    const attribute = allAttributes.find((attr) => attr.attribute_name === attributeName);
    return attribute ? attribute._id : null;
  });


  const attributeValuesArray = attributesArray.map((key) => formData[key].map((item) => item.value));

  // Generate combinations of attribute values
  const generateCombinations = (arrays, prefix = []) => {
    if (!arrays.length) {
      return [prefix];
    }
    const [firstArray, ...remainingArrays] = arrays;
    const combinations = [];
    firstArray.forEach((value) => {
      const newPrefix = [...prefix, value];
      combinations.push(...generateCombinations(remainingArrays, newPrefix));
    });
    return combinations;
  };

  useEffect(() => {
    if (attributeValuesArray.length > 0) {
      const newCombinations = generateCombinations(attributeValuesArray);
      setAttributeValuesCombinations(newCombinations);
    }
  }, []);

  const { refetch: allInventoryRefetch } = useGetAllInventoryVariantsQuery()
  const [addInventoryWithVariant, { isLoading }] = useAddInventoryVariantMutation();


  useEffect(() => {
    if (formData) {
      const keys = Object.keys(formData);
      if (keys.length > 0) {
        const newCombinations = [];
        const newDisplayCombinations = [];
        const [firstKey, ...remainingKeys] = keys;

        // Initialize with first attribute
        formData[firstKey].forEach((value) => {
          newCombinations.push({ [firstKey]: value.value });
          newDisplayCombinations.push({ [firstKey]: value.label });
        });


        remainingKeys.forEach((key) => {
          const currentValues = formData[key];
          const tempCombinations = [];
          const tempDisplayCombinations = [];
          newCombinations.forEach((items, idx) => {
            currentValues.forEach((value) => {
              tempCombinations.push({ ...items, [key]: value.value });
              tempDisplayCombinations.push({ ...newDisplayCombinations[idx], [key]: value.label });
            });
          });
          newCombinations.length = 0;
          newDisplayCombinations.length = 0;
          newCombinations.push(...tempCombinations);
          newDisplayCombinations.push(...tempDisplayCombinations);
        });

        setCombinations(newCombinations);
        setDisplayCombinations(newDisplayCombinations);
      }
    }
  }, [formData]);

  // Initialize form values with arrays of appropriate length
  const initialValues = {
    // image: Array(combinations.length).fill(null),
    image: Array(combinations.length).fill([]),
    sku: Array(combinations.length).fill(""),
    stock_quantity: Array(combinations.length).fill(""),
    mrp: Array(combinations.length).fill(""),
    selling_price: Array(combinations.length).fill(""),
    isOutOfStock: Array(combinations.length).fill(false),
  };


  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, setFieldError } = useFormik({
    initialValues,
    validationSchema: "",
    // validationSchema: AddInventoryWithVariantSchema,
    onSubmit: async (values) => {

      const formattedData = combinations?.map((combination, index) => ({
        product_id: ProductData?._id || "",
        variant: Object.values(displayCombinations[index]).join(", "),
        image: values.image[index] || null,
        sku: values.sku[index] || "",
        stock_quantity: values.stock_quantity[index] || "",
        mrp: values.mrp[index] || "",
        selling_price: values.selling_price[index] || "",
        isOutOfStock: values.isOutOfStock[index] || false,
        attribute: selectedAttributesIds?.map((item) => item),
        attribute_value: Object.values(combination),
        size: size || "XS",
      }));


      const formData = new FormData();

      const flattenObjectForFormData = (obj, parentKey = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const formKey = parentKey ? `${parentKey}.${key}` : key;

          if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach((file) => {
              formData.append(`${formKey}`, file);
            });
          }
          else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === "object" && item !== null) {
                flattenObjectForFormData(item, `${formKey}[${index}]`);
              } else {
                formData.append(`${formKey}[${index}]`, item ?? "");
              }
            });
          } else if (typeof value === "object" && value !== null) {
            flattenObjectForFormData(value, formKey);
          } else {
            formData.append(formKey, value ?? "");
          }
        });
      };

      flattenObjectForFormData(formattedData);


      try {
        const resp = await addInventoryWithVariant(formData)
        if (resp?.data?.http_status_code === 201) {
          // refetch()
          allInventoryRefetch()
          toast.success(resp?.data?.message)
          navigate("/stocks/inventory")
        } else {
          toast.error(resp?.data?.message)
        }
      } catch (err) {
        toast.error(err?.message)
      }
    },
  });

  const handleCheckboxChange = (index) => {
    setFieldValue(`isOutOfStock[${index}]`, !values.isOutOfStock[index]);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <PageHeader
          titles="Stocks-Inventory"
          active={["Add Inventory"]}
          items={["Home", "Inventory List"]}
          links={["/dashboard", "/stocks/inventory"]}
        />
        <Row>
          <Col>
            <Card>
              <Card.Body className="overflow-auto">
                <Row>
                  <Col as={Col} md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Size</Form.Label>
                      <Form.Select value={size} onChange={((e) => setSize(e.target.value))}>
                        <option value={"XS"}>XS</option>
                        <option value={"S"}>S</option>
                        <option value={"M"}>M</option>
                        <option value={"L"}>L</option>
                      </Form.Select>
                    </Form.Group>

                  </Col>
                </Row>
                <Form onSubmit={handleSubmit} className="form-custom-width">
                  <Table>
                    <thead>
                      <tr>
                        <th>Variant <span className="text-danger">*</span></th>
                        <th>Image <span className="text-danger">*</span></th>
                        <th>Out of Stock</th>
                        <th>SKU</th>
                        <th>Stock Quantity <span className="text-danger">*</span></th>
                        <th>MRP($)</th>
                        <th>Selling Price($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayCombinations.map((item, index) => (
                        <tr key={index}>
                          <td style={{ whiteSpace: "pre-line" }}>
                            {Object.entries(item)
                              .map(([attrName, valueName]) => (attrName ? `${attrName} - ${valueName}` : valueName))
                              .filter(Boolean)
                              .join("\n")}
                          </td>
                          <td>
                            {/* <Form.Control
                              type="file"
                              name={`image[${index}]`}
                              onChange={(e) => setFieldValue(`image[${index}]`, e.currentTarget.files[0])}
                              onBlur={handleBlur}
                              disabled={values.isOutOfStock[index]}
                            /> */}
                            <Form.Control
                              type="file"
                              multiple
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                              name={`image[${index}]`}
                              onChange={(e) => {
                                const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
                                const files = Array.from(e.currentTarget.files || []);
                                const invalidFiles = files.filter((f) => !allowedTypes.includes(f.type));
                                if (invalidFiles.length > 0) {
                                  setFieldError(`image[${index}]`, "Only JPG, PNG, WebP, and SVG images are allowed.");
                                  e.currentTarget.value = "";
                                  return;
                                }
                                setFieldValue(`image[${index}]`, files);
                              }}
                              onBlur={handleBlur}
                              disabled={values.isOutOfStock[index]}
                            />

                            {errors.image && errors.image[index] && touched.image && touched.image[index] ? (
                              <p className="text-danger">{errors.image[index]}</p>
                            ) : null}
                            {/* Image Preview */}
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {Array.isArray(values.image[index]) &&
                                values.image[index].map((img, imgIndex) => {
                                  const preview =
                                    img instanceof File ? URL.createObjectURL(img) : img;

                                  return (
                                    <div
                                      key={imgIndex}
                                      style={{ position: "relative" }}
                                    >
                                      <img
                                        src={preview}
                                        alt="preview"
                                        width={40}
                                        height={40}
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: "6px",
                                          border: "1px solid #ddd",
                                        }}
                                      />

                                      {/* Remove button */}
                                      {!values.isOutOfStock[index] && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedImages = values.image[index].filter(
                                              (_, i) => i !== imgIndex
                                            );
                                            setFieldValue(`image[${index}]`, updatedImages);
                                          }}
                                          style={{
                                            position: "absolute",
                                            top: "-6px",
                                            right: "-6px",
                                            background: "red",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "18px",
                                            height: "18px",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </td>
                          <td>
                            <Form.Check
                              type="checkbox"
                              name={`isOutOfStock[${index}]`}
                              checked={values.isOutOfStock[index]}
                              onChange={() => handleCheckboxChange(index)}
                              onBlur={handleBlur}
                              className="d-flex justify-content-start ps-5 rounded-1"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name={`sku[${index}]`}
                              value={values.sku[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={values.isOutOfStock[index]}
                            />
                            {errors.sku && errors.sku[index] && touched.sku && touched.sku[index] ? (
                              <p className="text-danger">{errors.sku[index]}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name={`stock_quantity[${index}]`}
                              value={values.stock_quantity[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={values.isOutOfStock[index]}
                              min={0}
                            />
                            {errors.stock_quantity &&
                              errors.stock_quantity[index] &&
                              touched.stock_quantity &&
                              touched.stock_quantity[index] ? (
                              <p className="text-danger">{errors.stock_quantity[index]}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name={`mrp[${index}]`}
                              value={values.mrp[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={values.isOutOfStock[index]}
                              min={0}
                            />
                            {errors.mrp && errors.mrp[index] && touched.mrp && touched.mrp[index] ? (
                              <p className="text-danger">{errors.mrp[index]}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name={`selling_price[${index}]`}
                              value={values.selling_price[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={values.isOutOfStock[index]}
                              min={0}
                            />
                            {errors.selling_price &&
                              errors.selling_price[index] &&
                              touched.selling_price &&
                              touched.selling_price[index] ? (
                              <p className="text-danger">{errors.selling_price[index]}</p>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Row className="justify-content-center">
                    <Button type="submit" className="w-auto">
                      Submit
                    </Button>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddInventoryWithVariant;