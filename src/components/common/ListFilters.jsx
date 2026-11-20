import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import DateRangeFields from "./DateRangeFields";
import MuiDataTable from "./MuiDataTable";
import SelectWithDragDrop from "./SelectWithDragDrop";
import useDebounce from "../../hooks/useDebounce";

const fieldStyle = { borderColor: "#e8edf3", borderRadius: 10, fontSize: 13, backgroundColor: "#fff" };

export const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export function readList(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  const total = Number(
    response?.pagination?.total ?? response?.total ?? payload?.pagination?.total ?? payload?.total
  );
  const paginated = Number.isFinite(total);
  return { rows, total: paginated ? total : rows.length, paginated };
}

export function visibleRows(result, page, pageSize) {
  const rows = result?.rows || [];
  if (result?.paginated) return rows;
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function namedOptions(source, labelKey = "name") {
  const rows = Array.isArray(source) ? source : Array.isArray(source?.data) ? source.data : [];
  return rows
    .map((item) => ({ value: item?._id || item?.id || "", label: item?.[labelKey] || "" }))
    .filter((item) => item.value && item.label);
}

export function formatDate(value) {
  return value ? moment(value).format("DD-MM-YYYY [at] hh:mm A") : "";
}

export function indexColumn(page, pageSize, withId = false) {
  return {
    id: "index",
    label: "#",
    width: withId ? 96 : 64,
    sortable: false,
    filterable: false,
    render: (row, index) => {
      const serial = (page - 1) * pageSize + index + 1;
      return withId && row?.id != null ? `${serial} {${row.id}}` : serial;
    },
  };
}

export function useListFilters(keys = [], initial = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState(initial.search || "");
  const [fromDate, setFromDate] = useState(initial.fromDate || "");
  const [toDate, setToDate] = useState(initial.toDate || "");
  const [dateError, setDateError] = useState("");
  const [filters, setFilters] = useState(() => Object.fromEntries(keys.map((key) => [key, initial[key] || ""])));
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const filterKey = JSON.stringify(filters);

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const hasFilters = Boolean(searchTerm || fromDate || toDate || Object.values(filters).some(Boolean));

  const clearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setFilters(Object.fromEntries(keys.map((key) => [key, ""])));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, fromDate, toDate, filterKey]);

  const query = useMemo(() => {
    const extra = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) extra[key] = value;
    });
    return {
      page: currentPage,
      limit: pageSize,
      ...(datesReady && { fromDate, toDate }),
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...extra,
    };
  }, [currentPage, pageSize, datesReady, fromDate, toDate, debouncedSearch, filters]);

  const onPaginationModelChange = (model) => {
    if (model.pageSize !== pageSize) {
      setPageSize(model.pageSize);
      setCurrentPage(1);
      return;
    }
    setCurrentPage(model.page + 1);
  };

  return {
    currentPage,
    pageSize,
    searchTerm,
    setSearchTerm,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    dateError,
    setDateError,
    filters,
    setFilter,
    hasFilters,
    clearFilters,
    query,
    skip: Boolean(dateError),
    onPaginationModelChange,
  };
}

export function withTrash(query, viewingTrash) {
  return viewingTrash ? { ...query, trash: true } : query;
}

export function TrashActions({ viewingTrash, onRestore, onDelete, children }) {
  if (!viewingTrash) return children;
  return (
    <>
      <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
        <Button type="button" className="btn btn-icon btn-warning" variant="" onClick={onRestore}><i className="fe fe-refresh-ccw text-white"></i></Button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
        <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={onDelete}><i className="fe fe-trash text-white"></i></Button>
      </OverlayTrigger>
    </>
  );
}

export function TrashButton({ show, viewing, onToggle, label = "Trash", backLabel = "All" }) {
  if (!show && !viewing) return null;
  return (
    <Button type="button" variant={viewing ? "primary" : "danger"} className="text-white" onClick={onToggle}>
      <i className={`fe ${viewing ? "fe-list" : "fe-trash"} me-1`}></i>
      {viewing ? backLabel : label}
    </Button>
  );
}

export function boundFilters(list, extra = {}) {
  return {
    search: list.searchTerm,
    onSearch: list.setSearchTerm,
    fromDate: list.fromDate,
    toDate: list.toDate,
    onFromDate: list.setFromDate,
    onToDate: list.setToDate,
    onDateError: list.setDateError,
    dateError: list.dateError,
    onClear: list.clearFilters,
    hasFilters: list.hasFilters,
    ...extra,
  };
}

export function ListFilters({
  search,
  onSearch,
  placeholder = "Search",
  fromDate,
  toDate,
  onFromDate,
  onToDate,
  onDateError,
  dateError,
  selects = [],
  onClear,
  hasFilters,
  onExport,
  exporting = false,
}) {
  return (
    <div className="orders-filters mx-3 mt-3 mb-4 p-3" style={{ background: "#f8fafc", border: "1px solid #e8edf3", borderRadius: 10 }}>
      <div className="d-flex justify-content-end align-items-center gap-3 mb-2">
        {onExport && (
          <Button type="button" variant="link" size="sm" className="p-0 text-decoration-none fw-semibold" onClick={onExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Export"}
          </Button>
        )}
        <Button type="button" variant="link" size="sm" className="p-0 text-decoration-none fw-semibold" onClick={onClear} disabled={!hasFilters}>
          Clear filters
        </Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
        <div>
          <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Search</div>
          <Form.Control
            aria-label="Search"
            placeholder={placeholder}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            style={{ ...fieldStyle, backgroundColor: search ? "#eef5ff" : "#fff" }}
          />
        </div>
        <DateRangeFields fromDate={fromDate} toDate={toDate} onFromDate={onFromDate} onToDate={onToDate} onError={onDateError} />
        {selects.map((select) => (
          <div key={select.label}>
            <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>{select.label}</div>
            {select.searchable ? (
              <SelectWithDragDrop
                aria-label={select.label}
                options={select.options || []}
                value={(select.options || []).find((item) => item.value === select.value) || null}
                onChange={(option) => select.onChange(option?.value || "")}
                placeholder={select.empty || "All"}
                isClearable
                isSearchable
                menuPlacement="bottom"
                styles={{
                  control: (base) => ({ ...base, minHeight: 38, height: 38, borderColor: "#e8edf3", borderRadius: 10, boxShadow: "none", fontSize: 13, backgroundColor: select.value ? "#eef5ff" : "#fff" }),
                  valueContainer: (base) => ({ ...base, height: 38, padding: "0 10px" }),
                  indicatorsContainer: (base) => ({ ...base, height: 38 }),
                  indicatorSeparator: () => ({ display: "none" }),
                  placeholder: (base) => ({ ...base, color: "#212529" }),
                  singleValue: (base) => ({ ...base, color: "#212529" }),
                }}
              />
            ) : (
              <Form.Select aria-label={select.label} value={select.value} onChange={(event) => select.onChange(event.target.value)} style={fieldStyle}>
                {select.empty != null && <option value="">{select.empty}</option>}
                {(select.options || []).map((item) => (
                  <option key={`${item.value}-${item.label}`} value={item.value}>{item.label}</option>
                ))}
              </Form.Select>
            )}
          </div>
        ))}
      </div>
      {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
    </div>
  );
}

export function ListTable({ columns, rows, total, page, pageSize, onPagination, emptyLabel, getRowKey, getRowHeight, onRowClick, disableRowSelectionOnClick, checkboxSelection, rowSelectionModel, onRowSelectionModelChange, sx, ...rest }) {
  return (
    <MuiDataTable
      columns={columns}
      data={rows}
      compact={false}
      emptyLabel={emptyLabel}
      getRowKey={getRowKey || ((row) => row?._id || row?.id)}
      getRowHeight={getRowHeight}
      paginationMode="server"
      filterMode="server"
      disableColumnFilter
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      checkboxSelection={checkboxSelection}
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={onRowSelectionModelChange}
      rowCount={total}
      paginationModel={{ page: page - 1, pageSize }}
      onPaginationModelChange={onPagination}
      onRowClick={onRowClick}
      sx={sx}
      {...rest}
    />
  );
}

export function StatusSwitch({ checked, onChange, disabled }) {
  return (
    <label className="custom-switch" style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
      <input type="checkbox" className="custom-switch-input" checked={Boolean(checked)} onChange={onChange} disabled={disabled} />
      <span className="custom-switch-indicator custum-green-btn"></span>
    </label>
  );
}
