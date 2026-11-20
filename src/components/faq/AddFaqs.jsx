import React from 'react';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SunEditor from 'suneditor-react';
import { options_for_sunEditor } from '../../commondata/formEditorOptions';
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import toast from 'react-hot-toast';
import Loader from "../../layouts/layoutcomponents/loader"
import { useAddFaqMutation, useGetAllFaqQuery } from '../../redux/features/faqAPIEndPoint';
import { faqValidationSchema } from '../../commondata/formvalidations';
import { useNavigate } from 'react-router-dom';

export default function AddFaqs() {
  const navigate = useNavigate()

  const { refetch } = useGetAllFaqQuery()
  const [addFaqs, { isLoading: loadingAddFaq }] = useAddFaqMutation();


  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
      status: true
    },
    validationSchema: faqValidationSchema,
    onSubmit: async (values) => {
      try {
        const resp = await addFaqs(values)
        if (resp?.data?.http_status_code === 201) {
          refetch()
          toast.success(resp?.data?.message)
          navigate("/cms/faqs")
        } else {
          toast.error(resp?.data?.message)
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  return (
    <>
      {loadingAddFaq && <Loader />}
      <Row>
        <Col>
          <PageHeader
            titles="FAQs"
            active="Add FAQs"
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
                  />
                  {formik.touched.answer && formik.errors.answer && (
                    <Form.Text className="text-danger">{formik.errors.answer}</Form.Text>
                  )}
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit">
                    Save
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}