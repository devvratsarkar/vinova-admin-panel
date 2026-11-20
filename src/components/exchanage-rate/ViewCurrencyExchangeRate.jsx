import React, { useEffect } from 'react';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectWithDragDrop from '../common/SelectWithDragDrop';
import { useGetExchangeRateByIdQuery } from '../../redux/features/exchangeRateAPIEndPoint';
import { currencExchangeRateValidationSchema } from '../../commondata/formvalidations';
import toast from 'react-hot-toast';
import Loader from '../../layouts/layoutcomponents/loader';
import { useGetAllCurrenciesQuery } from '../../redux/features/currencyCountryAPIEndPoint';

export default function ViewCurrencyExchangeRate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: currencies } = useGetAllCurrenciesQuery();
    const { data, isLoading: singleDataLoading, refetch: singleDataRefetch, isSuccess } = useGetExchangeRateByIdQuery(id);
    const singleExchangeRateData = data?.data || null;

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

    const { values, errors, touched, handleBlur, handleChange, setFieldValue } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            // No submission logic needed for view-only mode
        }
    });

    useEffect(() => {
        if (singleExchangeRateData) {
            setFieldValue("base_currency", singleExchangeRateData?.base_currency);
            setFieldValue("target_currency", singleExchangeRateData?.target_currency);
            setFieldValue("rate", singleExchangeRateData?.rate);
            setFieldValue("status", singleExchangeRateData?.status);
        }
    }, [singleExchangeRateData, setFieldValue, isSuccess]);

    return (
        <>
            {singleDataLoading && <Loader />}
            <Row>
                <Col md={6}>
                    <PageHeader
                        titles="Exchange Rate"
                        active="View Exchange Rate"
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
                            <Form>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3">
                                        <Form.Label>Base Currency</Form.Label>
                                        <SelectWithDragDrop
                                            options={currencyOptions}
                                            name="base_currency"
                                            value={currencyOptions.find(option => option.value === values.base_currency)}
                                            onChange={(option) => setFieldValue('base_currency', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            placeholder="Select base currency"
                                            isDisabled
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
                                            value={currencyOptions.find(option => option.value === values.target_currency)}
                                            onChange={(option) => setFieldValue('target_currency', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            placeholder="Select target currency"
                                            isDisabled
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
                                            placeholder="Enter exchange rate (e.g., 1.23)"
                                            step="0.0001"
                                            disabled
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
                                            value={statusOptions.find(option => option.value === values.status)}
                                            onChange={(option) => setFieldValue('status', option.value)}
                                            onBlur={handleBlur}
                                            isSearchable
                                            placeholder="Select status"
                                            isDisabled
                                            className={touched.status && errors.status ? 'is-invalid' : ''}
                                        />
                                        {touched.status && errors.status && (
                                            <div className="invalid-feedback d-block">{errors.status}</div>
                                        )}
                                    </Form.Group>
                                </Row>

                                <div className="d-flex justify-content-center gap-2">
                                    <Link to="/currency-exchange-rate-list" className="btn btn-secondary">
                                        Back
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}