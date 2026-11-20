import React, { useMemo } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useGetAllMaterialsQuery } from "../../redux/features/materialAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import { useParams } from "react-router-dom";

const getMaterialId = (row) => row?.id ?? row?._id;

export default function ViewMaterialForm() {
    const { id } = useParams();
    const { data, isLoading } = useGetAllMaterialsQuery();

    const listData = useMemo(() => {
        if (Array.isArray(data?.data?.data)) return data.data.data;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    }, [data]);

    const singleData = useMemo(
        () => listData.find((item) => String(getMaterialId(item)) === String(id)) || null,
        [listData, id]
    );

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={singleData?.name || ""} disabled readOnly />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            value={singleData?.status ? "Active" : "Inactive"}
                            disabled
                            readOnly
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}
