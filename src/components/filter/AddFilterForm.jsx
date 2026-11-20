import React, { useState } from 'react'
import { Card, Col, Form, Row, Button } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { useAddFiltersMutation, useGetAllFiltersQuery } from '../../redux/features/FiltersAPIEndPoint'
import slugify from 'slugify'
import SunEditor from 'suneditor-react'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { options_for_sunEditor } from '../../commondata/formEditorOptions'
import Loader from '../../layouts/layoutcomponents/loader'
import toast from 'react-hot-toast'
import { useGetLensColorQuery } from '../../redux/features/lensColorAPIEndPoint'
import { useGetAllLensQuery } from '../../redux/features/LensAPIEndPoint'
import { filterValidationSchema } from '../../commondata/formvalidations'


export default function AddFilterForm({ lang }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const typeOptions = [
        { value: 'specs', label: 'Specs' },
        { value: 'sunglass', label: 'Sunglass' }
    ]

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ]

    const { data: lensFilters } = useGetLensColorQuery()
    const lensFiltersData = lensFilters?.data || []

    const lensFiltersOption = Array.isArray(lensFiltersData) && lensFiltersData?.length > 0 ? lensFiltersData?.filter((item) => item.status == true && item.deletedAt == null).map((item) => ({
        label: item.name,
        value: item._id
    })) : []

    const { data: allLensData } = useGetAllLensQuery()
    const lensList = Array.isArray(allLensData?.data) ? allLensData.data : []
    const lensOptions = lensList
        .filter((item) => item?.status == true && !item?.deletedAt)
        .map((item) => ({
            label: item.name,
            value: item._id,
        }))

    const { refetch } = useGetAllFiltersQuery()

    const [addLens, { isLoading: loadingDataAdd }] = useAddFiltersMutation()

    const initialValues = {
        name: "",
        slug: "",
        image: "",
        type: "",
        description: "",
        price: "",
        status: "",
        isFree: false,
        filters: [""],
        isPhotochromic: false,
        lensColor: [],
        lens: [],
        lang: lang,
    }

    const { errors, touched, values, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: filterValidationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    type: values.type || undefined,
                    lens: values.lens || [],
                }
                const resp = await addLens(payload)
                if (resp?.data?.http_status_code === 201) {
                    refetch()
                    toast.success(resp?.data?.message)
                    navigate("/catalogue/lens-type")
                } else {
                    toast.error(resp?.data?.message)
                }
            } catch (err) {
                toast.error(err?.message)
            }
        }
    })

    const handleNameChange = (e) => {
        const name = e.target.value
        handleChange(e)
        setFieldValue('slug', slugify(name, { lower: true, strict: true }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFieldValue('image', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const addFilter = () => {
        setFieldValue('filters', [...values.filters, ''])
    }

    const removeFilter = (index) => {
        const newFilters = values.filters.filter((_, i) => i !== index)
        setFieldValue('filters', newFilters)
    }

    const handleFilterChange = (index, value) => {
        const newFilters = [...values.filters]
        newFilters[index] = value
        setFieldValue('filters', newFilters)
    }

    return (
        <>
            {
                loadingDataAdd && <Loader />
            }
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
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
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.slug}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Type</Form.Label>
                                            <SelectWithDragDrop
                                                options={typeOptions}
                                                name="type"
                                                isClearable
                                                value={typeOptions.find(option => option.value === values.type) || null}
                                                onChange={(option) => setFieldValue('type', option?.value || '')}
                                                onBlur={() => setFieldTouched('type', true)}
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
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lens quality category</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                isClearable
                                                options={lensOptions}
                                                name="lens"
                                                placeholder="Select lens quality category..."
                                                value={lensOptions.filter((option) =>
                                                    (values.lens || []).map(String).includes(String(option.value))
                                                )}
                                                onChange={(options) => setFieldValue('lens', options ? options.map((option) => option.value) : [])}
                                                onBlur={() => setFieldTouched('lens', true)}
                                            />
                                            {touched.lens && errors.lens && (
                                                <div className="invalid-feedback d-block">{errors.lens}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description</Form.Label>
                                            <SunEditor
                                                setContents={values.description}
                                                onChange={(content) => setFieldValue('description', content)}
                                                setOptions={options_for_sunEditor}
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
                                                        onChange={(e) => handleFilterChange(index, e.target.value)}
                                                        className="me-2"
                                                    />
                                                    {
                                                        values?.filters?.length > 1 ? (
                                                            <Button variant="danger" onClick={() => removeFilter(index)}>
                                                                Remove
                                                            </Button>
                                                        ) : null
                                                    }
                                                </div>
                                            ))}

                                            <Button variant="primary" onClick={addFilter}>
                                                Add Filter
                                            </Button>


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
                                                />
                                                {touched.lensColor && errors.lensColor && (
                                                    <div className="invalid-feedback d-block">{errors.lensColor}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    )}
                                </Row>
                                <Row className='justify-content-center'>
                                    <Button type="submit" className='w-auto submit_btn'>Submit</Button>
                                    <Button type="submit" variant="primary" className="submit_btn_full">Submit</Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}