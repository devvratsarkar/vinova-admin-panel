import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { AddStaffValidation } from "../../commondata/formvalidations";
import { useFormik } from "formik";
import ImageFileInput from "../common/ImageFileInput";
import { useAddStaffMutation, useGetAllRolesQuery } from "../../redux/features/staffEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { formatRoleName } from "../../utils/permissionOptions";

const getRoleId = (role) => role?._id ?? role?.id;

export default function AddStaffPermissions() {
    const navigate = useNavigate();
    const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery();
    const [addStaff, { isLoading: addLoading }] = useAddStaffMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const rolesList = Array.isArray(rolesData?.data) ? rolesData.data : [];

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            name: "",
            password: "",
            password_confirmation: "",
            phone_number: "",
            dob: "",
            profile_pic: "",
            email: "",
            role_id: "",
            designation: "",
            about: "",
            qualification: "",
            gender: "",
        },
        validationSchema: AddStaffValidation,
        onSubmit: async (formValues) => {
            const formData = new FormData();
            Object.entries(formValues).forEach(([key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            try {
                const response = await addStaff(formData);
                if (response?.data?.http_status_code === 201) {
                    toast.success(response?.data?.message || "Staff added successfully");
                    navigate("/staff-permissions/staff");
                } else {
                    toast.error(response?.data?.message || "Failed to add staff");
                }
            } catch (err) {
                toast.error(err?.message || "An error occurred");
            }
        },
    });

    return (
        <>
            {(rolesLoading || addLoading) && <Loader />}
            <Row>
                <Col>
                    <PageHeader
                        titles="Roles & Permissions"
                        active="Add Staff"
                        items={["Home", "Staff"]}
                        links={["/dashboard", "/staff-permissions/staff"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Card.Header className="bg-primary text-white fs-4 rounded-3">Staff Details</Card.Header>
                                <Row className="mt-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.name && touched.name && <p className="text-danger">{errors.name}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                                            <Form.Control name="phone_number" value={values.phone_number} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.phone_number && touched.phone_number && <p className="text-danger">{errors.phone_number}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>DOB</Form.Label>
                                            <Form.Control type="date" name="dob" value={values.dob} onChange={handleChange} onBlur={handleBlur} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                            <Form.Control name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.email && touched.email && <p className="text-danger">{errors.email}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                                            <Form.Select name="role_id" value={values.role_id} onChange={handleChange} onBlur={handleBlur}>
                                                <option value="">Select Role</option>
                                                {rolesList.map((role) => (
                                                    <option key={getRoleId(role)} value={getRoleId(role)}>
                                                        {formatRoleName(role.name)}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.role_id && touched.role_id && <p className="text-danger">{errors.role_id}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <ImageFileInput
                                            label="Profile Picture"
                                            name="profile_pic"
                                            required
                                            onChange={(e) => setFieldValue("profile_pic", e.target.files?.[0])}
                                            onBlur={handleBlur}
                                            error={errors.profile_pic}
                                            touched={touched.profile_pic}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                            <div className="input-icon">
                                                <span className="input-icon-addon pe-auto" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                                                </span>
                                                <Form.Control type={showPassword ? "text" : "password"} name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                                            </div>
                                            {errors.password && touched.password && <p className="text-danger">{errors.password}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                                            <div className="input-icon">
                                                <span className="input-icon-addon pe-auto" style={{ cursor: "pointer" }} onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}>
                                                    {showPasswordConfirmation ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                                                </span>
                                                <Form.Control type={showPasswordConfirmation ? "text" : "password"} name="password_confirmation" value={values.password_confirmation} onChange={handleChange} onBlur={handleBlur} />
                                            </div>
                                            {errors.password_confirmation && touched.password_confirmation && <p className="text-danger">{errors.password_confirmation}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Select name="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur}>
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Designation</Form.Label>
                                            <Form.Control name="designation" value={values.designation} onChange={handleChange} onBlur={handleBlur} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label>About</Form.Label>
                                            <textarea className="border rounded-3 w-100" name="about" value={values.about} onChange={handleChange} onBlur={handleBlur} rows={3} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Label>Qualification</Form.Label>
                                        <textarea className="border rounded-3 w-100" name="qualification" value={values.qualification} onChange={handleChange} onBlur={handleBlur} rows={3} />
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col className="text-center">
                                        <Button type="submit">Save Staff</Button>
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
