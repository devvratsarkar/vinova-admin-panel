import React, { useState } from 'react';
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Form, Dropdown, Button, InputGroup } from "react-bootstrap";
// import InventoryWithoutVariant from '../../inventory-without-variant/InventoryWithoutVariant';
// import PageHeader from '../../../layouts/layoutcomponents/pageheader';
// import InventoryWithVariant from '../../inventory-with-variant/InventoryWithVariant';
import { Link, useNavigate } from 'react-router-dom';
import { TrashButton } from '../../common/ListFilters';
import { hasPermission } from '../../../commondata/permissions';
import Loader from '../../../layouts/layoutcomponents/loader';
import { openModal } from '../../../redux/slices/allModalSlice';
import { useDispatch } from 'react-redux';
import { useLazySearchFrameInventoryQuery } from '../../../redux/features/inventory';
import { InventoryWithoutVariantDataTable } from '../../../commondata/inventoryWithoutVariantdata';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { FaPlus } from "react-icons/fa";

export default function InventoryWithoutVariant() {
    const [viewingTrash, setViewingTrash] = useState(false)
    const dispatch = useDispatch();
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}")
    const showTrash = hasPermission(role, permissions, "InventoryWithOutVariant", "view-trash")
    const navigate = useNavigate()
    const [trigger, { data, error, isLoading, isFetching, isSuccess }] = useLazySearchFrameInventoryQuery();
    const [show, setShow] = useState(false);
    const payload = data?.data;
    const searchProduct = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        if (!searchValue) {
            setShow(false);
        } else {
            setShow(true);
            trigger(searchValue);
        }
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <PageHeader titles="Inventory" active="Inventory Without Variant" items={['Home']} links={["/dashboard"]} />
                </Col>
                <Col className='text-end'>
                    <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Inventory Without Variant Trash" backLabel="All inventory" />
                </Col>
            </Row>

            {/* <Row className='my-3'>
                <Form.Group as={Col}>
                    <Form.Control
                        type="text"
                        name="search"
                        onChange={handleSearch}
                        placeholder='Search A Product By its Name'
                    />
                </Form.Group>
            </Row> */}
            <Row className="my-3">
                <Form.Group as={Col}>
                    <InputGroup>
                        <InputGroup.Text className='add_inventory'>
                            <FaPlus />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="search"
                            onChange={handleSearch}
                            placeholder="Search for a product to add it to inventory"
                        />
                    </InputGroup>

                </Form.Group>
            </Row>
            {isSuccess && show ? <Card className='p-4'>
                {
                    searchProduct.length > 0 ? searchProduct.map((item, index) => (
                        <Row className='mb-4' key={index}>
                            <Col md={7} sm={6} xs={12} className='d-flex gap-1'>
                                <div className="">
                                    <img src={item?.featured_image} alt="inventory-product" width={200} height={200} />
                                </div>
                                <div className="">
                                    <p>Product Name : {item?.name}</p>
                                    <p>Brand: {item?.brand?.name}</p>
                                </div>
                            </Col>
                            <Col md={5} sm={6} xs={12}>
                                <Button className="btn btn-primary" variant="primary" onClick={() => navigate("/inventory/add-invertory-without-variant", { state: { id: item?._id } })}>
                                    Add To Inventory Without Variant
                                </Button>
                            </Col>
                        </Row>
                    )) : <p>No products found.</p>
                }
            </Card> : <p>{error}</p>
            }
            <Card>
                {isLoading && < Loader />}
                <Card.Body className="data_table">
                    <div className="panel panel-primary">
                        <div className="tab-menu-heading">
                            <div className="tabs-menu ">
                                <InventoryWithoutVariantDataTable viewingTrash={viewingTrash} />
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}
