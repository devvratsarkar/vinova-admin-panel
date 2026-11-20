import React, { useEffect } from 'react'
import { Card, Col, Form, Row, Button } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { useGetAllFiltersQuery } from '../../redux/features/FiltersAPIEndPoint'
import slugify from 'slugify'
import SunEditor from 'suneditor-react'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { lensThicknessValidationSchema } from '../../commondata/formvalidations'
import { options_for_sunEditor } from '../../commondata/formEditorOptions'
import Loader from '../../layouts/layoutcomponents/loader'
import toast from 'react-hot-toast'
import { useGetAllLensThicknessQuery, useGetSingleLensThicknessQuery, useUpdateLensThicknessMutation } from '../../redux/features/lensThicknessAPIEndPoint'
import { useGetAllLensQuery } from '../../redux/features/LensAPIEndPoint'

const getId = (value) => {
    if (!value) return null
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value._id) return value._id
    return String(value)
}

export default function EditLensThicknessForm({ lang }) {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: singleData, isLoading, isSuccess } = useGetSingleLensThicknessQuery(id)

    const singleLensData = singleData?.data || null

    const typeOptions = [
        { value: 'specs', label: 'Specs' },
        { value: 'sunglass', label: 'Sunglass' }
    ]

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ]

    const { refetch } = useGetAllLensThicknessQuery()
    const { data: lensResponse } = useGetAllLensQuery()
    const lensOptions = (Array.isArray(lensResponse?.data) ? lensResponse.data : [])
        .filter((item) => item?.status == true && !item?.deletedAt)
        .map((item) => ({
            label: item.name,
            value: item._id,
        }))
    const { data: filtersResponse } = useGetAllFiltersQuery()
    const filterList = Array.isArray(filtersResponse?.data) ? filtersResponse.data : []

    const [addLens, { isLoading: loadingDataAdd }] = useUpdateLensThicknessMutation()

    const initialValues = {
        name: "",
        slug: "",
        type: [],
        description: "",
        isFree: false,
        status: "",
        filters: [""],
        lens: [],
        lensPrices: [],
        lensFilters: [],
        lang: lang
    }

    const { errors, touched, values, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: lensThicknessValidationSchema,
        onSubmit: async (values) => {
            try {
                const allowedCoatingIds = filterList
                    .filter((item) => (item?.lens || []).map(getId).some((lensId) => values.lens.includes(lensId)))
                    .map((item) => String(item._id))
                const payload = {
                    ...values,
                    lensFilters: (values.lensFilters || []).filter((id) => allowedCoatingIds.includes(String(id))),
                }
                const resp = await addLens({ id: id, formData: payload })
                if (resp?.data?.http_status_code === 200) {
                    refetch()
                    toast.success(resp?.data?.message)
                    navigate("/catalogue/lens-thickness")
                } else {
                    toast.error(resp?.data?.message)
                }
            } catch (err) {
                toast.error(err?.message)
            }
        }
    })

    const coatingsForLens = (lensIds) => filterList
        .filter((item) => item?.status == true && !item?.deletedAt)
        .filter((item) => (item?.lens || []).map(getId).some((lensId) => lensIds.includes(lensId)))

    const lensFilterOptions = coatingsForLens(values.lens).map((item) => ({
        label: item.name,
        value: item._id,
    }))

    const handleNameChange = (e) => {
        const name = e.target.value
        handleChange(e)
        setFieldValue('slug', slugify(name, { lower: true, strict: true }))
    }

    const handleLensChange = (options) => {
        const lensIds = options ? options.map((option) => option.value) : []
        const allowedCoatingIds = coatingsForLens(lensIds).map((item) => String(item._id))
        setFieldValue('lens', lensIds)
        setFieldValue('lensPrices', lensIds.map((lensId) => (
            values.lensPrices.find((item) => item.lens === lensId) || { lens: lensId, price: '' }
        )))
        setFieldValue('lensFilters', values.lensFilters.filter((coatingId) => allowedCoatingIds.includes(String(coatingId))))
    }

    const handleLensPriceChange = (index, price) => {
        const lensPrices = [...values.lensPrices]
        lensPrices[index] = { ...lensPrices[index], price }
        setFieldValue('lensPrices', lensPrices)
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


    useEffect(() => {
        if (singleLensData) {
            const selectedLensFilterIds = Array.isArray(singleLensData?.lensFilters)
                ? singleLensData.lensFilters.map(getId).filter(Boolean)
                : []

            const rawLens = singleLensData?.lens
            const selectedLensIds = (Array.isArray(rawLens) ? rawLens : rawLens ? [rawLens] : [])
                .map(getId)
                .filter(Boolean)
            const savedLensPrices = Array.isArray(singleLensData?.lensPrices) ? singleLensData.lensPrices : []
            const lensPrices = selectedLensIds.map((lensId) => {
                const saved = savedLensPrices.find((item) => getId(item?.lens) === lensId)
                return { lens: lensId, price: String(saved?.price ?? singleLensData?.price ?? '') }
            })

            setFieldValue("name", singleLensData?.name || "")
            setFieldValue("status", singleLensData?.status ?? "")
            setFieldValue("slug", singleLensData?.slug || "")
            setFieldValue("description", singleLensData?.description || "")
            setFieldValue("isFree", singleLensData?.isFree || false)
            setFieldValue("type", singleLensData?.type || [])
            setFieldValue("filters", Array.isArray(singleLensData?.filters) ? singleLensData.filters : [""])
            setFieldValue("lens", selectedLensIds)
            setFieldValue("lensPrices", lensPrices)
            setFieldValue("lensFilters", selectedLensFilterIds)
        }
    }, [singleLensData, isSuccess, setFieldValue])
    return (
        <>
            {
                (loadingDataAdd || isLoading) && <Loader />
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
                                            <Form.Label>Type<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={typeOptions}
                                                name="type"
                                                value={(values?.type ?? []).map(id => typeOptions.find(opt => opt.value === id)).filter(Boolean)}
                                                onChange={(options) => setFieldValue('type', options.map(option => option.value))}
                                                onBlur={() => setFieldTouched('type', true)}
                                            />
                                            {touched.type && errors.type && (
                                                <div className="invalid-feedback d-block">{errors.type}</div>
                                            )}
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
                                            <Form.Check
                                                type="checkbox"
                                                id="isFree"
                                                label="Is Free"
                                                name="isFree"
                                                checked={values.isFree}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lens quality category<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={lensOptions}
                                                name="lens"
                                                placeholder="Select lens quality category..."
                                                value={lensOptions.filter((option) => values.lens.includes(option.value))}
                                                onChange={handleLensChange}
                                                onBlur={() => setFieldTouched('lens', true)}
                                            />
                                            {touched.lens && errors.lens && (
                                                <div className="invalid-feedback d-block">{errors.lens}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Coating</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                isClearable
                                                options={lensFilterOptions}
                                                name="lensFilters"
                                                isDisabled={values.lens.length === 0}
                                                placeholder={values.lens.length ? "Select coating..." : "Select lens quality category first"}
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
                                            />
                                            {touched.lensFilters && errors.lensFilters && (
                                                <div className="invalid-feedback d-block">{errors.lensFilters}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price by lens quality category<span className='text-danger'>*</span></Form.Label>
                                            {values.lensPrices.length === 0 ? (
                                                <div className="text-muted">Select lens quality category first</div>
                                            ) : (
                                                <Row>
                                                    {values.lensPrices.map((item, index) => (
                                                        <Col md={4} key={item.lens} className="mb-2">
                                                            <Form.Label className="text-muted">
                                                                {lensOptions.find((option) => option.value === item.lens)?.label}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                value={item.price}
                                                                onChange={(e) => handleLensPriceChange(index, e.target.value)}
                                                                onBlur={() => setFieldTouched(`lensPrices.${index}.price`, true)}
                                                                isInvalid={touched.lensPrices?.[index]?.price && errors.lensPrices?.[index]?.price}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.lensPrices?.[index]?.price}
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            )}
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
                                                        onChange={(e) => handleFilterChange(index, e.target.value)}
                                                        className="me-2"
                                                    />
                                                    {values?.filters?.length > 1 && (
                                                        <Button variant="danger" onClick={() => removeFilter(index)}>
                                                            Remove
                                                        </Button>
                                                    )}
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
