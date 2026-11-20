import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Image, Button } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { useGetAllSelectFiltersQuery } from '../../redux/features/FiltersAPIEndPoint'
import { useGetAllCategorySelectQuery } from '../../redux/features/CategoryAPIEndPoint'
import { useGetBrandsSelectQuery } from '../../redux/features/BrandAPIEndpoint'
import { useGetAllSelectFramesQuery } from '../../redux/features/framesAPIEndPoint'
import slugify from 'slugify'
import SunEditor from 'suneditor-react'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { openModal } from '../../redux/slices/allModalSlice'
import { lensValidationSchema } from '../../commondata/formvalidations'
import { options_for_sunEditor } from '../../commondata/formEditorOptions'
import { useGetAllLensQuery, useGetSingleLensQuery, useUpdateLensMutation } from '../../redux/features/LensAPIEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import toast from 'react-hot-toast'

export default function EditLensForm({ lang }) {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data, isLoading, refetch: refetchSingleLendData, isSuccess } = useGetSingleLensQuery(id)

    const singleData = data?.data || null
    const { data: allFilters } = useGetAllSelectFiltersQuery()
    const filterData = allFilters?.data || []
    const filtersOption = Array.isArray(filterData) && filterData?.length > 0 ? filterData?.map((item) => ({
        label: item?.name,
        value: item?._id
    })) : []

    const { data: allCategory } = useGetAllCategorySelectQuery()
    const { data: allBrand } = useGetBrandsSelectQuery()
    const { data: allFrames } = useGetAllSelectFramesQuery()

    const categoryData = Array.isArray(allCategory?.data) && allCategory?.data?.length > 0 ? allCategory?.data?.map((item) => ({
        value: item?._id,
        label: item?.category_name,
        type: "Category"
    })) : []


    const brandData = Array.isArray(allBrand?.data) && allBrand?.data?.length > 0 ? allBrand?.data?.map((item) => ({
        value: item?._id,
        label: item?.name,
        type: "Brand"
    })) : []

    const frameData = Array.isArray(allFrames?.data) && allFrames?.data?.length > 0 ? allFrames?.data?.map((item) => ({
        value: item?._id,
        label: item?.name,
        type: "Frame"
    })) : []

    const noExtraFeeOptions = [
        ...categoryData,
        ...brandData,
        ...frameData
    ]

    const typeOptions = [
        { value: 'specs', label: 'Specs' },
        { value: 'sunglass', label: 'Sunglass' }
    ]

    const statusOptions = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ]
    const freeForAllOption = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ]

    const [imagePreview, setImagePreview] = useState(null)

    const { refetch } = useGetAllLensQuery()

    const [addLens, { isLoading: loadingDataAdd }] = useUpdateLensMutation()

    const initialValues = {
        name: "",
        slug: "",
        image: "",
        type: "",
        description: "",
        brand: "",
        filters: [],
        noExtraFee: [],
        price: "",
        warranty: "",
        status: "",
        isFreeForAll: false,
        lang: lang,
    }

    const { errors, touched, values, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormik({
        initialValues,
        validationSchema: lensValidationSchema,
        onSubmit: async (values) => {
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                if (key === "noExtraFee") {
                    value.forEach((item, index) => {
                        formData.append(`noExtraFee[${index}][id]`, item.id)
                        formData.append(`noExtraFee[${index}][type]`, item.type)
                    })
                } else if (key === "filters") {
                    value.forEach((item) => {
                        formData.append("filters", item)
                    })
                } else if (key === "image" && value instanceof File) {
                    formData.append(key, value)
                } else {
                    formData.append(key, value)
                }
            })

            try {
                const resp = await addLens({ id: id, formData: formData })
                if (resp?.data?.http_status_code === 200) {
                    refetch()
                    refetchSingleLendData()
                    toast.success(resp?.data?.message)
                    navigate("/catalogue/lenses")
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


    useEffect(() => {
        if (singleData) {
            setFieldValue("name", singleData?.name)
            setFieldValue("slug", singleData?.slug)
            setFieldValue("image", singleData?.image)
            setFieldValue("type", singleData?.type)
            setFieldValue("description", singleData?.description)
            setFieldValue("filter", singleData?.filter?.map((item) => item))
            setFieldValue("noExtraFee", singleData?.noExtraFee?.map((item) => item))
            setFieldValue("brand", singleData?.brand?._id)
            setFieldValue("price", singleData?.price)
            setFieldValue("warranty", singleData?.warranty)
            setFieldValue("status", singleData?.status)
            setFieldValue("isFreeForAll", singleData?.isFreeForAll)

            setImagePreview(singleData?.image)
        }
    }, [singleData, isSuccess, setFieldValue])

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
                                            <Form.Label>Image<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image"
                                                onChange={handleImageChange}
                                                onBlur={handleBlur}
                                                accept="image/*"
                                                isInvalid={touched.image && errors.image}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.image}
                                            </Form.Control.Feedback>
                                            {imagePreview && (
                                                <div className="mt-2 position-relative" style={{ width: '200px' }}>
                                                    <Image src={imagePreview} thumbnail style={{ width: '100%' }} />
                                                    <i
                                                        className="fe fe-eye position-absolute"
                                                        style={{ top: '10px', right: '10px', cursor: 'pointer' }}
                                                        size={24}
                                                        onClick={() => dispatch(openModal({ componentName: "ImagePreview", data: imagePreview }))}
                                                    ></i>
                                                </div>
                                            )}
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
                                            />
                                            {touched.type && errors.type && (
                                                <div className="invalid-feedback d-block">{errors.type}</div>
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
                                            <Form.Label>Filters</Form.Label>
                                            <SelectWithDragDrop
                                                isMulti
                                                options={filtersOption}
                                                name="filters"
                                                value={values.filters.map(id => filtersOption.find(opt => opt.value === id)).filter(Boolean)}
                                                onChange={(options) => setFieldValue('filters', options.map(option => option.value))}
                                                onBlur={() => setFieldTouched('filters', true)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Is Free For All</Form.Label>
                                            <SelectWithDragDrop
                                                options={freeForAllOption}
                                                name="isFreeForAll"
                                                value={freeForAllOption.find(option => option.value === values.isFreeForAll)}
                                                onChange={(option) => setFieldValue('isFreeForAll', option.value)}
                                                onBlur={() => setFieldTouched('isFreeForAll', true)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {
                                        !values.isFreeForAll ? (
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>No Extra Fee</Form.Label>
                                                    <SelectWithDragDrop
                                                        isMulti
                                                        options={noExtraFeeOptions}
                                                        name="noExtraFee"
                                                        value={noExtraFeeOptions.filter(option =>
                                                            values.noExtraFee.some(item => item.id === option.value && item.type === option.type)
                                                        )}
                                                        onChange={(options) => setFieldValue('noExtraFee', options.map(option => ({
                                                            id: option.value,
                                                            type: option.type
                                                        })))}
                                                        onBlur={() => setFieldTouched('noExtraFee', true)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        ) : null
                                    }
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Brand<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={brandData}
                                                name="brand"
                                                value={brandData.find(option => option.value === values.brand)}
                                                onChange={(option) => setFieldValue('brand', option.value)}
                                                onBlur={() => setFieldTouched('brand', true)}
                                            />
                                            {
                                                errors?.brand && touched?.brand && (
                                                    <p className='text-danger'>{errors?.brand}</p>
                                                )
                                            }
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
                                            <Form.Label>Warranty<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="warranty"
                                                value={values.warranty}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.warranty && errors.warranty}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.warranty}
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