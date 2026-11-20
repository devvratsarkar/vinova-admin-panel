import React from 'react'
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Country, State } from 'country-state-city'
import { closeModal } from '../../../redux/slices/allModalSlice'
import { EditOptometristEnquiryValidation } from '../../../commondata/formvalidations'
import Loader from '../../../layouts/layoutcomponents/loader'
import { useGetAllMembershipPlansQuery } from '../../../redux/features/membershipPlanAPIEndPoint'
import { useUpdateOptometristMutation } from '../../../redux/features/optometristEnquiryAPIEndPoint'

const IRAN_CODE = 'IR'
const CURRENCY_CODE = 'IRR'
const IRAN_NAME = Country.getCountryByCode(IRAN_CODE)?.name || 'Iran'
const IRAN_DIAL = '۹۸'
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const countries = Country.getAllCountries()

const toEnglishDigits = (value = '') =>
    String(value).replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))

const toIranianDigits = (value = '') =>
    toEnglishDigits(value).replace(/\d/g, (d) => PERSIAN_DIGITS[d])

const localIranPhone = (phone = '') =>
    toIranianDigits(toEnglishDigits(phone).replace(/^\+?98\s*/, '')).replace(/[^۰-۹]/g, '').slice(0, 11)

export default function EditOptometristEnquiryModal() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const { data: plansRes } = useGetAllMembershipPlansQuery()
    const plans = plansRes?.data || []
    const [updateOptometrist, { isLoading }] = useUpdateOptometristMutation()
    const states = State.getStatesOfCountry(IRAN_CODE)


    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            phone_number: localIranPhone(data?.phone_number),
            plan: data?.plan?._id || '',
            plan_type: data?.plan_type || '',
            store_name: data?.store_name || '',
            country_code: IRAN_CODE,
            state: data?.state_code || '',
            address: data?.address || '',
            lat: data?.lat ?? '',
            lng: data?.lng ?? '',
        },
        validationSchema: EditOptometristEnquiryValidation,
        onSubmit: async (vals) => {
            const selectedState = states.find((s) => s.isoCode === vals.state)
            const formData = {
                ...vals,
                country: IRAN_NAME,
                country_code: IRAN_CODE,
                currency_code: CURRENCY_CODE,
                phone_number: `+${toEnglishDigits(IRAN_DIAL)} ${toEnglishDigits(vals.phone_number ?? '')}`,
                state: selectedState?.name || vals.state,
                state_code: selectedState?.isoCode || vals.state,
                lat: vals.lat === '' || vals.lat === null || vals.lat === undefined ? undefined : Number(vals.lat),
                lng: vals.lng === '' || vals.lng === null || vals.lng === undefined ? undefined : Number(vals.lng),
            }
            const res = await updateOptometrist({ id: data?._id, formData })
            if (res?.data?.http_status_code === 200) {
                toast.success(res.data.message)
                dispatch(closeModal())
            }
        },
    })

    const handleIranPhoneChange = (e) => {
        const value = toIranianDigits(e.target.value).replace(/[^۰-۹]/g, '').slice(0, 11)
        setFieldValue('phone_number', value)
    }

    return (
        <Modal show={isOpen} onHide={() => dispatch(closeModal())} centered scrollable>
            {isLoading && <Loader />}
            <Modal.Header className="justify-content-center mx-2">
                <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Edit Optometrist</Modal.Title>
            </Modal.Header>
            <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="">
                <i className="fe fe-x fw-bolder"></i>
            </Button>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name <span className="required_icon">*</span></Form.Label>
                                <Form.Control type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
                                {errors.name && touched.name && <p className="error">{errors.name}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone number <span className="required_icon">*</span></Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <span className="me-1">🇮🇷</span>
                                        +۹۸
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        name="phone_number"
                                        inputMode="numeric"
                                        maxLength={11}
                                        dir="ltr"
                                        placeholder="Enter phone number"
                                        value={values.phone_number}
                                        onChange={handleIranPhoneChange}
                                        onBlur={handleBlur}
                                    />
                                </InputGroup>
                                {errors.phone_number && touched.phone_number && <p className="error">{errors.phone_number}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email <span className="required_icon">*</span></Form.Label>
                                <Form.Control type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                                {errors.email && touched.email && <p className="error">{errors.email}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Store name <span className="required_icon">*</span></Form.Label>
                                <Form.Control type="text" name="store_name" value={values.store_name} onChange={handleChange} onBlur={handleBlur} />
                                {errors.store_name && touched.store_name && <p className="error">{errors.store_name}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Country <span className="required_icon">*</span></Form.Label>
                                <Form.Select name="country_code" value={IRAN_CODE} disabled>
                                    {countries.map((country) => (
                                        <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>State <span className="required_icon">*</span></Form.Label>
                                <Form.Select name="state" value={values.state} onChange={handleChange} onBlur={handleBlur}>
                                    <option value="">Select</option>
                                    {states.map((state) => (
                                        <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.state && touched.state && <p className="error">{errors.state}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Address <span className="required_icon">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Enter address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.address && touched.address && <p className="error">{errors.address}</p>}
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    name="lat"
                                    placeholder="Enter latitude"
                                    value={values.lat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.lat && touched.lat && <p className="error">{errors.lat}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    name="lng"
                                    placeholder="Enter longitude"
                                    value={values.lng}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.lng && touched.lng && <p className="error">{errors.lng}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Plan <span className="required_icon">*</span></Form.Label>
                                <Form.Select name="plan" value={values.plan} onChange={handleChange} onBlur={handleBlur}>
                                    <option value="">Select</option>
                                    {plans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>{plan.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.plan && touched.plan && <p className="error">{errors.plan}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Plan type <span className="required_icon">*</span></Form.Label>
                                <Form.Select name="plan_type" value={values.plan_type} onChange={handleChange} onBlur={handleBlur}>
                                    <option value="">Select</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                </Form.Select>
                                {errors.plan_type && touched.plan_type && <p className="error">{errors.plan_type}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="light" type="button" onClick={() => dispatch(closeModal())}>Cancel</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
