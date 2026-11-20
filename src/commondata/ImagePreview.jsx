import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { closeModal } from "../redux/slices/allModalSlice";

export default function ImagePreview() {
    const dispatch = useDispatch()
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    return (
        <>
            <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
                <Modal.Header closeButton className='bg-primary'>
                    <Modal.Title className='text-light mb-0'>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={data} alt="Preview" className='w-auto h-auto' />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => dispatch(closeModal())}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
