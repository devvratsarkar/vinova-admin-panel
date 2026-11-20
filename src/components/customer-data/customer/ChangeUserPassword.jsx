import React, { useState } from 'react'
import { Button, Form, Modal, Row, InputGroup } from 'react-bootstrap'
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changePasssowrdValidation } from '../../../commondata/formvalidations';
import { closeModal } from '../../../redux/slices/allModalSlice';
import Loader from '../../../layouts/layoutcomponents/loader';
import { useChangeCustomerPasswordMutation } from '../../../redux/features/postApiSecond';

export default function ChangeUserPassword() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const [changeCustomerPassword, { isLoading }] = useChangeCustomerPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initialValues = {
        id: data?.id || '',
        password: "",
        confirm_password: "",
    }

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: changePasssowrdValidation,
        onSubmit: async (values) => {
            try {
                const response = await changeCustomerPassword(values);
                if (response?.data?.http_status_code === 200) {
                    dispatch(closeModal())
                    resetForm();
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
            <Modal.Header className='bg-primary'>
                <Modal.Title className='text-white'>Change User Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <Loader />}
                <Form onSubmit={handleSubmit}>
                    {/* Password Field */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Password <span className='text-danger'>*</span></Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter new password"
                            />
                            <Button
                                variant=""
                                onClick={togglePasswordVisibility}
                                className='border'
                            >
                                <i className={`fe fe-${showPassword ? 'eye-off' : 'eye'}`}></i>
                            </Button>
                        </InputGroup>
                        {errors.password && touched.password ? (
                            <p className='text-danger mt-1'>{errors.password}</p>
                        ) : null}
                    </Form.Group>

                    {/* Confirm Password Field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password <span className='text-danger'>*</span></Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                value={values.confirm_password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Confirm new password"
                            />
                            <Button
                                variant=""
                                onClick={toggleConfirmPasswordVisibility}
                                className='border'
                            >
                                <i className={`fe fe-${showConfirmPassword ? 'eye-off' : 'eye'}`}></i>
                            </Button>
                        </InputGroup>
                        {errors.confirm_password && touched.confirm_password ? (
                            <p className='text-danger mt-1'>{errors.confirm_password}</p>
                        ) : null}
                    </Form.Group>

                    <Row className='justify-content-end mt-4 gap-2 px-3'>
                        <Button
                            className="btn btn-outline-default cancel_button w-auto"
                            variant=""
                            onClick={() => {
                                dispatch(closeModal());
                                resetForm();
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='w-auto'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}