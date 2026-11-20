import React, { useEffect, useMemo, useState } from "react";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { openModal } from "../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import moment from "moment";
import { useGetAllCartsQuery } from "../redux/features/cartAPIEndPoint";
import useDebounce from "../hooks/useDebounce";
import MuiDataTable from "../components/common/MuiDataTable";
import DateRangeFields from "../components/common/DateRangeFields";

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }

function readList(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.carts) ? payload.carts : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function customerName(row) {
  const user = row?.user;
  if (!user || typeof user === "string") return user || "Guest User";
  return user.name || user.phone_number || user.email || "Guest User";
}

function customerEmail(row) {
  const user = row?.user;
  if (!user || typeof user === "string") return "";
  return user.email || "";
}

function totalText(row) {
  const amount = Number(row?.total_amount ?? 0);
  const value = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return row?.currencyCode ? `${value} ${row.currencyCode}` : value;
}

export default function CartDataTable() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || fromDate || toDate);

  const { data, isLoading, isFetching } = useGetAllCartsQuery({
    page: currentPage,
    limit: pageSize,
    ...(datesReady && { fromDate, toDate }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  }, { skip: Boolean(dateError) });

  const { rows, total } = readList(data);

  const handleClear = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, fromDate, toDate]);

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
      label: "Customer Name",
      minWidth: 180,
      flex: 1,
      render: (row) => customerName(row),
    },
    {
      id: "email",
      label: "Customer Email",
      minWidth: 200,
      flex: 1,
      render: (row) => customerEmail(row),
    },
    {
      id: "items",
      label: "No. Of Items",
      numeric: true,
      width: 140,
      render: (row) => row?.item_count || 0,
    },
    {
      id: "total",
      label: "Grand Total",
      numeric: true,
      nowrap: true,
      minWidth: 140,
      flex: 0.7,
      render: (row) => totalText(row),
    },
    {
      id: "date",
      label: "Created At",
      minWidth: 190,
      flex: 0.9,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
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
              onClick={() => dispatch(openModal({ componentName: "ViewCart", data: row }))}
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
                placeholder="Name or email"
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
          </div>
          {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
        </div>

        <MuiDataTable
          columns={columns}
          data={rows}
          compact={false}
          emptyLabel="No carts found"
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
      </div>
    </>
  );
}
