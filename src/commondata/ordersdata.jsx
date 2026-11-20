import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import moment from "moment";
import { ordersAPIEndPoint, useGetAllOrdersQuery } from "../redux/features/ordersAPIEndPoint";
import { useExportAction } from "../utils/fileDownload";
import useDebounce from "../hooks/useDebounce";
import MuiDataTable from "../components/common/MuiDataTable";
import DateRangeFields from "../components/common/DateRangeFields";
import { hasPermission } from "./permissions";

function capitalizeFirstLetter(word) {
  return word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();
}

function orderStatusLabel(status) {
  if (status === "pending") return "Order Placed";
  if (status === "accepted") return "Order Accepted";
  if (status === "processed") return "Order Processed";
  if (status === "packed") return "Order Packed";
  if (status === "dispatched") return "Order Dispatched";
  if (status === "delivered") return "Order Delivered";
  return capitalizeFirstLetter(status);
}

function readOrdersResult(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.orders) ? payload.orders : [];
  const total = Number(payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }
const ORDER_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Order Placed' },
  { value: 'accepted', label: 'Order Accepted' },
  { value: 'processed', label: 'Order Processed' },
  { value: 'packed', label: 'Order Packed' },
  { value: 'dispatched', label: 'Order Dispatched' },
  { value: 'delivered', label: 'Order Delivered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hold', label: 'Hold' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]
const PAYMENTS = [
  { value: '', label: 'All payments' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
]
const PRESCRIPTIONS = [
  { value: '', label: 'All prescriptions' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

export const OrdersDataTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const payment = searchParams.get("payment_status") || "";
  const [prescription, setPrescription] = useState("")
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || status || payment || prescription || fromDate || toDate);

  const apiQuery = {
    page: currentPage,
    limit: pageSize,
    ...(status && { status }),
    ...(payment && { payment_status: payment }),
    ...(datesReady && { fromDate, toDate }),
    ...(prescription && { isprescription: prescription }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  };

  const { data, isLoading, isFetching } = useGetAllOrdersQuery(apiQuery, { skip: Boolean(dateError) });
  const { onExport, exporting } = useExportAction(ordersAPIEndPoint.endpoints.getAllOrders, "Order", "Orders downloaded");
  const { rows: orders, total } = readOrdersResult(data);

  const setQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const handleClear = () => {
    setPrescription("");
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setCurrentPage(1);
    setQuery({ status: "", payment_status: "" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, payment, prescription, fromDate, toDate]);

  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}")
  const role = localStorage.getItem("role")
  const shouldShowSingleView = hasPermission(role, permissions, "Order", "view");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Transaction ID copied to clipboard!"),
      (err) => toast.error("Failed to copy Transaction ID.")
    );
  };

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
      field: "order_number",
      minWidth: 120,
      flex: 0.8,
      render: (row) => `#${row?.order_number ?? ""}`,
    },
    {
      id: "date",
      label: "Order Date",
      width: 180,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
    },
    {
      id: "customer",
      label: "Customer Name",
      minWidth: 180,
      flex: 1,
      render: (row) => row?.user?.name || row?.user?.phone_number || "",
    },
    {
      id: "total",
      label: "Total",
      numeric: true,
      nowrap: true,
      minWidth: 160,
      flex: 0.9,
      render: (row) => `${row?.currency ?? ""}${row?.total_amount ?? ""}`,
    },
    {
      id: "payment",
      label: "Payment",
      width: 150,
      render: (row) => {
        if (row?.payment_status === "Pending") {
          return (
            <Button variant="" className="btn btn-danger text-light">
              Failed
            </Button>
          );
        }
        if (row?.payment_status === "Paid") {
          return (
            <button className="btn custum-paid-color text-light px-5" type="button">
              {row?.payment_status}
            </button>
          );
        }
        return (
          <button className="btn custum-failed-color text-light px-4" type="button">
            {row?.payment_status}
          </button>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      width: 160,
      render: (row) => orderStatusLabel(row?.status),
    },
    {
      id: "transaction",
      label: "Transaction ID",
      minWidth: 180,
      flex: 1,
      render: (row) => {
        if (!row?.transaction_id) return <span className="text-muted">—</span>;
        return (
          <OverlayTrigger placement="top" overlay={<Tooltip>{row.transaction_id}</Tooltip>}>
            <button
              type="button"
              className="btn btn-link text-primary p-0 border-0 text-truncate d-block w-100 text-start"
              style={{ maxWidth: "100%" }}
              onClick={() => copyToClipboard(row.transaction_id)}
            >
              {row.transaction_id}
            </button>
          </OverlayTrigger>
        );
      },
    },
    {
      id: "action",
      label: "Action",
      width: 120,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/order-detail/${row.id}`} className="action_icon">
              <Button className="btn btn-icon btn-primary">
                <i className="fe fe-eye"></i>
              </Button>
            </Link>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [currentPage, pageSize]);

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <div className="e-table pb-5">
        <div className="orders-filters mx-3 mt-3 mb-4 p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
          <div className="d-flex justify-content-end align-items-center gap-3 mb-2">
            {onExport && (
              <Button type="button" variant="link" size="sm" className="p-0 text-decoration-none fw-semibold" onClick={() => onExport(apiQuery, Boolean(dateError))} disabled={exporting}>
                {exporting ? "Exporting..." : "Export"}
              </Button>
            )}
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
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Payment</div>
              <Form.Select aria-label="Payment" value={payment} onChange={(event) => setQuery({ payment_status: event.target.value })} style={fieldStyle}>
                {PAYMENTS.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Prescription</div>
              <Form.Select aria-label="Prescription" value={prescription} onChange={(event) => setPrescription(event.target.value)} style={fieldStyle}>
                {PRESCRIPTIONS.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Status</div>
              <Form.Select aria-label="Status" value={status} onChange={(event) => setQuery({ status: event.target.value })} style={fieldStyle}>
                {ORDER_STATUSES.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
          </div>
          {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
        </div>

        <MuiDataTable
          columns={columns}
          data={orders}
          compact={false}
          emptyLabel="No orders found"
          getRowKey={(row) => row.id || row._id}
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
      </div >
    </>
  );
};