import React, { useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import SelectWithDragDrop from "../common/SelectWithDragDrop";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../commondata/suneditorOptions";
// import { useGetAllReviewsQuery, useGetCustomerQuery, useGetSingleReviewsQuery } from "../../redux/features/getApiSecond";
// import { useGetPackageSelectQuery, useGetSelectEquipmentQuery } from "../../redux/features/getApi";
import Loader from "../../layouts/layoutcomponents/loader";
// import { useAddReviewMutation } from "../../redux/features/postApiSecond";
import { addReviewValidationSchema } from "../../commondata/formvalidations";

export default function EditReview() {
  const navigate = useNavigate();
  const { type, id } = useParams();

  // const { data: user_res, isLoading: isUserLoading } = useGetCustomerQuery();
  // const user = user_res?.data;
  const user = null;
  // const { data: package_res, isLoading: isPackageLoading } = useGetPackageSelectQuery();
  // const packages = package_res?.data;
  const packages = null;
  // const { data: equipment_res, isLoading: isEquipmentLoading } = useGetSelectEquipmentQuery();
  // const equipments = equipment_res?.data;
  const equipments = null;
  // const [addReview, { isLoading }] = useAddReviewMutation()
  // const { refetch } = useGetAllReviewsQuery(type)
  // const { data, isLoading: loading, isSuccess } = useGetSingleReviewsQuery(id)
  // const single_review = data?.data;
  const single_review = null;

  const initialValues = {
    user_id: "",
    type: "",
    itemId: "",
    rating: "",
    text: "",
  };

  const userOptions = user?.map((item) => ({
    value: item._id,
    label: item.name,
  })) || [];

  const typeOptions = [
    { value: "Package", label: "Package" },
    { value: "Equipment", label: "Equipment" },
  ];

  const itemOptions = type.toLowerCase() === "package"
    ? (packages?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [])
    : (equipments?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || []);

  const { values, errors, handleBlur, handleChange, handleSubmit, setFieldValue, touched } = useFormik({
    initialValues: initialValues,
    validationSchema: addReviewValidationSchema,
    onSubmit: async (values) => {
      try {
        // const res = await addReview(values);
        // if (res?.data?.http_status_code === 201) {
        //   refetch()
        //   navigate(getPackageReviews())
        // }

      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    if (isSuccess && single_review) {
      setFieldValue("user_id", single_review?.user_id?._id);
      setFieldValue("itemId", single_review?.itemId?._id);
      setFieldValue("type", single_review?.type);
      setFieldValue("rating", single_review?.rating);
    }
  }, [isSuccess])

  return (
    <div>
      {/* {isUserLoading || isPackageLoading || isEquipmentLoading || isLoading || loading && <Loader />} */}
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader titles="Add New Review" active="Add New Review" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Body className="add_new_review">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        User <span className="text-danger">*</span>
                      </Form.Label>
                      <SelectWithDragDrop
                        options={userOptions}
                        name="user_id"
                        value={userOptions.find(option => option.value === values.user_id) || null}
                        onChange={(selectedOption) => setFieldValue("user_id", selectedOption ? selectedOption.value : "")}
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Select user..."
                      />
                      {errors.user_id && touched.user_id && (
                        <p className="error">{errors.user_id}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Type <span className="text-danger">*</span>
                      </Form.Label>
                      <SelectWithDragDrop
                        options={typeOptions}
                        name="type"
                        value={typeOptions.find(option => option.value === values.type) || null}
                        onChange={(selectedOption) => setFieldValue("type", selectedOption ? selectedOption.value : "")}
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Select type..."
                      />
                      {errors.type && touched.type && (
                        <p className="error">{errors.type}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Item <span className="text-danger">*</span>
                      </Form.Label>
                      <SelectWithDragDrop
                        options={itemOptions}
                        name="itemId"
                        value={itemOptions.find(option => option.value === values.itemId) || null}
                        onChange={(selectedOption) => setFieldValue("itemId", selectedOption ? selectedOption.value : "")}
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Select item..."
                      />
                      {errors.itemId && touched.itemId && (
                        <p className="error">{errors.itemId}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Rating <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="rating"
                        value={values.rating}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter rating (e.g., 1-5)"
                      />
                      {errors.rating && touched.rating && (
                        <p className="error">{errors.rating}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>
                        Review Text <span className="text-danger">*</span>
                      </Form.Label>
                      <SunEditor
                        setOptions={options_for_sunEditor}
                        name="text"
                        setContents={single_review?.text}
                        onChange={(text_content) => setFieldValue("text", text_content)}
                        onBlur={handleBlur}
                      />
                      {errors.text && touched.text && (
                        <p className="error">{errors.text}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                  <Button type="submit" className="btn btn-primary text-white w-auto">
                    Save
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}