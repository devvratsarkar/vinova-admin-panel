import React from 'react'
import { Button, Form, Modal, Row } from 'react-bootstrap'
import { TagsValidationForm } from '../../../commondata/formvalidations';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../redux/slices/allModalSlice';
import Loader from '../../../layouts/layoutcomponents/loader';
import { useGetAllBlogsTagsQuery } from '../../../redux/features/getApiSecond';
import { useEditBlogTagMutation } from '../../../redux/features/postApiSecond';
import toast from 'react-hot-toast';

export default function EditBlogTags() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const [editBlogTag, { isLoading }] = useEditBlogTagMutation();
    const { refetch } = useGetAllBlogsTagsQuery()
    const initialValues = {
        name: data.name,
    }
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: TagsValidationForm,
        onSubmit: async (values) => {
            try {
                const response = await editBlogTag({ id: data._id || data.id, data: values });
                if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
                    refetch()
                    dispatch(closeModal())
                }
                else if (response.error) {
                    toast.error(response.error)
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <Modal show={isOpen}>
            <Modal.Header className='bg-primary'>
                <Modal.Title className='text-white'>Edit Blog Tag</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <Loader />}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                        <Form.Control name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} />
                        {errors.name && touched.name ? (
                            <p className='text-danger'>{errors.name}</p>
                        ) : null}
                    </Form.Group>
                    <Row className='justify-content-end mt-5 gap-2 px-3'>
                        <Button className="btn btn-outline-default cancel_button w-auto" variant="" onClick={() => dispatch(closeModal())} >Cancel</Button>
                        <Button type='submit' className='w-auto' >Save</Button>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

