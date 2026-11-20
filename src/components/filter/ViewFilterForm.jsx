import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { useGetSingleFilterQuery, useGetAllFiltersQuery } from '../../redux/features/FiltersAPIEndPoint'
import slugify from 'slugify'
import SunEditor from 'suneditor-react'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { openModal } from '../../redux/slices/allModalSlice'
import * as Yup from 'yup'
import { options_for_sunEditor } from '../../commondata/formEditorOptions'
import Loader from '../../layouts/layoutcomponents/loader'
import { useGetLensColorQuery } from '../../redux/features/lensColorAPIEndPoint'

export default function ViewFilterForm({ lang }) {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: singleData, isLoading, isSuccess } = useGetSingleFilterQuery(id)
    const singleFilterData = singleData?.data || null

    const { data: lensFilters } = useGetLensColorQuery()
    const lensFiltersData = lensFilters?.data || []

    const lensFiltersOption = Array.isArray(lensFiltersData) && lensFiltersData?.length > 0 ? lensFiltersData?.filter((item) => item.status == true && item.deletedAt == null).map((item) => ({
        label: item.name,
        value: item._id
    })) : []

    const typeOptions = [
        { value: 'specs', label: 'Specs' },
        { value: 'sunglass', label: 'Sunglass' }
    ]

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ]

    const filterValidationSchema = Yup.object({
        name: Yup.string().required("Name Field is Required"),
        slug: Yup.string().required("Slug Field is Required"),
        type: Yup.string().required("Type Field is Required"),
        price: Yup.string().required("Price Field is Required"),
        status: Yup.boolean().required("Status Field is Required"),
        filters: Yup.array().min(1, "At least one filter is required").required("Filters Field is Required"),
        isPhotochromic: Yup.boolean().required("Photochromic Field is Required"),
        lensColor: Yup.array().when('isPhotochromic', {
            is: true,
            then: Yup.array().min(1, "At least one lens color is required when photochromic is enabled").required("Lens Color is Required"),
            otherwise: Yup.array().notRequired()
        })
    })

    const initialValues = {
        name: "",
        slug: "",
        type: "",
        description: "",
        price: "",
        status: "",
        filters: [""],
        isPhotochromic: false,
        isFree: false,
        lensColor: []
    }

    const { errors, touched, values, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: filterValidationSchema,
        onSubmit: () => {
            // No submit action needed for view-only form
        }
    })

    const handleNameChange = (e) => {
        const name = e.target.value
        handleChange(e)
        setFieldValue('slug', slugify(name, { lower: true, strict: true }))
    }

    useEffect(() => {
        if (singleFilterData) {
            setFieldValue("name", singleFilterData?.name || "")
            setFieldValue("slug", singleFilterData?.slug || "")
            setFieldValue("type", singleFilterData?.type || "")
            setFieldValue("description", singleFilterData?.description || "")
            setFieldValue("price", singleFilterData?.price || "")
            setFieldValue("status", singleFilterData?.status || false)
            setFieldValue("filters", singleFilterData?.filters?.length > 0 ? singleFilterData.filters : [""])
            setFieldValue("isPhotochromic", singleFilterData?.isPhotochromic || false)
            setFieldValue("lensColor", singleFilterData?.lensColor || [])
            setFieldValue("isFree", singleFilterData?.isFree || false)
        }
    }, [singleFilterData, isSuccess, setFieldValue])

    return (
        <>
            {isLoading && <Loader />}
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleNameChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.name && errors.name}
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Slug<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="slug"
                                                value={values.slug}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.slug && errors?.slug}
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.slug}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Type<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={typeOptions}
                                                name="type"
                                                value={typeOptions.find(option => option.value === values.type)}
                                                onChange={(option) => setFieldValue('type', option.value)}
                                                onBlur={() => setFieldTouched('type', true)}
                                                isDisabled
                                            />
                                            {touched.type && errors.type && (
                                                <div className="invalid-feedback d-block">{errors.type}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className='text-left'>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Is Free</Form.Label>
                                            <Form.Check
                                                type="checkbox"
                                                name="isFree"
                                                checked={values.isFree}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className='check_input'
                                                readOnly
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description</Form.Label>
                                            <SunEditor
                                                setContents={values.description}
                                                onChange={(content) => setFieldValue('description', content)}
                                                setOptions={options_for_sunEditor}
                                                disable
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={values.price}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.price && errors.price}
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.price}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={statusOptions}
                                                name="status"
                                                value={statusOptions.find(option => option.value === values.status)}
                                                onChange={(option) => setFieldValue('status', option.value)}
                                                onBlur={() => setFieldTouched('status', true)}
                                                isDisabled
                                            />
                                            {touched.status && errors.status && (
                                                <div className="invalid-feedback d-block">{errors.status}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Filters<span className='text-danger'>*</span></Form.Label>
                                            {values.filters.map((filter, index) => (
                                                <div key={index} className="d-flex mb-2">
                                                    <Form.Control
                                                        type="text"
                                                        value={filter}
                                                        onChange={(e) => { }}
                                                        className="me-2"
                                                        disabled
                                                    />
                                                </div>
                                            ))}
                                            {touched.filters && errors.filters && (
                                                <div className="text-danger">{errors.filters}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Is Photochromic"
                                                name="isPhotochromic"
                                                checked={values.isPhotochromic}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled
                                            />
                                            {touched.isPhotochromic && errors.isPhotochromic && (
                                                <div className="invalid-feedback d-block">{errors.isPhotochromic}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    {values.isPhotochromic && (
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Lens Color<span className='text-danger'>*</span></Form.Label>
                                                <SelectWithDragDrop
                                                    isMulti
                                                    options={lensFiltersOption}
                                                    name="lensColor"
                                                    value={values.lensColor.map(id => lensFiltersOption.find(opt => opt.value === id)).filter(Boolean)}
                                                    onChange={(options) => setFieldValue('lensColor', options.map(option => option.value))}
                                                    onBlur={() => setFieldTouched('lensColor', true)}
                                                    isDisabled
                                                />
                                                {touched.lensColor && errors.lensColor && (
                                                    <div className="invalid-feedback d-block">{errors.lensColor}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    )}
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}