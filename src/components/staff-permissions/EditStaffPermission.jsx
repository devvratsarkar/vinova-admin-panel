import React, { useEffect } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { EditStaffValidation } from "../../commondata/formvalidations";
import { useFormik } from "formik";
import {
    useGetAllRolesQuery,
    useGetSingleStaffQuery,
    useUpdateStaffMutation,
} from "../../redux/features/staffEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { formatRoleName } from "../../utils/permissionOptions";

const getRoleId = (role) => role?._id ?? role?.id;

export default function EditStaffPermissions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery();
    const { data: userData, isLoading, isError, error, isSuccess } = useGetSingleStaffQuery(id);
    const [updateStaff, { isLoading: saving }] = useUpdateStaffMutation();

    const singleUserData = userData?.data || null;
    const rolesList = Array.isArray(rolesData?.data) ? rolesData.data : [];

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            name: "",
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
        enableReinitialize: true,
        validationSchema: EditStaffValidation,
        onSubmit: async (formValues) => {
            const { profile_pic, ...rest } = formValues;

            try {
                let payload;
                if (profile_pic instanceof File) {
                    const formData = new FormData();
                    Object.entries(rest).forEach(([key, value]) => {
                        if (value !== "" && value !== null && value !== undefined) {
                            formData.append(key, value);
                        }
                    });
                    formData.append("profile_pic", profile_pic);
                    payload = formData;
                } else {
                    payload = Object.fromEntries(
                        Object.entries(rest).filter(([, value]) => value !== "" && value !== null && value !== undefined)
                    );
                }

                const response = await updateStaff({ staffData: payload, staffId: id });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response?.data?.message || "Staff updated successfully");
                    navigate("/staff-permissions/staff");
                } else {
                    toast.error(response?.data?.message || "Failed to update staff");
                }
            } catch (err) {
                toast.error(err?.message || "An error occurred");
            }
        },
    });

    useEffect(() => {
        if (isSuccess && singleUserData) {
            setFieldValue("name", singleUserData.name || "");
            setFieldValue("email", singleUserData.email || "");
            setFieldValue("phone_number", singleUserData.phone_number || "");
            setFieldValue("dob", singleUserData.dob ? singleUserData.dob.split("T")[0] : "");
            setFieldValue("profile_pic", singleUserData.profile_pic || "");
            setFieldValue("designation", singleUserData.designation || "");
            setFieldValue("about", singleUserData.about || "");
            setFieldValue("qualification", singleUserData.qualification || "");
            setFieldValue("gender", singleUserData.gender || "");
            setFieldValue(
                "role_id",
                getRoleId(singleUserData.role_id) || getRoleId(singleUserData.role) || ""
            );
        }
    }, [isSuccess, singleUserData, setFieldValue]);

    if (isLoading || rolesLoading) {
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
                        active="Edit Staff"
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
                                        <Form.Group>
                                            <Form.Label>Profile Picture</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="profile_pic"
                                                onChange={(e) => setFieldValue("profile_pic", e.target.files?.[0])}
                                                onBlur={handleBlur}
                                            />
                                            {values.profile_pic && typeof values.profile_pic === "string" && (
                                                <img src={values.profile_pic} alt="Profile" width={70} height={70} className="mt-2" />
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
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
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Designation</Form.Label>
                                            <Form.Control name="designation" value={values.designation} onChange={handleChange} onBlur={handleBlur} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
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
                                        <Button type="submit">Update Staff</Button>
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
