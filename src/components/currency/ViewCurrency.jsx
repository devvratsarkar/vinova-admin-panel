import React, { useEffect } from 'react';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectWithDragDrop from '../common/SelectWithDragDrop';
import { useCreateCurrencyMutation, useGetAllCoutriesQuery, useGetAllCurrenciesQuery, useGetCurrencyByIdQuery, useUpdateCurrencyMutation } from '../../redux/features/currencyCountryAPIEndPoint';
import { currencValidationSchema } from '../../commondata/formvalidations';
import toast from 'react-hot-toast';
import Loader from '../../layouts/layoutcomponents/loader';

export default function ViewCurrency() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: country } = useGetAllCoutriesQuery();
    const { data, isLoading: singleDataLoading, refetch: singleDataRefetch, isSuccess } = useGetCurrencyByIdQuery(id)
    const singleCurrencyData = data?.data || null
    const { refetch } = useGetAllCurrenciesQuery()
    const [createCurrency, { isLoading }] = useUpdateCurrencyMutation();
    const countryData = country?.data || [];

    const countryOptions = Array.isArray(countryData) && countryData.length > 0
        ? countryData
            .filter((item) => item.status === true)
            .map((item) => ({
                value: item?._id,
                label: item?.name
            }))
        : [];

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ];

    const initialValues = {
        name: "",
        code: "",
        symbol: "",
        country_id: "",
        status: ""
    };


    const { values, errors, touched, handleSubmit, handleBlur, handleChange, setFieldValue } = useFormik({
        initialValues,
        validationSchema: currencValidationSchema,
        onSubmit: async (values) => {
            try {
                console.log("values", values)
                // const resp = await createCurrency({ id: id, formData: values });
                // if (resp?.data?.http_status_code === 200) {
                //     refetch()
                //     toast.success(resp?.data?.message)
                //     navigate("/currency-list")
                // } else {
                //     toast.error(resp?.data?.message)
                // }

            } catch (error) {
                console.error('Failed to create currency:', error);
            }
        }
    });


    useEffect(() => {
        if (singleCurrencyData) {
            setFieldValue("name", singleCurrencyData?.name)
            setFieldValue("code", singleCurrencyData?.code)
            setFieldValue("symbol", singleCurrencyData?.symbol)
            setFieldValue("country_id", singleCurrencyData?.country_id)
            setFieldValue("status", singleCurrencyData?.status)
        }
    }, [singleCurrencyData, setFieldValue, isSuccess])

    return (
        <>
            {
                (isLoading || singleDataLoading) && <Loader />
            }
            <Row>
                <Col md={6}>
                    <PageHeader
                        titles="Currency"
                        active="View Currency"
                        items={["Home", "Currency List"]}
                        links={["/dashboards", "/currency-list"]}
                    />
                </Col>
                <Col md={6}></Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Currency Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.name && !!errors.name}
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Currency Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="code"
                                            value={values.code}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.code && !!errors.code}
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.code}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Currency Symbol</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="symbol"
                                            value={values.symbol}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.symbol && !!errors.symbol}
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.symbol}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <SelectWithDragDrop
                                            options={countryOptions}
                                            name="country_id"
                                            value={countryOptions.find(option => option.value === values.country_id)}
                                            onChange={(option) => setFieldValue('country_id', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            className={touched.country_id && errors.country_id ? 'is-invalid' : ''}
                                            isDisabled
                                        />
                                        {touched.country_id && errors.country_id && (
                                            <div className="invalid-feedback d-block">{errors.country_id}</div>
                                        )}
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <SelectWithDragDrop
                                            options={statusOptions}
                                            name="status"
                                            value={statusOptions.find(option => option.value === values.status)}
                                            onChange={(option) => setFieldValue('status', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            className={touched.status && errors.status ? 'is-invalid' : ''}
                                            isDisabled
                                        />
                                        {touched.status && errors.status && (
                                            <div className="invalid-feedback d-block">{errors.status}</div>
                                        )}
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}