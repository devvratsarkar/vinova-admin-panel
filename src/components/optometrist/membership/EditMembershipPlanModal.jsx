import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { closeModal } from '../../../redux/slices/allModalSlice'
import { EditMembershipPlanValidation } from '../../../commondata/formvalidations'
import Loader from '../../../layouts/layoutcomponents/loader'
import { useAddMembershipPlanMutation, useUpdateMembershipPlanMutation } from '../../../redux/features/membershipPlanAPIEndPoint'

export default function EditMembershipPlanModal() {
    const { isOpen, componentName, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const isEdit = componentName === 'EditMembershipPlan'
    const [addPlan, { isLoading: adding }] = useAddMembershipPlanMutation()
    const [updatePlan, { isLoading: updating }] = useUpdateMembershipPlanMutation()

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: data?.name || '',
            description: data?.description || '',
            monthly_price: data?.monthly_price ?? '',
            yearly_price: data?.yearly_price ?? '',
            features: Array.isArray(data?.features) ? data.features.join('\n') : (data?.features || ''),
            platform_fee_percentage: data?.platform_fee_percentage ?? 10,
            customer_commission_percentage: data?.customer_commission_percentage ?? 10,
            optometrist_commission_percentage: data?.optometrist_commission_percentage ?? 10,
            is_free: data?.is_free ?? false,
            status: data?.status ?? true,
        },
        validationSchema: EditMembershipPlanValidation,
        onSubmit: async (vals) => {
            const formData = {
                ...vals,
                monthly_price: Number(vals.monthly_price) || 0,
                yearly_price: Number(vals.yearly_price) || 0,
                platform_fee_percentage: Number(vals.platform_fee_percentage) || 0,
                customer_commission_percentage: Number(vals.customer_commission_percentage) || 0,
                optometrist_commission_percentage: Number(vals.optometrist_commission_percentage) || 0,
            }
            const res = isEdit
                ? await updatePlan({ id: data?._id || data?.id, formData })
                : await addPlan(formData)

            if (res?.data?.http_status_code === 200 || res?.data?.http_status_code === 201) {
                toast.success(res.data.message)
                dispatch(closeModal())
            }
        },
    })

    return (
        <Modal show={isOpen} onHide={() => dispatch(closeModal())} centered scrollable size="lg">
            {(adding || updating) && <Loader />}
            <Modal.Header className="justify-content-center mx-2">
                <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                    {isEdit ? 'Edit Membership Plan' : 'Add Membership Plan'}
                </Modal.Title>
            </Modal.Header>
            <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="">
                <i className="fe fe-x fw-bolder"></i>
            </Button>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Plan name <span className="required_icon">*</span></Form.Label>
                        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
                        {errors.name && touched.name && <p className="error">{errors.name}</p>}
                    </Form.Group>
                    <Form.Check className="mb-3" type="checkbox" name="is_free" label="Free plan" checked={values.is_free} onChange={handleChange} />
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={2} name="description" value={values.description} onChange={handleChange} onBlur={handleBlur} />
                    </Form.Group>
                    {!values.is_free && (
                        <div className="p-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 12 }}>
                            <div className="fw-semibold mb-3">Pricing</div>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Monthly price ($) <span className="required_icon">*</span></Form.Label>
                                        <Form.Control type="number" min={0} name="monthly_price" value={values.monthly_price} onChange={handleChange} onBlur={handleBlur} />
                                        {errors.monthly_price && touched.monthly_price && <p className="error">{errors.monthly_price}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Yearly price ($) <span className="required_icon">*</span></Form.Label>
                                        <Form.Control type="number" min={0} max={Number(values.monthly_price) * 12 || undefined} name="yearly_price" value={values.yearly_price} onChange={handleChange} onBlur={handleBlur} />
                                        {values.monthly_price !== '' && <Form.Text className="text-muted">Max {Number(values.monthly_price) * 12} (12 × monthly)</Form.Text>}
                                        {errors.yearly_price && touched.yearly_price && <p className="error">{errors.yearly_price}</p>}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    )}
                    <div className="p-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 12 }}>
                        <div className="fw-semibold mb-3">Commission</div>
                        <Row>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Platform fee % <span className="required_icon">*</span></Form.Label>
                                    <Form.Control type="number" min={0} max={100} name="platform_fee_percentage" value={values.platform_fee_percentage} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.platform_fee_percentage && touched.platform_fee_percentage && <p className="error">{errors.platform_fee_percentage}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Give % (customer) <span className="required_icon">*</span></Form.Label>
                                    <Form.Control type="number" min={0} max={100} name="customer_commission_percentage" value={values.customer_commission_percentage} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.customer_commission_percentage && touched.customer_commission_percentage && <p className="error">{errors.customer_commission_percentage}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Take % (optometrist) <span className="required_icon">*</span></Form.Label>
                                    <Form.Control type="number" min={0} max={100} name="optometrist_commission_percentage" value={values.optometrist_commission_percentage} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.optometrist_commission_percentage && touched.optometrist_commission_percentage && <p className="error">{errors.optometrist_commission_percentage}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Features <span className="required_icon">*</span></Form.Label>
                        <Form.Control as="textarea" rows={3} name="features" value={values.features} onChange={handleChange} onBlur={handleBlur} placeholder="One feature per line" />
                        <Form.Text className="text-muted">Enter one feature per line.</Form.Text>
                        {errors.features && touched.features && <p className="error">{errors.features}</p>}
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="light" type="button" onClick={() => dispatch(closeModal())}>Cancel</Button>
                        <Button variant="primary" type="submit">{isEdit ? 'Save' : 'Add plan'}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
