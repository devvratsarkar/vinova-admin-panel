import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { useGetAllCategoryQuery, useGetAllCategorySelectQuery, useUpdateCategoryStatusMutation } from "../redux/features/CategoryAPIEndPoint";
import useDebounce from "../hooks/useDebounce";
import MuiDataTable from "../components/common/MuiDataTable";
import DateRangeFields from "../components/common/DateRangeFields";
import { allow } from "./permissions";
import { TrashActions } from "../components/common/ListFilters";
import { catalogueSlice } from "../redux/services/catalogueSlice";
import { useExportAction } from "../utils/fileDownload";

const fieldStyle = { borderColor: "#e8edf3", borderRadius: 10, fontSize: 13, backgroundColor: "#fff" };
const TYPES = [
  { value: "", label: "All types" },
  { value: "Men", label: "Men" },
  { value: "Women", label: "Women" },
  { value: "Kid", label: "Kid" },
];
const STATUSES = [
  { value: "", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const getCategoryImage = (row) =>
  row?.featured_image || row?.featured_image_women || row?.featured_image_kid || "";

function typeText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
}

function selectOptions(list) {
  const rows = Array.isArray(list) ? list : [];
  return rows
    .map((item) => ({ value: item?._id || item?.id || "", label: item?.category_name || "" }))
    .filter((item) => item.value && item.label);
}

function readCategories(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.categories) ? payload.categories : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function CategoryStatusSwitch({ row, updateStatus, onSuccess }) {
  const [checked, setChecked] = useState(!!row?.status);

  useEffect(() => {
    setChecked(!!row?.status);
  }, [row?.status]);

  const handleStatusChange = async () => {
    const nextStatus = !checked;
    setChecked(nextStatus);

    try {
      const resp = await updateStatus({
        id: row?._id,
        formData: { status: nextStatus },
      });

      if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
        onSuccess?.();
        toast.success(resp?.data?.message || "Status updated successfully");
      } else {
        setChecked(!nextStatus);
        toast.error(resp?.data?.message || "Failed to update status");
      }
    } catch (err) {
      setChecked(!nextStatus);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <label className="custom-switch" style={{ cursor: "pointer" }}>
      <input
        type="checkbox"
        className="custom-switch-input"
        onChange={handleStatusChange}
        checked={checked}
       disabled={!allow("Category", "edit")} />
      <span className="custom-switch-indicator custum-green-btn"></span>
    </label>
  );
}

export const CategoryDataTable = ({ viewingTrash = false }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || parentCategory || type || status || fromDate || toDate);
  const { data: parentOptions } = useGetAllCategorySelectQuery();
  const parents = selectOptions(parentOptions?.data);

  const apiQuery = {
    page: currentPage,
    limit: pageSize,
    ...(parentCategory && { parent_category: parentCategory }),
    ...(type && { type }),
    ...(status && { status }),
    ...(datesReady && { fromDate, toDate }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...(viewingTrash && { trash: true }),
  };
  const { data, isLoading, isFetching, refetch } = useGetAllCategoryQuery(apiQuery, { skip: Boolean(dateError) });
  const { onExport, exporting } = useExportAction(catalogueSlice.endpoints.getAllCategory, "Category", "Categories downloaded");
  const [updateStatus, { isLoading: loadingStatusChange }] = useUpdateCategoryStatusMutation();
  const { rows, total } = readCategories(data);

  const handleClear = () => {
    setSearchTerm("");
    setParentCategory("");
    setType("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, parentCategory, type, status, fromDate, toDate]);

  const columns = useMemo(() => [
    {
      id: "index",
      label: "#",
      width: 90,
      sortable: false,
      filterable: false,
      render: (row, index) => {
        const serial = (currentPage - 1) * pageSize + index + 1;
        return row?.id != null ? `${serial} {${row.id}}` : serial;
      },
    },
    {
      id: "name",
      label: "Category Name",
      minWidth: 160,
      flex: 1,
      render: (row) => row?.category_name || "",
    },
    {
      id: "image",
      label: "Category Image",
      width: 150,
      sortable: false,
      filterable: false,
      render: (row) => {
        const imageSrc = getCategoryImage(row);
        if (!imageSrc) return "N/A";
        return <img src={imageSrc} alt={row?.category_name || ""} className="inventory_product_image" />;
      },
    },
    {
      id: "parent",
      label: "Parent Category",
      minWidth: 160,
      flex: 0.8,
      render: (row) => row?.parent_category?.category_name || "",
    },
    {
      id: "type",
      label: "Type",
      minWidth: 140,
      flex: 0.6,
      render: (row) => typeText(row?.type),
    },
    {
      id: "status",
      label: "Status",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => (
        <CategoryStatusSwitch row={row} updateStatus={updateStatus} onSuccess={refetch} />
      ),
    },
    {
      id: "date",
      label: "Created At",
      minWidth: 190,
      flex: 0.8,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
    },
    {
      id: "action",
      label: "Action",
      width: 200,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <TrashActions viewingTrash={viewingTrash} onRestore={() => dispatch(openModal({ componentName: "CategoryRestore", data: row }))} onDelete={() => dispatch(openModal({ componentName: "DeleteCategory", data: row, softDelete: false }))}>
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/catalogue/category/${row?._id}`}>
              <Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button>
            </Link>
          </OverlayTrigger>
          {!row?.is_disabled && (
            <>
              {allow("Category", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Link to={`/catalogue/edit-category/${row?._id}`}>
                  <Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button>
                </Link>
              </OverlayTrigger>
)}
              {allow("Category", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                <Button
                  type="button"
                  className="btn btn-icon btn-danger"
                  variant=""
                  onClick={() => dispatch(openModal({ componentName: "DeleteCategory", data: row, softDelete: true }))}
                >
                  <i className="fe fe-trash text-white"></i>
                </Button>
              </OverlayTrigger>
)}
            </>
          )}
          </TrashActions>
        </div>
      ),
    },
  ], [currentPage, pageSize, dispatch, refetch, updateStatus, viewingTrash]);

  return (
    <>
      {(isLoading || isFetching || loadingStatusChange) && <Loader />}
      <div className="e-table pb-5">
        <div className="orders-filters mx-3 mt-3 mb-4 p-3" style={{ background: "#f8fafc", border: "1px solid #e8edf3", borderRadius: 10 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Search</div>
              <Form.Control
                aria-label="Search"
                placeholder="Category name"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{ ...fieldStyle, backgroundColor: searchTerm ? "#eef5ff" : "#fff" }}
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
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Parent category</div>
              <Form.Select aria-label="Parent category" value={parentCategory} onChange={(event) => setParentCategory(event.target.value)} style={fieldStyle}>
                <option value="">All parents</option>
                {parents.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Type</div>
              <Form.Select aria-label="Type" value={type} onChange={(event) => setType(event.target.value)} style={fieldStyle}>
                {TYPES.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
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
          emptyLabel="No categories found"
          getRowKey={(row) => row._id || row.id}
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
};
