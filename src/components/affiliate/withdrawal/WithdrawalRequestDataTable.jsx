import React, { useEffect, useMemo, useState } from "react";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../layouts/layoutcomponents/loader";
import { affiliateAPIEndPoint, useGetAllWithdrawalRequestDataQuery } from "../../../redux/features/affiliateAPIEndPoint";
import { useExportAction } from "../../../utils/fileDownload";
import { openModal } from "../../../redux/slices/allModalSlice";
import useDebounce from "../../../hooks/useDebounce";
import MuiDataTable from "../../common/MuiDataTable";
import DateRangeFields from "../../common/DateRangeFields";

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }
const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Cancelled', label: 'Cancelled' },
]

function readList(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function customerCell(row) {
  const name = row?.user?.name;
  const contact = row?.user?.phone_number || row?.user?.email || "";
  if (!name && !contact) return "";
  return (
    <div className="py-1">
      {name && <div>{name}</div>}
      {contact && <div>{contact}</div>}
    </div>
  );
}

function amountText(row) {
  const amount = Number(row?.amount ?? 0);
  const value = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${row?.currency_symbol || ""}${value}`;
}

export default function WithdrawalRequestDataTable() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(() => searchParams.get("status") || "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || status || fromDate || toDate);

  const apiQuery = {
    page: currentPage,
    limit: pageSize,
    ...(status && { status }),
    ...(datesReady && { fromDate, toDate }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  };
  const { data, isLoading, isFetching } = useGetAllWithdrawalRequestDataQuery(apiQuery, { skip: Boolean(dateError) });
  const { onExport, exporting } = useExportAction(affiliateAPIEndPoint.endpoints.getAllWithdrawalRequestData, "WithDrawl", "Withdrawal requests downloaded");

  const { rows, total } = readList(data);

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
      id: "customer",
      label: "Customer",
      minWidth: 200,
      flex: 1,
      render: customerCell,
    },
    {
      id: "date",
      label: "Date",
      minWidth: 180,
      flex: 0.8,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
    },
    {
      id: "amount",
      label: "Withdrawal Amount",
      numeric: true,
      nowrap: true,
      minWidth: 170,
      flex: 0.8,
      render: (row) => amountText(row),
    },
    {
      id: "reference",
      label: "Reference ID",
      minWidth: 150,
      flex: 0.8,
      render: (row) => row?.reference_id || "",
    },
    {
      id: "account",
      label: "Account",
      minWidth: 180,
      flex: 1,
      render: (row) => row?.bank?.account_number || row?.paypal?.paypal_email || "",
    },
    {
      id: "status",
      label: "Status",
      width: 140,
      render: (row) => row?.status || "",
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
            <Button
              className="btn btn-icon btn-primary"
              onClick={() => dispatch(openModal({ componentName: "TransectionDetails", data: row }))}
            >
              <i className="fe fe-eye"></i>
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [currentPage, pageSize, dispatch]);

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
                placeholder="Phone, email, or reference"
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
                {STATUSES.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
          </div>
          {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
        </div>

        <MuiDataTable
          columns={columns}
          data={rows}
          compact={false}
          emptyLabel="No withdrawal requests found"
          getRowKey={(row) => row.id || row._id}
          getRowHeight={() => "auto"}
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
}
