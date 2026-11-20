import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useFormik } from "formik";
import SelectWithDragDrop from '../../common/SelectWithDragDrop';
import { AddCustomFieldSchema } from '../../../commondata/formvalidations';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { closeModal } from '../../../redux/slices/allModalSlice';
import Loader from '../../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import { useGetAllCategorySelectQuery } from '../../../redux/features/CategoryAPIEndPoint';
import { useAddCustomFieldMutation, useGetAllCustomFieldsQuery } from '../../../redux/features/customFieldsAPIEndPoint';

export default function AddCustomField() {
    const initialValues = {
        attribute_type: "Color",
        attribute_name: "",
        list_order: "",
        category_id: [],
    }

    const dispatch = useDispatch();
    const { refetch } = useGetAllCustomFieldsQuery()
    const { isOpen } = useSelector((state) => state.allCommonModal);
    const { data: parentChildCategory } = useGetAllCategorySelectQuery()

    const parentChildCategoryData = parentChildCategory?.data || [];

    const categoryOptions = Array.isArray(parentChildCategoryData) && parentChildCategoryData?.length > 0 ? parentChildCategoryData.map(category => ({
        label: category?.category_name,
        value: category?._id
    })) : [];

    const [newCustomField, { isLoading }] = useAddCustomFieldMutation()

    const { values, errors, touched, setFieldValue, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: initialValues,
        validationSchema: AddCustomFieldSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    category_id: values.category_id.map(option => option.value),
                };

                console.log("payload", payload);

                const response = await newCustomField(payload);
                if (response?.data?.http_status_code === 201) {
                    refetch();
                    toast.success(response.data.message);
                    dispatch(closeModal());
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error?.message);
            }
        },
    });

    const handleCategoryChange = (selectedOptions) => {
        setFieldValue("category_id", selectedOptions || []);
    };

    return (
        <div>
            <Modal show={isOpen}>
                <Modal.Header className='justify-content-center mx-2'>
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Add Custom Field</Modal.Title>
                </Modal.Header>
                <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
                <Modal.Body className='p-2'>
                    {isLoading && <Loader />}
                    <Form onSubmit={handleSubmit} className="border rounded-2 p-2 overflow-hidden" >
                        <Row className="border-bottom pb-3">
                            <Form.Group>
                                <Form.Label>
                                    Attribute Type <span className="required_icon">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="attribute_type"
                                    placeholder="Select Attribute Type"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.attribute_type}
                                >
                                    {/* <option value="">Select</option> */}
                                    <option value="Color">Color</option>
                                    <option value="Shape">Shape</option>
                                    <option value="Select">Select</option>
                                </Form.Select>

                                {errors.attribute_type && touched.attribute_type ? (
                                    <p className={`error`}>{errors.attribute_type}</p>
                                ) : null}
                            </Form.Group>
                        </Row>
                        <Row className="border-bottom pb-3">
                            <Form.Group as={Col} md="6">
                                <Form.Label>
                                    Attribute Name <span className="required_icon">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="attribute_name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.attribute_name}
                                />
                                {errors.attribute_name && touched.attribute_name ? (
                                    <p className={`error`}>{errors.attribute_name}</p>
                                ) : null}
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>
                                    List Order <span className="required_icon">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="list_order"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.list_order}
                                    min={0}
                                />
                                {errors.list_order && touched.list_order ? (
                                    <p className={`error`}>{errors.list_order}</p>
                                ) : null}
                            </Form.Group>
                        </Row>
                        <Row className="pb-3">
                            <Form.Group as={Col} md="12">
                                <Form.Label>Select Category</Form.Label>
                                <SelectWithDragDrop
                                    isMulti
                                    name="category_id"
                                    options={categoryOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={values.category_id}
                                    onChange={handleCategoryChange}
                                    onBlur={handleBlur}
                                    placeholder="Search categories"
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                />
                                {errors.category_id && touched.category_id ? (
                                    <p className={`error`}>{errors.category_id}</p>
                                ) : null}
                            </Form.Group>
                        </Row>
                        <Row className="mx-1">
                            <Button type="submit" className="btn-primary ms-auto w-auto">
                                Save
                            </Button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}