import React, { useEffect, useMemo, useState } from "react";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { useGetAllDisputesQuery } from "../redux/features/disputeAPIEndPoint";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import useDebounce from "../hooks/useDebounce";
import MuiDataTable from "../components/common/MuiDataTable";
import DateRangeFields from "../components/common/DateRangeFields";

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }
const DISPUTE_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
]

const getDisputeId = (row) => row?.id ?? row?._id;

function readDisputes(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.disputes) ? payload.disputes : [];
  const total = Number(payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function statusButton(status) {
  if (status === "open") return <button className="btn btn-success text-light px-4 text-capitalize" type="button">{status}</button>;
  if (status === "pending") return <button className="btn btn-warning text-light px-4 text-capitalize" type="button">{status}</button>;
  return <button className="btn btn-danger text-light px-4 text-capitalize" type="button">{status}</button>;
}

export const DisputeDataTable = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || status || fromDate || toDate);

  const { data, isError, error, isLoading, isFetching } = useGetAllDisputesQuery({
    page: currentPage,
    limit: pageSize,
    ...(status && { status }),
    ...(datesReady && { fromDate, toDate }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  }, { skip: Boolean(dateError) });

  const { rows, total } = readDisputes(data);

  const handleClear = () => {
    setSearchTerm("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, fromDate, toDate]);

  const columns = useMemo(() => [
    {
      id: "index",
      label: "#",
      width: 64,
      sortable: false,
      filterable: false,
      render: (_row, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      id: "order",
      label: "Order Id",
      minWidth: 120,
      flex: 0.7,
      render: (row) => row?.orderId ?? "N/A",
    },
    {
      id: "customer",
      label: "Customer Name",
      minWidth: 180,
      flex: 1,
      render: (row) => row?.created_by?.name || row?.created_by?.phone_number || row?.created_by?.email || "N/A",
    },
    {
      id: "status",
      label: "Status",
      width: 150,
      render: (row) => statusButton(row?.status),
    },
    {
      id: "date",
      label: "Created At",
      minWidth: 190,
      flex: 1,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
    },
    {
      id: "action",
      label: "Action",
      width: 160,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/dispute/view-disputes/${getDisputeId(row)}`}>
              <Button className="btn btn-icon btn-primary me-2">
                <i className="fe fe-eye"></i>
              </Button>
            </Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Reply</Tooltip>}>
            <Button
              className="btn btn-icon btn-warning border-warning"
              onClick={() => dispatch(openModal({ componentName: "ReplyDisputeMessage", data: row }))}
            >
              <i className="fa fa-mail-reply"></i>
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [currentPage, pageSize, dispatch]);

  if (isError && !data) {
    return <Error error_mes={error} />;
  }

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <div className="e-table pb-5">
        <div className="orders-filters mx-3 mt-3 mb-4 p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
          <div className="d-flex justify-content-end mb-2">
            <Button
              type="button"
              variant="link"
              size="sm"
              className="p-0 text-decoration-none fw-semibold"
              onClick={handleClear}
              disabled={!hasFilters}
            >
              Clear filters
            </Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'end' }}>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Search</div>
              <Form.Control
                aria-label="Search"
                placeholder="Name, phone, or order id"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{ ...fieldStyle, backgroundColor: searchTerm ? '#eef5ff' : '#fff' }}
              />
            </div>
            <DateRangeFields
              fromDate={fromDate}
              toDate={toDate}
              onFromDate={setFromDate}
              onToDate={setToDate}
              onError={setDateError}
            />
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Status</div>
              <Form.Select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}>
                {DISPUTE_STATUSES.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
          </div>
          {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
        </div>

        <MuiDataTable
          columns={columns}
          data={rows}
          compact={false}
          emptyLabel="No disputes found"
          getRowKey={(row) => row._id || row.id}
          paginationMode="server"
          filterMode="server"
          disableColumnFilter
          rowCount={total}
          paginationModel={{ page: currentPage - 1, pageSize }}
          onPaginationModelChange={(model) => {
            if (model.pageSize !== pageSize) {
              setPageSize(model.pageSize);
              setCurrentPage(1);
              return;
            }
            setCurrentPage(model.page + 1);
          }}
        />
      </div>
    </>
  );
};
