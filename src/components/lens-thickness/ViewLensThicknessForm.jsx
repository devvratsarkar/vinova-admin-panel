import React, { useEffect } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { useGetAllFiltersQuery } from '../../redux/features/FiltersAPIEndPoint'
import slugify from 'slugify'
import SunEditor from 'suneditor-react'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import { lensThicknessValidationSchema } from '../../commondata/formvalidations'
import { options_for_sunEditor } from '../../commondata/formEditorOptions'
import Loader from '../../layouts/layoutcomponents/loader'
import { useGetSingleLensThicknessQuery } from '../../redux/features/lensThicknessAPIEndPoint'

const getId = (value) => {
    if (!value) return null
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value._id) return value._id
    return String(value)
}

export default function ViewLensThicknessForm() {
    const { id } = useParams()

    const { data: singleData, isLoading, isSuccess } = useGetSingleLensThicknessQuery(id)

    const singleLensData = singleData?.data || null

    const rawLens = singleLensData?.lens
    const selectedLens = Array.isArray(rawLens) ? rawLens : rawLens ? [rawLens] : []
    const savedLensPrices = Array.isArray(singleLensData?.lensPrices) ? singleLensData.lensPrices : []
    const lensNames = selectedLens.map((item) => item?.name).filter(Boolean).join(', ')
    const lensPriceRows = selectedLens.map((item) => {
        const saved = savedLensPrices.find((priceItem) => getId(priceItem?.lens) === getId(item))
        return {
            id: getId(item),
            name: item?.name || '',
            price: saved?.price ?? singleLensData?.price ?? '',
        }
    })

    const typeOptions = [
        { value: 'specs', label: 'Specs' },
        { value: 'sunglass', label: 'Sunglass' }
    ]

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ]

    const { data: filtersResponse } = useGetAllFiltersQuery()
    const filterList = Array.isArray(filtersResponse?.data) ? filtersResponse.data : []
    const lensFilterOptions = filterList
        .filter((item) => item?.status == true && !item?.deletedAt)
        .map((item) => ({
            label: item.name,
            value: item._id,
        }))

    const initialValues = {
        name: "",
        slug: "",
        type: [],
        description: "",
        isFree: false,
        status: "",
        filters: [""],
        lensFilters: [],
    }

    const { errors, touched, values, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: lensThicknessValidationSchema,
        onSubmit: async () => { }
    })

    const handleNameChange = (e) => {
        const name = e.target.value
        handleChange(e)
        setFieldValue('slug', slugify(name, { lower: true, strict: true }))
    }


    useEffect(() => {
        if (singleLensData) {
            const selectedLensFilterIds = Array.isArray(singleLensData?.lensFilters)
                ? singleLensData.lensFilters.map(getId).filter(Boolean)
                : []

            setFieldValue("name", singleLensData?.name || "")
            setFieldValue("status", singleLensData?.status ?? "")
            setFieldValue("slug", singleLensData?.slug || "")
            setFieldValue("description", singleLensData?.description || "")
            setFieldValue("isFree", singleLensData?.isFree || false)
            setFieldValue("type", singleLensData?.type || [])
            setFieldValue("filters", Array.isArray(singleLensData?.filters) ? singleLensData.filters : [""])
            setFieldValue("lensFilters", selectedLensFilterIds)
        }
    }, [singleLensData, isSuccess, setFieldValue])

    return (
        <>
            {
                isLoading && <Loader />
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
                                                isMulti
                                                options={typeOptions}
                                                name="type"
                                                value={values.type.map(id => typeOptions.find(opt => opt.value === id)).filter(Boolean)}
                                                onChange={(options) => setFieldValue('type', options.map(option => option.value))}
                                                onBlur={() => setFieldTouched('type', true)}
                                                isDisabled
                                            />
                                            {touched.type && errors.type && (
                                                <div className="invalid-feedback d-block">{errors.type}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lens quality category<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={lensNames}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="d-flex align-items-center">
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                id="isFree"
                                                label="Is Free"
                                                name="isFree"
                                                checked={values.isFree}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price by lens quality category<span className='text-danger'>*</span></Form.Label>
                                            <Row>
                                                {lensPriceRows.map((item) => (
                                                    <Col md={4} key={item.id} className="mb-2">
                                                        <Form.Label className="text-muted">{item.name}</Form.Label>
                                                        <Form.Control type="number" value={item.price} disabled />
                                                    </Col>
                                                ))}
                                            </Row>
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
                                            <Form.Label>Coating</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                isClearable
                                                options={lensFilterOptions}
                                                name="lensFilters"
                                                placeholder="Select coating..."
                                                value={lensFilterOptions.filter((option) =>
                                                    (values.lensFilters || []).map(String).includes(String(option.value))
                                                )}
                                                onChange={(options) =>
                                                    setFieldValue(
                                                        'lensFilters',
                                                        options ? options.map((option) => option.value) : []
                                                    )
                                                }
                                                onBlur={() => setFieldTouched('lensFilters', true)}
                                                isDisabled
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Filters<span className='text-danger'>*</span></Form.Label>
                                            {values?.filters.map((filter, index) => (
                                                <div key={index} className="d-flex mb-2">
                                                    <Form.Control
                                                        type="text"
                                                        value={filter}
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
                                </Row>
                                {/* <Row className='justify-content-center'>
                                    <Button type="submit" className='w-auto'>
                                        Submit
                                    </Button>
                                </Row> */}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}