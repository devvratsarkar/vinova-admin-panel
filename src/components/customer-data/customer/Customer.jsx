import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useGetAllUsersQuery } from "../../../redux/features/getApiSecond";
import { useUpdateCustomerMutation } from "../../../redux/features/postApiSecond";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from "../../common/ListFilters";

const FILTER_KEYS = ["status"];

function readCustomers(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function CustomerStatusSwitch({ row, updateCustomer, onSuccess }) {
  const [checked, setChecked] = useState(!!row?.status);
  useEffect(() => setChecked(!!row?.status), [row?.status]);

  const handleChange = async () => {
    const next = !checked;
    setChecked(next);
    try {
      const response = await updateCustomer(row?.id ?? row?._id);
      if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) onSuccess?.();
      else setChecked(!next);
    } catch (err) {
      setChecked(!next);
    }
  };

  return <StatusSwitch checked={checked} onChange={handleChange} />;
}

export default function Customer() {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isError, error, isLoading, isFetching, refetch } = useGetAllUsersQuery(list.query, {
    skip: list.skip,
    refetchOnMountOrArgChange: true,
  });
  const [updateCustomer, { isLoading: updating }] = useUpdateCustomerMutation();
  const { rows, total } = readCustomers(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 140, flex: 1, render: (row) => row?.name || "" },
    { id: "email", label: "Email", minWidth: 180, flex: 1.2, render: (row) => row?.email || "" },
    { id: "phone", label: "Phone", minWidth: 140, flex: 0.8, render: (row) => row?.phone_number || "N/A" },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <CustomerStatusSwitch row={row} updateCustomer={updateCustomer} onSuccess={refetch} />,
    },
    {
      id: "verified",
      label: "Verified",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => (
        <span className={row?.is_verified ? "text-success" : "text-warning"}>
          {row?.is_verified ? "Yes" : "No"}
        </span>
      ),
    },
    { id: "created", label: "Member Since", minWidth: 190, flex: 1, nowrap: true, render: (row) => formatDate(row?.createdAt) || "" },
    {
      id: "action",
      label: "Action",
      width: 100,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-primary" variant="" onClick={() => dispatch(openModal({ componentName: "ViewCustomer", data: row }))}>
              <i className="fe fe-eye"></i>
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch, updateCustomer, refetch]);

  return (
    <>
      {(isLoading || isFetching || updating) && <Loader />}
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Customers" active="Customer List" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              {isError && <Error error_mes={error} />}
              <div className="e-table pb-5">
                <ListFilters
                  {...boundFilters(list, { placeholder: "Name, email, or phone" })}
                  selects={[{ label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS }]}
                />
                <ListTable
                  columns={columns}
                  rows={rows}
                  total={total}
                  page={list.currentPage}
                  pageSize={list.pageSize}
                  onPagination={list.onPaginationModelChange}
                  emptyLabel="No customers found"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
