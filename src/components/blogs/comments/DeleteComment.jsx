import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useDeleteCommentMutation } from '../../../redux/features/postApiSecond'
import Loader from '../../../layouts/layoutcomponents/loader'
import { useGetAllBlogsCommentsQuery } from '../../../redux/features/getApiSecond'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../../redux/slices/allModalSlice'

export default function DeleteComment() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const { refetch } = useGetAllBlogsCommentsQuery()
    const [deleteData, { isLoading: loadingDeleteData }] = useDeleteCommentMutation()
    const handleDelete = async () => {
        try {
            const resp = await deleteData(data)
            if (resp?.data?.http_status_code === 200) {
                refetch()
                dispatch(closeModal())
            }
        } catch (err) {
            toast.error(err?.message)
        }
    }
    return (
        <>
            {
                loadingDeleteData && <Loader />
            }
            <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
                <Modal.Header className='bg-danger m-0 '>
                    <Modal.Title className='text-light'>
                        Delete Comment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are You sure, you want to delete this data?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"light"} onClick={() => dispatch(closeModal())}>Cancel</Button>
                    <Button variant={"danger"} onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
