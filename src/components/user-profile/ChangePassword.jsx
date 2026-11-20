import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { AdminProfileValidation, ChangePasswordValidation } from '../../commondata/formvalidations';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/allModalSlice';
import { useFormik } from 'formik';
import Loader from '../../layouts/layoutcomponents/loader';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useChangePasswordMutation } from '../../redux/features/userProfileAPIEndPoint';
import { useChangeOptometristPasswordMutation } from '../../redux/features/optometristAPIEndPoint';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isOptometrist = localStorage.getItem("role") === "Optometrist"
    const [changeAdminPassword, { isLoading: adminLoading }] = useChangePasswordMutation()
    const [changeOptometristPassword, { isLoading: optometristLoading }] = useChangeOptometristPasswordMutation()
    const changePassword = isOptometrist ? changeOptometristPassword : changeAdminPassword
    const loading = isOptometrist ? optometristLoading : adminLoading
    const { isOpen } = useSelector((state) => state.allCommonModal);
    const dispatch = useDispatch()
    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
    const toggleOldPasswordVisibility = () => {
        setOldPassword(!oldPassword);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: ChangePasswordValidation,
        onSubmit: async (values) => {

            try {
                const response = await changePassword(values);
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message)
                    dispatch(closeModal())
                }
            } catch (error) {
                return null
            }

        },
    });
    return (
        <>
            {loading && <Loader />}
            <Modal show={isOpen} size=''>
                <Modal.Header>
                    <Modal.Title className='fs-3 p-0 mb-0'>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col as={Col} md={12}>
                                <Form.Group>
                                    <Form.Label>Old Password <span className='text-danger'>*</span></Form.Label>
                                    <div className="input-icon">
                                        <span
                                            className="input-icon-addon pe-auto"
                                            style={{ cursor: "pointer" }}
                                            onClick={toggleOldPasswordVisibility}
                                        >
                                            {oldPassword ? (
                                                <FiEyeOff size={20} />
                                            ) : (
                                                <FiEye size={20} />
                                            )}
                                        </span>
                                        <input
                                            type={oldPassword ? "text" : "password"}
                                            name="oldPassword"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.oldPassword}
                                        />
                                    </div>
                                    {
                                        errors.oldPassword && touched.oldPassword ? (
                                            <p className='text-danger'>{errors.oldPassword}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={12}>
                                <Form.Group>
                                    <Form.Label>Password <span className='text-danger'>*</span></Form.Label>
                                    <div className="input-icon">
                                        <span
                                            className="input-icon-addon pe-auto"
                                            style={{ cursor: "pointer" }}
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <FiEyeOff size={20} />
                                            ) : (
                                                <FiEye size={20} />
                                            )}
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.newPassword}
                                        />
                                    </div>
                                    {
                                        errors.newPassword && touched.newPassword ? (
                                            <p className='text-danger'>{errors.newPassword}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={12}>
                                <Form.Group>
                                    <Form.Label>Confirm Password <span className='text-danger'>*</span></Form.Label>
                                    <div className="input-icon">
                                        <span
                                            className="input-icon-addon pe-auto"
                                            style={{ cursor: "pointer" }}
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? (
                                                <FiEyeOff size={20} />
                                            ) : (
                                                <FiEye size={20} />
                                            )}
                                        </span>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.confirmPassword}
                                        />
                                    </div>
                                    {
                                        errors.confirmPassword && touched.confirmPassword ? (
                                            <p className='text-danger'>{errors.confirmPassword}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-4 gap-5' >
                            <Col className='text-end'>
                                <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                                    Cancel
                                </Button>
                                &nbsp;
                                <Button type='submit' className="btn btn-primary" variant="primary">
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}