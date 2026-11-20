import React, { useMemo } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { AddRoleValidation } from "../../commondata/formvalidations";
import { useFormik } from "formik";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import {
    useGetAllModulesQuery,
    useGetSingleRoleQuery,
    useUpdateRoleMutation,
} from "../../redux/features/staffEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
    PERMISSION_OPTIONS,
    mapRolePermissionsToForm,
    handlePermissionSelection,
    formatRoleName,
} from "../../utils/permissionOptions";

export default function EditRole() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: modulesData,
        isLoading: modulesLoading,
        isFetching: modulesFetching,
    } = useGetAllModulesQuery();

    const {
        data: roleData,
        isLoading: roleLoading,
        isFetching: roleFetching,
        isError,
        error,
        isSuccess: roleSuccess,
    } = useGetSingleRoleQuery(id);

    const [updateRole, { isLoading: saving }] = useUpdateRoleMutation();

    const modelNameList = useMemo(
        () => (Array.isArray(modulesData?.data) ? modulesData.data : []),
        [modulesData?.data]
    );

    const singleRole = roleData?.data;

    const formInitialValues = useMemo(() => {
        if (!singleRole || !modelNameList.length) {
            return {
                role_name: "",
                user_permission: [],
            };
        }

        return {
            role_name: formatRoleName(singleRole.name),
            user_permission: mapRolePermissionsToForm(
                modelNameList,
                singleRole.permission || singleRole.permissions || []
            ),
        };
    }, [singleRole, modelNameList]);

    const isPageReady = roleSuccess && !!singleRole && modelNameList.length > 0;

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: formInitialValues,
        enableReinitialize: true,
        validationSchema: AddRoleValidation,
        onSubmit: async (formValues) => {
            try {
                const response = await updateRole({
                    id,
                    body: {
                        role_name: formValues.role_name,
                        user_permission: formValues.user_permission,
                    },
                });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response?.data?.message || "Role updated successfully");
                    navigate("/staff-permissions/roles");
                } else {
                    toast.error(response?.data?.message || "Failed to update role");
                }
            } catch (err) {
                toast.error(err?.message || "An error occurred");
            }
        },
    });

    if (modulesLoading || roleLoading || modulesFetching || roleFetching || !isPageReady) {
        return <Loader />;
    }

    if (isError) {
        return <Error error_mes={error} />;
    }

    return (
        <>
            {saving && <Loader />}
            <Row>
                <Col>
                    <PageHeader
                        titles="Roles & Permissions"
                        active="Edit Role"
                        items={["Home", "Roles"]}
                        links={["/dashboard", "/staff-permissions/roles"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit} key={`edit-role-${id}`}>
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
                                    {modelNameList.map((model, index) => {
                                        const selectedPermissions =
                                            values.user_permission[index]?.permissions || [];
                                        const selectedOptions = PERMISSION_OPTIONS.filter((option) =>
                                            selectedPermissions.includes(option.value)
                                        );

                                        return (
                                            <Col md={4} key={model}>
                                                <Form.Group>
                                                    <Form.Label>{model}</Form.Label>
                                                    <SelectWithDragDrop
                                                        key={`${model}-${selectedPermissions.join(",")}`}
                                                        name={`permissions_${model}`}
                                                        options={PERMISSION_OPTIONS}
                                                        value={selectedOptions}
                                                        onChange={(selected) =>
                                                            handlePermissionSelection(
                                                                selected,
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
                                        );
                                    })}
                                </Row>

                                <Row className="mt-4">
                                    <Col className="text-center">
                                        <Button type="submit">Update Role</Button>
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
