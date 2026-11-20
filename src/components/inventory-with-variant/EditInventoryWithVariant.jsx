import React, { useMemo } from "react";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { AddInventoryWithVariantSchema } from "../../commondata/formvalidations";
import { useGetProductInventoryVariantQuery, useGetInventoryAttributesQuery, useUpdateInventoryVariantMutation } from "../../redux/features/inventory";

/** Normalize attribute_value to array of IDs (handles objects with _id) */
const getValueIds = (attrValue) => {
    if (!Array.isArray(attrValue)) return [];
    return attrValue.map((v) => (v != null && typeof v === "object" && v._id != null ? v._id : v));
};

/** Check if two attribute_value arrays match (same IDs in same order) */
const sameAttributeValue = (a, b) => {
    const idsA = getValueIds(a);
    const idsB = Array.isArray(b) ? b.map((v) => (v != null && typeof v === "object" && v._id != null ? v._id : v)) : [];
    if (idsA.length !== idsB.length) return false;
    return idsA.every((id, i) => id == idsB[i]);
};

/** Cartesian product of arrays */
const generateCombinations = (arrays, prefix = []) => {
    if (!arrays.length) return [prefix];
    const [first, ...rest] = arrays;
    const result = [];
    first.forEach((value) => {
        result.push(...generateCombinations(rest, [...prefix, value]));
    });
    return result;
};

/**
 * Builds variant display label as "attribute_name - value_name" for each pair.
 * Uses attributesMapped from API if present, otherwise builds from allAttributes + attribute/attribute_value arrays.
 */
const getVariantDisplayLabel = (variant, allAttributes) => {
    if (Array.isArray(variant?.attributesMapped) && variant.attributesMapped.length > 0) {
        return variant.attributesMapped
            .map((item) => {
                const attrName = item?.attribute?.attribute_name ?? "";
                const valueName = item?.value?.attribute_name ?? "";
                return attrName ? `${attrName} - ${valueName}` : valueName;
            })
            .filter(Boolean)
            .join("\n");
    }
    if (allAttributes?.length && Array.isArray(variant?.attribute) && Array.isArray(variant?.attribute_value)) {
        return variant.attribute
            .map((attrId, index) => {
                const attribute = allAttributes.find((a) => a._id === attrId);
                const valueId = variant.attribute_value[index];
                const valueObj = attribute?.values?.find((v) => v._id === valueId);
                const attrName = attribute?.attribute_name ?? "";
                const valueName = valueObj?.attribute_name ?? valueId ?? "";
                return attrName ? `${attrName} - ${valueName}` : valueName;
            })
            .filter(Boolean)
            .join("\n");
    }
    return variant?.variant ?? "";
};

const EditInventoryWithVariant = () => {
    const navigate = useNavigate();
    const { type, modelId } = useParams()
    const location = useLocation();

    const ProductData = location?.state?.productData;
    const attributesFromState = location?.state?.attribute;
    const { data: attributesData } = useGetInventoryAttributesQuery(modelId, { skip: !modelId });
    const [updateInventoryWithVariant, { isLoading: updateInvntoryLoading }] = useUpdateInventoryVariantMutation();
    const { data: inventoryDataWithVariant, refetch, isLoading } = useGetProductInventoryVariantQuery({ id: modelId, type: type });

    const apiVariants = useMemo(
        () => (Array.isArray(inventoryDataWithVariant?.data) ? inventoryDataWithVariant.data : []),
        [inventoryDataWithVariant?.data]
    );
    const allAttributes = useMemo(
        () => attributesFromState ?? attributesData?.data?.customFields ?? [],
        [attributesFromState, attributesData?.data?.customFields]
    );
    const valuesFromState = location?.state?.values;

    const { mergedVariants, selectedAttributesIds } = useMemo(() => {
        if (!valuesFromState || !allAttributes?.length) {
            const ids = apiVariants.length > 0 ? (apiVariants[0].attribute || []) : [];
            return { mergedVariants: apiVariants, selectedAttributesIds: ids };
        }
        const attributeIds = allAttributes.map((a) => a._id);
        const valueArrays = allAttributes.map((attr) =>
            (valuesFromState[attr.attribute_name] || []).map((v) => v.id ?? v.value ?? v)
        );
        if (valueArrays.some((arr) => !arr.length)) {
            return { mergedVariants: apiVariants, selectedAttributesIds: apiVariants[0]?.attribute || attributeIds };
        }
        const combinations = generateCombinations(valueArrays);
        const merged = combinations.map((valueIds) => {
            const displayNames = valueIds.map((id, i) => {
                const attr = allAttributes[i];
                const val = attr?.values?.find((v) => v._id == id);
                return val?.attribute_name ?? val?.attribute_value ?? id;
            });
            const variantStr = displayNames.join(", ");
            const existing = apiVariants.find((v) => sameAttributeValue(v.attribute_value, valueIds));
            if (existing) {
                return {
                    ...existing,
                    variant: variantStr,
                    attribute_value: valueIds,
                    attribute: attributeIds,
                };
            }
            return {
                variant: variantStr,
                attribute_value: valueIds,
                attribute: attributeIds,
                sku: "",
                stock_quantity: "",
                mrp: "",
                selling_price: "",
                isOutOfStock: false,
                image: null,
                // status: false,
            };
        });
        return { mergedVariants: merged, selectedAttributesIds: attributeIds };
    }, [apiVariants, valuesFromState, allAttributes]);

    const allVariants = mergedVariants;

    const initialValues = useMemo(() => ({
        image: allVariants.map((variant) =>
            Array.isArray(variant.image) ? variant.image : variant.image ? [variant.image] : []
        ),
        sku: allVariants.map((variant) => variant.sku || ""),
        stock_quantity: allVariants.map((variant) => variant.stock_quantity || ""),
        mrp: allVariants.map((variant) => variant.mrp || ""),
        selling_price: allVariants.map((variant) => variant.selling_price || ""),
        isOutOfStock: allVariants.map((variant) => variant.isOutOfStock || false),
        variant: allVariants.map((variant) => variant.variant || ""),
        status: allVariants.map(() => true),
    }), [allVariants]);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: AddInventoryWithVariantSchema,
        onSubmit: async (values) => {
            const formattedData = allVariants?.map((variant, index) => ({
                product_id: modelId || "",
                variant: variant.variant,
                image: values.image[index] || null,
                sku: values.sku[index] || "",
                stock_quantity: values.stock_quantity[index] || "",
                mrp: values.mrp[index] || "",
                selling_price: values.selling_price[index] || "",
                isOutOfStock: values.isOutOfStock[index] || false,
                attribute: selectedAttributesIds,
                attribute_value: variant.attribute_value,
                size: type || "XS",
                // status: values.status[index] || false,
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
                            } // ✅ IMAGE FIELD (no index)
                            if (
                                formKey.includes("image") &&
                                typeof item === "string" // prefilled image URL
                            ) {
                                formData.append(formKey, item);
                            }
                            else {
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
                const resp = await updateInventoryWithVariant({
                    product_id: modelId,
                    size: type,
                    formData: formData,
                });

                if (resp?.data?.http_status_code === 200) {
                    refetch();
                    toast.success(resp?.data?.message);
                    navigate(-1);
                } else {
                    toast.error(resp?.data?.message);
                }
            } catch (err) {
                toast.error(err?.message);
            }
        },
    });

    const handleCheckboxChange = (index) => {
        formik.setFieldValue(`isOutOfStock[${index}]`, !formik.values.isOutOfStock[index]);
    };

    return (
        <>
            {(isLoading || updateInvntoryLoading) && <Loader />}
            <PageHeader
                titles="Stock-Inventory"
                active="Edit"
                items={['Home', 'Inventory List']}
                links={["/dashboard", "/stocks/inventory"]}
            />
            <Row>
                <Col xl={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h4 className="card-title mb-0">Edit Inventory</h4>&nbsp; | <p className="m-3 fw-bold">Size: <span className="text-success">{ProductData?.size}</span></p>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="form-custom-width">
                                    <Table className="variant_form">
                                        <thead className="border-bottom">
                                            <tr>
                                                <th>Variant<span className="text-danger">*</span></th>
                                                <th>Image<span className="text-danger">*</span></th>
                                                <th>isOutOfStock<span className="text-danger">*</span></th>
                                                <th>Sku</th>
                                                <th>Stock<span className="text-danger">*</span></th>
                                                <th>MRP($)</th>
                                                <th>Selling Price($)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allVariants.map((variant, index) => (
                                                <tr key={index} className="border-bottom">
                                                    <td style={{ whiteSpace: "pre-line" }}>{getVariantDisplayLabel(variant, allAttributes)}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="file"
                                                            multiple
                                                            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                                                            name={`image[${index}]`}
                                                            onChange={(e) => {
                                                                const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
                                                                const newFiles = Array.from(e.currentTarget.files);
                                                                const invalidFiles = newFiles.filter((f) => !allowedTypes.includes(f.type));
                                                                if (invalidFiles.length > 0) {
                                                                    formik.setFieldError(`image[${index}]`, "Only JPG, PNG, WebP, and SVG images are allowed.");
                                                                    e.currentTarget.value = "";
                                                                    return;
                                                                }
                                                                const existing = Array.isArray(formik.values.image[index]) ? formik.values.image[index] : [];
                                                                formik.setFieldValue(`image[${index}]`, [...existing, ...newFiles]);
                                                                e.currentTarget.value = "";
                                                            }}
                                                            onBlur={formik.handleBlur}
                                                            disabled={formik.values.isOutOfStock[index]}
                                                        />
                                                        {formik.errors.image && formik.errors.image[index] && formik.touched.image && formik.touched.image[index] ? (
                                                            <p className="text-danger">{formik.errors.image[index]}</p>
                                                        ) : null}
                                                        {/* Image Preview */}
                                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                                            {Array.isArray(formik.values.image[index]) &&
                                                                formik.values.image[index].map((img, imgIndex) => {
                                                                    const previewSrc = img instanceof File ? URL.createObjectURL(img) : img;
                                                                    return (
                                                                        <div key={imgIndex} style={{ position: "relative" }}>
                                                                            <img
                                                                                src={previewSrc}
                                                                                alt="preview"
                                                                                width={40}
                                                                                height={40}
                                                                                style={{
                                                                                    objectFit: "cover",
                                                                                    borderRadius: "6px",
                                                                                    border: "1px solid #ddd",
                                                                                }}
                                                                            />
                                                                            {!formik.values.isOutOfStock[index] && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const updated = formik.values.image[index].filter((_, i) => i !== imgIndex);
                                                                                        formik.setFieldValue(`image[${index}]`, updated);
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
                                                                                        lineHeight: "1",
                                                                                        cursor: "pointer",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        justifyContent: "center",
                                                                                        padding: 0,
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
                                                            checked={formik.values.isOutOfStock[index]}
                                                            onChange={() => handleCheckboxChange(index)}
                                                            onBlur={formik.handleBlur}
                                                            className="d-flex justify-content-start ps-5 rounded-1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            name={`sku[${index}]`}
                                                            value={formik.values.sku[index]}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            disabled={formik.values.isOutOfStock[index]}
                                                        />
                                                        {formik.errors.sku && formik.errors.sku[index] && formik.touched.sku && formik.touched.sku[index] ? (
                                                            <p className="text-danger">{formik.errors.sku[index]}</p>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            name={`stock_quantity[${index}]`}
                                                            value={formik.values.stock_quantity[index]}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            disabled={formik.values.isOutOfStock[index]}
                                                            min={0}
                                                        />
                                                        {formik.errors.stock_quantity && formik.errors.stock_quantity[index] && formik.touched.stock_quantity && formik.touched.stock_quantity[index] ? (
                                                            <p className="text-danger">{formik.errors.stock_quantity}</p>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            name={`mrp[${index}]`}
                                                            value={formik.values.mrp[index]}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            disabled={formik.values.isOutOfStock[index]}
                                                            min={0}
                                                        />
                                                        {formik.errors.mrp && formik.errors.mrp[index] && formik.touched.mrp && formik.touched.mrp[index] ? (
                                                            <p className="text-danger">{formik.errors.mrp[index]}</p>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            name={`selling_price[${index}]`}
                                                            value={formik.values.selling_price[index]}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            disabled={formik.values.isOutOfStock[index]}
                                                            min={0}
                                                        />
                                                        {formik.errors.selling_price && formik.errors.selling_price[index] && formik.touched.selling_price && formik.touched.selling_price[index] ? (
                                                            <p className="text-danger">{formik.errors.selling_price[index]}</p>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <Row className="justify-content-center mb-4">
                                        <Button variant="primary" type="submit" className="w-auto">Submit</Button>
                                    </Row>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default EditInventoryWithVariant;
