import React, { useMemo } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { openModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import { getCustomFieldValueTrashPage } from "../../../utils/routes";
import { useGetAllCustomFieldValuesQuery } from "../../../redux/features/customFieldValueAPIEndPoint";
import { ListFilters, ListTable, boundFilters, indexColumn, useListFilters } from "../../common/ListFilters";
import { hasPermission } from "../../../commondata/permissions";

function readCustomFieldValues(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.value) ? payload.value : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export default function CustumFieldValue() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const list = useListFilters();
  const { data, isError, error, isLoading, isFetching } = useGetAllCustomFieldValuesQuery(
    { id, ...list.query },
    { skip: !id || list.skip },
  );
  const { rows, total } = readCustomFieldValues(data);
  const customField = data?.data?.custom_field;

  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  const showAdd = hasPermission(role, permissions, "CustomFieldValue", "add");
  const showTrash = hasPermission(role, permissions, "CustomFieldValue", "view-trash");

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize, true),
    { id: "order", label: "Order", width: 90, render: (row) => row?.list_order ?? "" },
    { id: "values", label: "Values", minWidth: 160, flex: 1, render: (row) => row?.attribute_name || "" },
    { id: "color", label: "Color", minWidth: 120, flex: 0.7, render: (row) => row?.color || "" },
    {
      id: "image",
      label: "Image",
      width: 140,
      sortable: false,
      filterable: false,
      render: (row) => (row?.shape_image ? <img src={row.shape_image} width={100} height={100} alt="" /> : ""),
    },
    {
      id: "action",
      label: "Action",
      width: 180,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Button onClick={() => { dispatch(openModal({ componentName: "ViewCustumFieldValue", data: { row, data } })); }} className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Button onClick={() => { dispatch(openModal({ componentName: "EditCustumFieldValue", data: { row, data } })); }} className="btn btn-icon btn-warning border-warning"><i className="fe fe-edit"></i></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button className="btn btn-icon btn-danger border-danger" onClick={() => dispatch(openModal({ componentName: "DeleteFieldValue", softDelete: true, data: { row, id } }))}><i className="fe fe-trash"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch, data, id]);

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Custom Field" active="Custom Field Value" items={["Home", "Custom Field List"]} links={["/dashboard", "/catalogue/custom-field/"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {showAdd && (
            <Button onClick={() => { dispatch(openModal({ componentName: "AddCustumFieldValue", data })); }} className="btn btn-success" variant="success">Add Custom Field Value</Button>
          )}
          {showTrash && (
            <Link className="btn btn-danger text-white" to={`${getCustomFieldValueTrashPage()}/${customField?._id}`} state={{ name: "Custom-Field-Value" }}>Cuatom Field Value Trash</Link>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <p className="mb-0">
                <span>Custom Field : {customField?.attribute_name}</span>
                <span className="border border-muted mx-3"></span>
                <span>Type : {customField?.attribute_type}</span>
              </p>
            </Card.Header>
            <Card.Body className="data_table">
              {isError && <Error error_mes={error} />}
              <div className="e-table pb-5">
                <ListFilters {...boundFilters(list, { placeholder: "Value" })} />
                <ListTable
                  columns={columns}
                  rows={rows}
                  total={total}
                  page={list.currentPage}
                  pageSize={list.pageSize}
                  onPagination={list.onPaginationModelChange}
                  emptyLabel="No custom field values found"
                  getRowHeight={() => "auto"}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
