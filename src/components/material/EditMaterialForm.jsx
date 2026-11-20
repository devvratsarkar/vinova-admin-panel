import React, { useEffect, useMemo } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { useFormik } from "formik";
import { materialValidationSchema } from "../../commondata/formvalidations";
import {
    useGetAllMaterialsQuery,
    useUpdateMaterialMutation,
} from "../../redux/features/materialAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
];

const customStyles = {
    control: (provided) => ({ ...provided, minHeight: "38px", height: "38px" }),
    valueContainer: (provided) => ({ ...provided, height: "38px", padding: "0 6px" }),
    input: (provided) => ({ ...provided, margin: "0px" }),
    indicatorsContainer: (provided) => ({ ...provided, height: "38px" }),
};

const getMaterialId = (row) => row?.id ?? row?._id;

export default function EditMaterialForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isSuccess, refetch } = useGetAllMaterialsQuery();
    const [updateData, { isLoading: loadingUpdate }] = useUpdateMaterialMutation();

    const listData = useMemo(() => {
        if (Array.isArray(data?.data?.data)) return data.data.data;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    }, [data]);

    const singleData = useMemo(
        () => listData.find((item) => String(getMaterialId(item)) === String(id)) || null,
        [listData, id]
    );

    const { errors, values, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } =
        useFormik({
            initialValues: {
                name: "",
                status: true,
            },
            validationSchema: materialValidationSchema,
            onSubmit: async (formValues) => {
                try {
                    const resp = await updateData({
                        id,
                        data: {
                            name: formValues.name,
                            status: Boolean(formValues.status),
                        },
                    });
                    if (resp?.data?.http_status_code === 200) {
                        refetch();
                        toast.success(resp?.data?.message || "Material updated successfully");
                        navigate("/catalogue/material");
                    } else {
                        toast.error(resp?.data?.message || "Failed to update material");
                    }
                } catch (err) {
                    toast.error(err?.message || "Something went wrong");
                }
            },
        });

    useEffect(() => {
        if (isSuccess && singleData) {
            setFieldValue("name", singleData?.name || "");
            setFieldValue("status", singleData?.status ?? true);
        }
    }, [isSuccess, singleData, setFieldValue]);

    return (
        <>
            {(loadingUpdate || isLoading) && <Loader />}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Name<span className="text-color">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name (e.g., metal)"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.name && errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Status<span className="text-color">*</span>
                            </Form.Label>
                            <SelectWithDragDrop
                                options={statusOptions}
                                value={statusOptions.find((option) => option.value === values.status)}
                                onChange={(option) => {
                                    setFieldValue("status", option.value);
                                    setFieldTouched("status", true);
                                }}
                                styles={customStyles}
                                classNamePrefix="react-select"
                            />
                            {touched.status && errors.status && (
                                <div className="invalid-feedback d-block">{errors.status}</div>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Button type="submit" className="w-auto submit_btn">
                        Update
                    </Button>
                </Row>
            </Form>
        </>
    );
}
