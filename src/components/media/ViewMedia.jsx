import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/allModalSlice';
import { useGetSingleMediaQuery } from '../../redux/features/MediaEndPoints';
import Loader from '../../layouts/layoutcomponents/loader';

const getMediaId = (item) => item?.id ?? item?._id;

const getMediaPathForCopy = (url) => {
    if (!url) return "";
    try {
        if (url.startsWith("http")) {
            return new URL(url).pathname.replace(/^\//, "");
        }
    } catch {
        // fall through
    }
    return url.replace(/^\/+/, "");
};

export default function ViewMedia() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    const dispatch = useDispatch();
    const mediaId = getMediaId(data);

    const { data: response, isLoading } = useGetSingleMediaQuery(mediaId, {
        skip: !mediaId,
    });

    const media = response?.data ?? data;
    const imagePath = getMediaPathForCopy(media?.image);

    return (
        <Modal show={isOpen}>
            <Modal.Header className="bg-primary">
                <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                    View Media
                </Modal.Title>
                <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="">
                    <i className="fe fe-x"></i>
                </Button>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <Loader />}
                <Row>
                    <Col md={12} className="text-center">
                        <img
                            src={media?.image}
                            alt={media?.name || "Media"}
                            style={{ maxWidth: "100%", maxHeight: "300px" }}
                        />
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={media?.name || ""} disabled />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Label>Image Path</Form.Label>
                        <Form.Control value={imagePath} disabled />
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}
