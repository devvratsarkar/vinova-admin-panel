import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useGetInventoryAttributesQuery, useGetProductInventoryVariantQuery } from "../../redux/features/inventory";
import * as yup from "yup"

const getAttributeValues = (attribute) =>
  (attribute?.values || attribute?.CustomFiledValue || []).filter(Boolean);

export default function EditVariant() {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({});

  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);

  const productId = data?._id || data?.product_details?._id;
  const { data: inventoryDataWithVariant } = useGetProductInventoryVariantQuery(
    { id: productId, type: data?.size },
    { skip: !isOpen || !productId || !data?.size }
  );
  const { data: getAttributeData } = useGetInventoryAttributesQuery(productId, { skip: !isOpen || !productId });
  const selectedAttributes = getAttributeData?.data?.customFields || [];

  useEffect(() => {
    if (selectedAttributes.length === 0 || !inventoryDataWithVariant?.data?.length) {
      if (selectedAttributes.length > 0) {
        const emptyInit = selectedAttributes.reduce((acc, attribute) => {
          if (attribute?.attribute_name) {
            acc[attribute.attribute_name] = [];
          }
          return acc;
        }, {});
        setInitialValues(emptyInit);
      }
      return;
    }

    const initValues = selectedAttributes.reduce((acc, attribute) => {
      if (attribute?.attribute_name) {
        acc[attribute.attribute_name] = [];
      }
      return acc;
    }, {});

    const resolveAttributeName = (attr) => {
      const attrId = attr && typeof attr === "object" ? attr._id : attr;
      const attrName = attr && typeof attr === "object" ? attr.attribute_name : attr;
      const match = selectedAttributes.find(
        (a) => a._id === attrId || a._id === attr || a.attribute_name === attrName || a.attribute_name === attr
      );
      return match?.attribute_name;
    };

    const pushIfNew = (attributeKey, id, name) => {
      const attributeName = resolveAttributeName(attributeKey);
      if (!attributeName || id == null || id === "" || !Array.isArray(initValues[attributeName])) return;
      if (!initValues[attributeName].some((val) => val?.id == id)) {
        initValues[attributeName].push({ id, name: name || id });
      }
    };

    inventoryDataWithVariant.data.forEach((variant) => {
      // 1) API returns attributesMapped: [{ attribute: { _id, attribute_name }, value: { _id, attribute_name } }]
      if (Array.isArray(variant?.attributesMapped) && variant.attributesMapped.length > 0) {
        variant.attributesMapped.forEach((item) => {
          const value = item?.value;
          if (!item?.attribute || !value) return;
          const id = typeof value === "object" && value._id != null ? value._id : value;
          const name = typeof value === "object" && value.attribute_name != null ? value.attribute_name : id;
          pushIfNew(item.attribute, id, name);
        });
        return;
      }

      // 2) API returns attribute (IDs or objects) + attribute_value (IDs or objects)
      const attrIds = Array.isArray(variant?.attribute) ? variant.attribute : [];
      const valueList = Array.isArray(variant?.attribute_value) ? variant.attribute_value : [];

      if (attrIds.length > 0) {
        attrIds.forEach((attr, index) => {
          const attributeName = resolveAttributeName(attr);
          if (!attributeName) return;
          const rawVal = valueList[index];
          const valueId = rawVal != null && typeof rawVal === "object" && rawVal._id != null ? rawVal._id : rawVal;
          const matchedAttr = selectedAttributes.find((a) => a.attribute_name === attributeName);
          const valueLabel =
            rawVal != null && typeof rawVal === "object" && rawVal.attribute_name != null
              ? rawVal.attribute_name
              : getAttributeValues(matchedAttr).find((v) => v._id == valueId)?.attribute_name;
          pushIfNew(attributeName, valueId, valueLabel);
        });
        return;
      }

      // 2b) API returns populated attribute_key + attribute_value_key
      const attrKeys = Array.isArray(variant?.attribute_key) ? variant.attribute_key : [];
      const valueKeys = Array.isArray(variant?.attribute_value_key) ? variant.attribute_value_key : [];
      if (attrKeys.length > 0) {
        attrKeys.forEach((attr, index) => {
          const rawVal = valueKeys[index];
          const valueId = rawVal != null && typeof rawVal === "object" && rawVal._id != null ? rawVal._id : rawVal;
          const valueLabel =
            rawVal != null && typeof rawVal === "object"
              ? rawVal.attribute_name || rawVal.attribute_value
              : rawVal;
          pushIfNew(attr, valueId, valueLabel);
        });
        return;
      }

      // 3) API returns only attribute_value as array of objects (e.g. [{ attribute_name: "Photochromic Lens" }, ...])
      valueList.forEach((rawVal) => {
        if (rawVal == null) return;
        const valueId = typeof rawVal === "object" && rawVal._id != null ? rawVal._id : rawVal;
        const valueName = typeof rawVal === "object" && rawVal.attribute_name != null ? rawVal.attribute_name : null;
        for (const attribute of selectedAttributes) {
          const values = getAttributeValues(attribute);
          const match = values.find((v) => v._id == valueId || (valueName && (v.attribute_name === valueName || (v.attribute_value && v.attribute_value === valueName))));
          if (match) {
            pushIfNew(attribute.attribute_name, match._id, match.attribute_name ?? match.attribute_value ?? valueName);
            break;
          }
        }
      });
    });

    setInitialValues(initValues);
  }, [selectedAttributes, inventoryDataWithVariant]);

  const validationSchema = yup.object().shape(
    selectedAttributes.reduce((schema, attribute) => {
      if (!attribute?.attribute_name) return schema;
      schema[attribute.attribute_name] = yup
        .array()
        .of(
          yup.object().shape({
            id: yup.string().required("Value ID is required"),
            name: yup.string().required("Value name is required"),
          })
        )
        .min(1, `${attribute.attribute_name} must have at least one value selected`)
        .required(`${attribute.attribute_name} is required`);
      return schema;
    }, {})
  );


  const {
    values,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    handleChange,
    touched,
    errors
  } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formattedValues = selectedAttributes.reduce((acc, attribute) => {
        acc[attribute.attribute_name] = (values[attribute.attribute_name] || [])
          .filter(Boolean)
          .map((val) => ({
            id: val.id,
            name: val.name,
          }));
        return acc;
      }, {});

      resetForm();
      dispatch(closeModal());
      navigate(`/inventor/edit-invertory-with-varient/${data?.size}/${data._id}`, {
        state: { values: formattedValues, productData: data, attribute: selectedAttributes },
      });
    },
  });


  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Edit Variant
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
          <Form className="border rounded-2 p-2" onSubmit={handleSubmit}>
            {selectedAttributes.length > 0 ? (
              selectedAttributes.map((attribute, index) => {
                return (
                  <div key={index}>
                    <Form.Label>{attribute.attribute_name} <span className="text-danger">*</span></Form.Label>
                    <SelectWithDragDrop
                      options={getAttributeValues(attribute).map((value) => ({
                        value: value._id,
                        label: value.attribute_name || value.attribute_value || value._id,
                      }))}
                      value={(values[attribute.attribute_name] || []).filter(Boolean).map((val) => ({
                        value: val.id,
                        label: val.name || getAttributeValues(attribute).find((item) => item._id === val.id)?.attribute_name || val.id,
                      }))}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => ({
                            id: option.value,
                            name: option.label,
                          }))
                          : [];
                        setFieldValue(attribute.attribute_name, selectedValues);
                      }}
                      onBlur={handleBlur}
                      isSearchable={true}
                      isClearable={true}
                      classNamePrefix="background"
                      isMulti
                    />
                    {touched[attribute.attribute_name] && errors[attribute.attribute_name] ? (
                      <p className="text-danger mt-1">{errors[attribute.attribute_name]}</p>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div>No attributes available</div>
            )}
            <Button type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}