import React, { useEffect } from 'react'
import { Col, Form, Row, Card } from 'react-bootstrap'
import SunEditor from 'suneditor-react'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import { options_for_sunEditor } from '../../commondata/formEditorOptions'
import { lensColorvalidationSchema } from '../../commondata/formvalidations'
import { useAddLensColorMutation, useGetLensColorQuery, useGetSingleLensColorQuery, useUpdateLensColorMutation } from '../../redux/features/lensColorAPIEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../layouts/layoutcomponents/pageheader'

export default function ViewLensColorForm({ lang }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const { refetch } = useGetLensColorQuery()
    const { data, isLoading: loadingSingleData, isSuccess, refetch: refetchSingleData } = useGetSingleLensColorQuery(id)

    const singleData = data?.data || null

    const [addData, { isLoading: loadingAddData }] = useUpdateLensColorMutation()


    useEffect(() => {
        refetchSingleData()
    }, [refetchSingleData])

    const initialValues = {
        name: "",
        code: "",
        desc: "",
        price: "",
        status: true
    }

    const { errors, values, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } = useFormik({
        initialValues,
        validationSchema: lensColorvalidationSchema,
        onSubmit: async (values) => {
            try {

                console.log("values", values)
                // const resp = await addData({ id: id, formData: values })
                // if (resp?.data?.http_status_code === 200) {
                //     refetch()
                //     refetchSingleData()
                //     toast.success(resp?.data?.message)
                //     navigate("/catalogue/lens-color")
                // } else {
                //     toast.error(resp?.data?.message)
                // }
            } catch (err) {
                toast.error(err?.message)
            }
        }
    })

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
    ]


    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '38px',
            height: '38px'
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '38px',
            padding: '0 6px'
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '38px',
        }),
    }

    useEffect(() => {
        setFieldValue('name', singleData?.name || '')
        setFieldValue('code', singleData?.code || '')
        setFieldValue('desc', singleData?.desc || '')
        setFieldValue('price', singleData?.price || '')
        setFieldValue('status', singleData?.status || true)
    }, [isSuccess, singleData, setFieldValue])

    return (
        <>
            {
                (loadingAddData || loadingSingleData) && <Loader />
            }
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicName">
                                            <Form.Label>Lens Color Name<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Lens Color Name"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
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
                                        <Form.Group className="mb-3" controlId="formBasicCode">
                                            <Form.Label>Color Code<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Color Code (e.g., #FFFFFF)"
                                                name="code"
                                                value={values.code}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.code && errors.code}
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.code}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3" controlId="formBasicDescription">
                                            <Form.Label>Description<span className='text-danger'>*</span></Form.Label>
                                            <SunEditor
                                                setContents={values.desc}
                                                onChange={(content) => {
                                                    setFieldValue('desc', content)
                                                    setFieldTouched('desc', true)
                                                }}
                                                setOptions={options_for_sunEditor}
                                                disable
                                            />
                                            {touched.desc && errors.desc && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.desc}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicPrice">
                                            <Form.Label>Price<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Price"
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
                                        <Form.Group className="mb-3" controlId="formBasicStatus">
                                            <Form.Label>Status<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={statusOptions}
                                                value={statusOptions.find(option => option.value === values.status)}
                                                onChange={(option) => {
                                                    setFieldValue('status', option.value)
                                                    setFieldTouched('status', true)
                                                }}
                                                styles={customStyles}
                                                classNamePrefix="react-select"
                                                isDisabled
                                            />
                                            {touched.status && errors.status && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.status}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col>
                                        <Button type="submit">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row> */}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}