import React, { useEffect } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useGetSingleStaffQuery } from "../../redux/features/staffEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import { useParams } from "react-router-dom";
import { formatRoleName } from "../../utils/permissionOptions";

export default function ViewStaffPermissions() {
    const { id } = useParams();
    const { data: userData, isLoading, isError, error, isSuccess } = useGetSingleStaffQuery(id);

    const singleUserData = userData?.data || null;

    const [displayValues, setDisplayValues] = React.useState({
        name: "",
        email: "",
        phone_number: "",
        dob: "",
        profile_pic: "",
        role_name: "",
        designation: "",
        about: "",
        qualification: "",
        gender: "",
    });

    useEffect(() => {
        if (isSuccess && singleUserData) {
            setDisplayValues({
                name: singleUserData.name || "",
                email: singleUserData.email || "",
                phone_number: singleUserData.phone_number || "",
                dob: singleUserData.dob ? singleUserData.dob.split("T")[0] : "",
                profile_pic: singleUserData.profile_pic || "",
                role_name: formatRoleName(singleUserData.role?.name || singleUserData.role_id?.name),
                designation: singleUserData.designation || "",
                about: singleUserData.about || "",
                qualification: singleUserData.qualification || "",
                gender: singleUserData.gender || "",
            });
        }
    }, [isSuccess, singleUserData]);

    if (isLoading) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    return (
        <>
            <Row>
                <Col>
                    <PageHeader
                        titles="Roles & Permissions"
                        active="View Staff"
                        items={["Home", "Staff"]}
                        links={["/dashboard", "/staff-permissions/staff"]}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Header className="bg-primary text-white fs-4 rounded-3">Staff Details</Card.Header>
                            <Row className="mt-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control value={displayValues.name} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control value={displayValues.phone_number} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>DOB</Form.Label>
                                        <Form.Control value={displayValues.dob} readOnly />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control value={displayValues.email} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control value={displayValues.role_name} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control value={displayValues.gender} readOnly />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control value={displayValues.designation} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Profile Picture</Form.Label>
                                        {displayValues.profile_pic ? (
                                            <div>
                                                <img src={displayValues.profile_pic} alt="Profile" width={90} height={90} />
                                            </div>
                                        ) : (
                                            <Form.Control value="N/A" readOnly />
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>About</Form.Label>
                                        <textarea className="border rounded-3 w-100" value={displayValues.about} readOnly rows={3} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Label>Qualification</Form.Label>
                                    <textarea className="border rounded-3 w-100" value={displayValues.qualification} readOnly rows={3} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
