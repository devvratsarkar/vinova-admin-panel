import React from 'react';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import SelectWithDragDrop from '../common/SelectWithDragDrop';
import { useCreateExchangeRateMutation } from '../../redux/features/exchangeRateAPIEndPoint';
import { currencExchangeRateValidationSchema } from '../../commondata/formvalidations';
import toast from 'react-hot-toast';
import { useGetAllCurrenciesQuery } from '../../redux/features/currencyCountryAPIEndPoint';

export default function AddCurrencyExchangeRate() {
    const navigate = useNavigate();
    const { data: currencies } = useGetAllCurrenciesQuery();
    const { refetch } = useGetAllCurrenciesQuery();
    const [createExchangeRate, { isLoading }] = useCreateExchangeRateMutation();

    const currencyData = currencies?.data || [];

    const currencyOptions = Array.isArray(currencyData) && currencyData.length > 0
        ? currencyData
            .filter((item) => item.status === true)
            .map((item) => ({
                value: item?._id,
                label: `${item?.name} (${item?.code})`
            }))
        : [];

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ];

    const initialValues = {
        base_currency: "",
        target_currency: "",
        rate: "",
        status: ""
    };

    const validationSchema = currencExchangeRateValidationSchema;

    const { values, errors, touched, handleSubmit, handleBlur, handleChange, setFieldValue } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const resp = await createExchangeRate(values);
                if (resp?.data?.http_status_code === 201) {
                    refetch();
                    toast.success(resp?.data?.message || 'Exchange rate created successfully');
                    navigate("/currency-exchange-rate-list");
                } else {
                    toast.error(resp?.data?.message || 'Failed to create exchange rate');
                }
            } catch (error) {
                toast.error('Failed to create exchange rate');
                console.error('Failed to create exchange rate:', error);
            }
        }
    });

    return (
        <>
            <Row>
                <Col md={6}>
                    <PageHeader
                        titles="Exchange Rate"
                        active="Add Exchange Rate"
                        items={["Home", "Exchange Rate List"]}
                        links={["/dashboards", "/currency-exchange-rate-list"]}
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
                                        <Form.Label>Base Currency</Form.Label>
                                        <SelectWithDragDrop
                                            options={currencyOptions}
                                            name="base_currency"
                                            onChange={(option) => setFieldValue('base_currency', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            className={touched.base_currency && errors.base_currency ? 'is-invalid' : ''}
                                        />
                                        {touched.base_currency && errors.base_currency && (
                                            <div className="invalid-feedback d-block">{errors.base_currency}</div>
                                        )}
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Target Currency</Form.Label>
                                        <SelectWithDragDrop
                                            options={currencyOptions.filter(option => option.value !== values.base_currency)}
                                            name="target_currency"
                                            onChange={(option) => setFieldValue('target_currency', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            className={touched.target_currency && errors.target_currency ? 'is-invalid' : ''}
                                        />
                                        {touched.target_currency && errors.target_currency && (
                                            <div className="invalid-feedback d-block">{errors.target_currency}</div>
                                        )}
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Exchange Rate</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="rate"
                                            value={values.rate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.rate && !!errors.rate}
                                            step="0.0001"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.rate}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <SelectWithDragDrop
                                            options={statusOptions}
                                            name="status"
                                            onChange={(option) => setFieldValue('status', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            className={touched.status && errors.status ? 'is-invalid' : ''}
                                        />
                                        {touched.status && errors.status && (
                                            <div className="invalid-feedback d-block">{errors.status}</div>
                                        )}
                                    </Form.Group>
                                </Row>

                                <div className="d-flex justify-content-center gap-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}