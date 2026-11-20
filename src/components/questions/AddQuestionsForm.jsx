import { Col, Form, Row, Card, Button } from 'react-bootstrap'
import SelectWithDragDrop from '../common/SelectWithDragDrop'
import { useFormik } from 'formik'
import Loader from '../../layouts/layoutcomponents/loader'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAddQuestionMutation, useGetAllQuestionsQuery } from '../../redux/features/questionsAPIEndPoint'
import { questionsValidationSchema } from '../../commondata/formvalidations'

export default function AddQuestionsForm({ lang }) {
    const navigate = useNavigate()
    const { refetch } = useGetAllQuestionsQuery()

    const [addData, { isLoading: loadingAddData }] = useAddQuestionMutation()

    const initialValues = {
        text: "",
        type: "text",
        options: [
            {
                value: "",
                label: ""
            }
        ],
        conditions: [
            {
                field: "",
                value: "",
                operator: ""
            }
        ],
        dependsOn: {
            questionId: "",
            answer: ""
        },
        category: "frame",
        order: 1,
        status: true,
        lang: lang,
    }

    const { errors, values, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } = useFormik({
        initialValues,
        validationSchema: questionsValidationSchema,
        onSubmit: async (values) => {
            try {
                const resp = await addData(values)
                if (resp?.data?.http_status_code === 201) {
                    refetch()
                    toast.success(resp?.data?.message)
                    navigate("/questions")
                } else {
                    toast.error(resp?.data?.message)
                }
            } catch (err) {
                toast.error(err?.message)
            }
        }
    })

    const typeOptions = [
        { value: "multiple_choice", label: "Multiple Choice" },
        { value: "yes_no", label: "Yes/No" },
        { value: "text", label: "Text" }
    ]

    const categoryOptions = [
        { value: "frame", label: "Frame" },
        { value: "sunglasses", label: "Sunglasses" },
        { value: "contact_lens", label: "Contact Lens" }
    ]

    const operatorOptions = [
        { value: "equals", label: "Equals" },
        { value: "greater_than", label: "Greater Than" },
        { value: "less_than", label: "Less Than" },
        { value: "in", label: "In" }
    ]

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
    ]

    // Custom styles for react-select
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

    const addOption = () => {
        setFieldValue('options', [...values.options, { value: "", label: "" }])
    }

    const addCondition = () => {
        setFieldValue('conditions', [...values.conditions, { field: "", value: "", operator: "" }])
    }

    const removeCondition = (index) => {
        if (values.conditions.length > 1) {
            const newConditions = values.conditions.filter((_, i) => i !== index)
            setFieldValue('conditions', newConditions)
        } else {
            toast.error("At least one condition is required")
        }
    }

    return (
        <>
            {
                loadingAddData && <Loader />
            }
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicText">
                                            <Form.Label>Question Text<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Question Text"
                                                name="text"
                                                value={values.text}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.text && errors.text}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.text}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicType">
                                            <Form.Label>Question Type<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={typeOptions}
                                                value={typeOptions.find(option => option.value === values.type)}
                                                onChange={(option) => {
                                                    setFieldValue('type', option.value)
                                                    setFieldTouched('type', true)
                                                }}
                                                styles={customStyles}
                                                classNamePrefix="react-select"
                                            />
                                            {touched.type && errors.type && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.type}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    {(values.type === "multiple_choice" || values.type === "yes_no") && (
                                        <Col md={12}>
                                            <Form.Group className="mb-3" controlId="formBasicOptions">
                                                <Form.Label>Options<span className='text-danger'>*</span></Form.Label>
                                                {values.options.map((option, index) => (
                                                    <Row key={index} className="mb-2">
                                                        <Col md={5}>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Option Value"
                                                                name={`options[${index}].value`}
                                                                value={option.value}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.options?.[index]?.value && errors.options?.[index]?.value}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.options?.[index]?.value}
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                        <Col md={5}>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Option Label"
                                                                name={`options[${index}].label`}
                                                                value={option.label}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.options?.[index]?.label && errors.options?.[index]?.label}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.options?.[index]?.label}
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Button variant="primary" onClick={addOption}>
                                                                Add Option
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </Form.Group>
                                        </Col>
                                    )}
                                    <Col md={12}>
                                        <Form.Group className="mb-3" controlId="formBasicConditions">
                                            <Form.Label>Conditions <span className='text-danger'>*</span></Form.Label>
                                            {values.conditions.map((condition, index) => (
                                                <Row key={index} className="mb-2">
                                                    <Col md={3}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Field"
                                                            name={`conditions[${index}].field`}
                                                            value={condition.field}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.conditions?.[index]?.field && errors.conditions?.[index]?.field}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.conditions?.[index]?.field}
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Value"
                                                            name={`conditions[${index}].value`}
                                                            value={condition.value}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.conditions?.[index]?.value && errors.conditions?.[index]?.value}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.conditions?.[index]?.value}
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                    <Col md={3}>
                                                        <SelectWithDragDrop
                                                            options={operatorOptions}
                                                            value={operatorOptions.find(option => option.value === condition.operator)}
                                                            onChange={(option) => {
                                                                setFieldValue(`conditions[${index}].operator`, option.value)
                                                                setFieldTouched(`conditions[${index}].operator`, true)
                                                            }}
                                                            styles={customStyles}
                                                            classNamePrefix="react-select"
                                                        />
                                                        {touched.conditions?.[index]?.operator && errors.conditions?.[index]?.operator && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors.conditions?.[index]?.operator}
                                                            </div>
                                                        )}
                                                    </Col>
                                                    <Col md={3} className="d-flex gap-2">
                                                        <Button variant="primary" onClick={addCondition}>
                                                            Add Condition
                                                        </Button>
                                                        {
                                                            values.conditions?.length > 1 &&
                                                            (
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => removeCondition(index)}
                                                                    disabled={values.conditions.length === 1}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )
                                                        }

                                                    </Col>
                                                </Row>
                                            ))}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicDependsOnQuestionId">
                                            <Form.Label>Depends On Question ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Question ID"
                                                name="dependsOn.questionId"
                                                value={values.dependsOn.questionId}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.dependsOn?.questionId && errors.dependsOn?.questionId}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dependsOn?.questionId}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicDependsOnAnswer">
                                            <Form.Label>Depends On Answer</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Answer"
                                                name="dependsOn.answer"
                                                value={values.dependsOn.answer}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.dependsOn?.answer && errors.dependsOn?.answer}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dependsOn?.answer}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicCategory">
                                            <Form.Label>Category<span className='text-danger'>*</span></Form.Label>
                                            <SelectWithDragDrop
                                                options={categoryOptions}
                                                value={categoryOptions.find(option => option.value === values.category)}
                                                onChange={(option) => {
                                                    setFieldValue('category', option.value)
                                                    setFieldTouched('category', true)
                                                }}
                                                styles={customStyles}
                                                classNamePrefix="react-select"
                                            />
                                            {touched.category && errors.category && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.category}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicOrder">
                                            <Form.Label>Order<span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Order"
                                                name="order"
                                                value={values.order}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.order && errors.order}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.order}
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
                                            />
                                            {touched.status && errors.status && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.status}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='justify-content-center mt-3'>
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