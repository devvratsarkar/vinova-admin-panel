import React, { useState } from 'react';
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Form, Dropdown, Button, InputGroup } from "react-bootstrap";
// import InventoryWithoutVariant from '../../inventory-without-variant/InventoryWithoutVariant';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import InventoryWithVariant from '../../inventory-with-variant/InventoryWithVariant';
import { Link } from 'react-router-dom';
import { TrashButton } from '../../common/ListFilters';
import { hasPermission } from '../../../commondata/permissions';
import Loader from '../../../layouts/layoutcomponents/loader';
import { openModal } from '../../../redux/slices/allModalSlice';
import { useDispatch } from 'react-redux';
import { useLazySearchFrameInventoryQuery } from '../../../redux/features/inventory';
import { FaPlus } from "react-icons/fa";

export default function Inventory() {
  const dispatch = useDispatch();
  const [trigger, { data, error, isLoading, isFetching, isSuccess }] = useLazySearchFrameInventoryQuery();
  const [show, setShow] = useState(false);
  const searchProduct = data?.data || [];
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    if (!searchValue) {
      setShow(false);
    } else {
      setShow(true);
      trigger(searchValue);
    }
  };

  const [viewingTrash, setViewingTrash] = useState(false)
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))
  const showTrash = hasPermission(role, permissions, "InventoryWithVariant", "view-trash")

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <PageHeader titles="Inventory" active="Inventory With Variant" items={['Home']} links={["/dashboard"]} />
        </Col>
        <Col className='text-end'>
          <TrashButton show={showTrash} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Inventory With Variant Trash" backLabel="All inventory" />
        </Col>
      </Row>

      {/* <Row className='my-3'>
        <Form.Group as={Col}>
          <Form.Control
            type="text"
            name="search"
            onChange={handleSearch}
            placeholder='To add inventory, search a product by its name'
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
          searchProduct && searchProduct?.length > 0 ? searchProduct?.map((item, index) => (
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
                <Button className="btn btn-primary" variant="primary" onClick={() => dispatch(openModal({ componentName: 'AddVariant', data: item }))}>Add To Inventory With Variant</Button>
              </Col>
            </Row>
          )) : <p>No data available.</p>
        }
      </Card> : <p>{error}</p>
      }
      <Card>
        {isLoading && < Loader />}
        <Card.Body className="data_table">
          <div className="panel panel-primary">
            <div className="tab-menu-heading">
              <div className="tabs-menu ">
                <InventoryWithVariant viewingTrash={viewingTrash} />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
