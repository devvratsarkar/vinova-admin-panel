import React, { useEffect } from 'react';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SunEditor from 'suneditor-react';
import { options_for_sunEditor } from '../../commondata/formEditorOptions';
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import toast from 'react-hot-toast';
import Loader from "../../layouts/layoutcomponents/loader"
import { useParams } from 'react-router-dom';
import { useAddFaqMutation, useGetAllFaqQuery, useGetSingleFaqQuery } from '../../redux/features/faqAPIEndPoint';
import { faqValidationSchema } from '../../commondata/formvalidations';

export default function ViewFaqs() {
  const { id } = useParams()

  const initialValues = {
    question: "",
    answer: "",
    status: true
  }

  // const courses = coursesData?.data || []

  const { refetch } = useGetAllFaqQuery()

  const { data, isLoading: singleDataLoading, refetch: singleDataRefetch, isSuccess } = useGetSingleFaqQuery(id)
  const singleData = data?.data || []

  const [addFaqs, { isLoading: loadingAddFaq }] = useAddFaqMutation();

  const formik = useFormik({
    initialValues,
    validationSchema: faqValidationSchema,
    onSubmit: async (values) => {
      try {
        const resp = await addFaqs(values)
        if (resp?.data?.http_status_code === 201) {
          refetch()
          toast.success(resp?.data?.message)
          navigate("/faqs-list")
        } else {
          toast.error(resp?.data?.message)
        }
      } catch (err) {
        console.error('Failed to submit FAQ:', err);
      }
    }
  });

  useEffect(() => {
    if (singleData && isSuccess) {
      formik.setFieldValue('question', singleData?.question);
      formik.setFieldValue('answer', singleData?.answer);
      formik.setFieldValue('status', singleData?.status);
    }
  }, [singleData, isSuccess]);
  return (
    <>
      {
         loadingAddFaq && <Loader /> || singleDataLoading && <Loader />
      }
      <Row>
        <Col>
          <PageHeader
            titles="FAQs"
            active="View FAQs"
            items={["Home", "FAQs Details"]}
            links={["/dashboard", "/cms/faqs"]}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status <span className='text-danger'>*</span></Form.Label>
                      <Form.Select
                        name='status'
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.status && !!formik.errors.status}
                        disabled
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </Form.Select>
                      {formik.touched.status && formik.errors.status && (
                        <Form.Text className="text-danger">{formik.errors.status}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Question <span className='text-danger'>*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="question"
                    value={formik.values.question}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.question && !!formik.errors.question}
                    placeholder="Enter the question"
                    disabled
                  />
                  {formik.touched.question && formik.errors.question && (
                    <Form.Text className="text-danger">{formik.errors.question}</Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Answer <span className='text-danger'>*</span></Form.Label>
                  <SunEditor
                    setOptions={options_for_sunEditor}
                    setContents={formik.values.answer}
                    onChange={(content) => {
                      formik.setFieldValue('answer', content);
                    }}
                    onBlur={() => formik.setFieldTouched('answer', true)}
                    disable
                  />
                  {formik.touched.answer && formik.errors.answer && (
                    <Form.Text className="text-danger">{formik.errors.answer}</Form.Text>
                  )}
                </Form.Group>

                {/* <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit">
                    Save
                  </Button>
                </div> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}