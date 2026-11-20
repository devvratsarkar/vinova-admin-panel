import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Image } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { useFormik } from 'formik'
import Suneditor from "suneditor-react";
import { options_for_sunEditor } from '../../../commondata/suneditorOptions'
import SeoForm from '../../seo-page/SeoForm'
import { policiesEditValidationSchema } from '../../../commondata/formvalidations'
import {
    useGetAllPoliciesQuery,
    useGetPolicyQuery,
    useUpdatePolicyMutation,
} from '../../../redux/features/policyAPIEndPoint'
import Loader from '../../../layouts/layoutcomponents/loader'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const showFieldError = (fieldError, submitCount) =>
    Boolean(fieldError && submitCount > 0);

export default function EditPolicy() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isSuccess } = useGetPolicyQuery(id)
  const singleData = data?.data || null
  const { refetch } = useGetAllPoliciesQuery()
  const [updatePolicy, { isLoading: loadingUpdate }] = useUpdatePolicyMutation()
  const [previewImage, setPreviewImage] = useState(null)

  const initialValues = {
    type: "",
    title: "",
    banner: "",
    content: "",
    status: true,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
  }

  const { errors, values, touched, handleChange, handleBlur, setFieldTouched, setFieldValue, submitForm, submitCount } = useFormik({
    initialValues,
    validationSchema: policiesEditValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData()
      const fields = [
        "type", "title", "content", "status",
        "meta_title", "meta_description", "meta_keywords", "og_tag", "schema_markup",
      ]

      fields.forEach((key) => {
        const value = values[key]
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, key === "status" ? String(value) : value)
        }
      })

      if (values.banner instanceof File) {
        formData.append("banner", values.banner)
      }

      try {
        const resp = await updatePolicy({ id, formData })
        if (resp?.error) {
          toast.error(resp.error?.data?.message || 'Failed to update policy')
          return
        }
        if (resp?.data?.http_status_code === 200) {
          refetch()
          toast.success(resp?.data?.message || 'Policy updated successfully')
          navigate("/all-policies")
        } else {
          toast.error(resp?.data?.message || 'Failed to update policy')
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || 'An error occurred')
      }
    }
  })

  useEffect(() => {
    if (isSuccess && singleData) {
      setFieldValue("type", singleData?.type || "")
      setFieldValue("title", singleData?.title || "")
      setFieldValue("content", singleData?.content || "")
      setFieldValue("status", singleData?.status ?? true)
      setFieldValue("banner", singleData?.banner || "")
      setPreviewImage(singleData?.banner || null)
      setFieldValue("meta_title", singleData?.meta_title || "")
      setFieldValue("meta_description", singleData?.meta_description || "")
      setFieldValue("meta_keywords", singleData?.meta_keywords || "")
      setFieldValue("og_tag", singleData?.og_tag || "")
      setFieldValue("schema_markup", singleData?.schema_markup || "")
    }
  }, [isSuccess, singleData, setFieldValue])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = await submitForm()
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the highlighted errors before saving')
    }
  }

  const handleBannerChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFieldValue("banner", file)
      setFieldTouched("banner", true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      {(loadingUpdate || isLoading) && <Loader />}
      <Row className="justify-content-between">
        <Col>
          <PageHeader titles="Policy Pages" active="Edit Policy" items={["Home", "Policy Page List"]} links={["/dashboard", "/all-policies"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleFormSubmit}>
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Type <span className='text-danger'>*</span></Form.Label>
                      <Form.Select
                        name='type'
                        onChange={handleChange}
                        value={values.type}
                        onBlur={handleBlur}
                      >
                        <option value="">Select</option>
                        <option value="terms-conditions">Terms And Condition</option>
                        <option value="privacy-policy">Privacy Policy</option>
                        <option value="cancelation-policy">Cancelation Policy</option>
                        <option value="refund-return">Refund Return Policy</option>
                        <option value="vendor-policy">Vendor Policy</option>
                      </Form.Select>
                      {showFieldError(errors?.type, submitCount) && (
                        <p className='text-danger'>{errors.type}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Title <span className='text-danger'>*</span></Form.Label>
                      <Form.Control
                        name='title'
                        onChange={handleChange}
                        value={values.title}
                        onBlur={handleBlur}
                      />
                      {showFieldError(errors?.title, submitCount) && (
                        <p className='text-danger'>{errors.title}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Banner Image</Form.Label>
                      <Form.Control
                        type='file'
                        name='banner'
                        onChange={handleBannerChange}
                        onBlur={() => setFieldTouched('banner', true)}
                        accept="image/*"
                      />
                      {showFieldError(errors?.banner, submitCount) && (
                        <p className='text-danger'>{errors.banner}</p>
                      )}
                      {previewImage && (
                        <div className="mt-2 position-relative">
                          <Form.Label>Image Preview</Form.Label>
                          <Image src={previewImage} alt="Banner Preview" fluid style={{ maxHeight: '100px' }} />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Status <span className='text-danger'>*</span></Form.Label>
                      <Form.Select
                        name='status'
                        onChange={(e) => setFieldValue('status', e.target.value === 'true')}
                        value={String(values.status)}
                        onBlur={handleBlur}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Form.Select>
                      {showFieldError(errors?.status, submitCount) && (
                        <p className='text-danger'>{errors.status}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Form.Label>Content <span className='text-danger'>*</span></Form.Label>
                      <Suneditor
                        name='content'
                        setOptions={options_for_sunEditor}
                        onChange={(content) => setFieldValue("content", content)}
                        onBlur={() => setFieldTouched("content", true)}
                        setContents={values.content}
                      />
                      {showFieldError(errors?.content, submitCount) && (
                        <p className='text-danger'>{errors.content}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <SeoForm
                    handleChange={handleChange}
                    values={values}
                    errors={errors}
                    handleBlur={handleBlur}
                    touched={touched}
                    readOnlyStatus={false}
                  />
                </Row>
                <Row className='justify-content-center mt-3'>
                  <Button type='submit' className='w-auto'>Save</Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
