import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { useNavigate } from "react-router-dom";
import Loader from "../../layouts/layoutcomponents/loader";
import { useGetInventoryAttributesQuery } from "../../redux/features/inventory";
import * as yup from "yup";

export default function AddVariant() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const { data: getAttributeData, isLoading } = useGetInventoryAttributesQuery(data?._id);
    const [initialValues, setInitialValues] = useState({});
    const [validationSchema, setValidationSchema] = useState(yup.object({}));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedAttributes = getAttributeData?.data?.customFields || [];

    useEffect(() => {
        if (selectedAttributes.length > 0) {
            // Set dynamic initialValues
            const initial = {};
            selectedAttributes.forEach(attr => {
                initial[attr.attribute_name] = [];
            });
            setInitialValues(initial);

            // Set dynamic validationSchema
            const schema = selectedAttributes.reduce((acc, attr) => {
                acc[attr.attribute_name] = yup
                    .array()
                    .of(
                        yup.object().shape({
                            id: yup.string().required("Value ID is required"),
                            name: yup.string().required("Value name is required"),
                        })
                    )
                    .min(1, `${attr.attribute_name} must have at least one value selected`)
                    .required(`${attr.attribute_name} is required`);
                return acc;
            }, {});
            setValidationSchema(yup.object().shape(schema));
        }
    }, [selectedAttributes]);

    const {
        values,
        errors,
        handleBlur,
        touched,
        handleChange,
        handleSubmit,
        resetForm,
        setFieldValue,
    } = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            navigate(`/inventor/add-invertory-with-varient`, {
                state: {
                    values: values,
                    productData: data,
                    attributes: selectedAttributes,
                },
            });
            resetForm();
            dispatch(closeModal());
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Modal show={isOpen}>
                <Modal.Header className="justify-content-center mx-2">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Add Variant
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
                        {selectedAttributes.map((item, index) => (
                            <Row className="pb-3" key={index}>
                                <Col md="3">
                                    <Form.Label>
                                        {item.attribute_name} <span className="text-danger">*</span>
                                    </Form.Label>
                                </Col>
                                <Col md="9">
                                    <SelectWithDragDrop
                                        options={item.values.map((val) => ({
                                            value: val._id,
                                            label: val.attribute_name,
                                            id: val._id,
                                            name: val.attribute_name,
                                        }))}
                                        value={values[item.attribute_name]}
                                        onChange={(selectedOptions) =>
                                            setFieldValue(
                                                item.attribute_name,
                                                selectedOptions ? selectedOptions.map((option) => option) : []
                                            )
                                        }
                                        onBlur={handleBlur}
                                        isSearchable={true}
                                        isClearable={true}
                                        classNamePrefix="background"
                                        isMulti
                                    />
                                    {touched[item.attribute_name] && errors[item.attribute_name] ? (
                                        <p className="text-danger mt-1">
                                            {errors[item.attribute_name]}
                                        </p>
                                    ) : null}
                                </Col>
                            </Row>
                        ))}

                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
