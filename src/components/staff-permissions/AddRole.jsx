import React, { useEffect } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { AddRoleValidation } from "../../commondata/formvalidations";
import { useFormik } from "formik";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import { useCreateRoleMutation, useGetAllModulesQuery } from "../../redux/features/staffEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    PERMISSION_OPTIONS,
    buildUserPermissions,
    handlePermissionSelection,
} from "../../utils/permissionOptions";

export default function AddRole() {
    const navigate = useNavigate();
    const { data, isLoading: modulesLoading } = useGetAllModulesQuery();
    const [createRole, { isLoading: saving }] = useCreateRoleMutation();

    const modelNameList = data?.data || [];

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            role_name: "",
            user_permission: [],
        },
        validationSchema: AddRoleValidation,
        onSubmit: async (formValues) => {
            try {
                const response = await createRole({
                    role_name: formValues.role_name,
                    user_permission: formValues.user_permission,
                });
                if (response?.data?.http_status_code === 201) {
                    toast.success(response?.data?.message || "Role created successfully");
                    navigate("/staff-permissions/roles");
                } else {
                    toast.error(response?.data?.message || "Failed to create role");
                }
            } catch (err) {
                toast.error(err?.message || "An error occurred");
            }
        },
    });

    useEffect(() => {
        if (modelNameList.length > 0) {
            setFieldValue("user_permission", buildUserPermissions(modelNameList));
        }
    }, [modelNameList, setFieldValue]);

    return (
        <>
            {(modulesLoading || saving) && <Loader />}
            <Row>
                <Col>
                    <PageHeader
                        titles="Roles & Permissions"
                        active="Add Role"
                        items={["Home", "Roles"]}
                        links={["/dashboard", "/staff-permissions/roles"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>
                                                Role Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="role_name"
                                                value={values.role_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. Manager"
                                            />
                                            {errors.role_name && touched.role_name && (
                                                <p className="text-danger">{errors.role_name}</p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Card.Header className="bg-primary text-white fs-5 rounded-3 my-4">
                                    Permissions
                                </Card.Header>
                                <Row>
                                    {modelNameList.length > 0 &&
                                        values.user_permission.length > 0 &&
                                        modelNameList.map((model, index) => (
                                            <Col md={4} key={model}>
                                                <Form.Group>
                                                    <Form.Label>{model}</Form.Label>
                                                    <SelectWithDragDrop
                                                        name={`permissions_${model}`}
                                                        options={PERMISSION_OPTIONS}
                                                        value={PERMISSION_OPTIONS.filter((option) =>
                                                            values.user_permission[index]?.permissions?.includes(option.value)
                                                        )}
                                                        onChange={(selectedOptions) =>
                                                            handlePermissionSelection(
                                                                selectedOptions,
                                                                index,
                                                                values.user_permission,
                                                                setFieldValue
                                                            )
                                                        }
                                                        onBlur={handleBlur}
                                                        isMulti
                                                        isSearchable
                                                        menuPlacement="auto"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        ))}
                                </Row>

                                <Row className="mt-4">
                                    <Col className="text-center">
                                        <Button type="submit">Save Role</Button>
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
