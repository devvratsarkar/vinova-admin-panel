import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { useGetFramesQuery, useUpdateStatusFrameMutation } from "../redux/features/framesAPIEndPoint";
import { catalogueSlice } from "../redux/services/catalogueSlice";
import { useExportAction } from "../utils/fileDownload";
import { useGetAllCategorySelectQuery } from "../redux/features/CategoryAPIEndPoint";
import { useGetBrandsSelectQuery } from "../redux/features/BrandAPIEndpoint";
import useDebounce from "../hooks/useDebounce";
import MuiDataTable from "../components/common/MuiDataTable";
import DateRangeFields from "../components/common/DateRangeFields";
import { allow } from "./permissions";

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }
const TYPES = [
  { value: '', label: 'All types' },
  { value: 'sunglass', label: 'Sunglass' },
  { value: 'specs', label: 'Specs' },
]
const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

function selectOptions(list, labelKey) {
  const rows = Array.isArray(list) ? list : [];
  return rows.map((item) => ({ value: item?._id || item?.id || "", label: item?.[labelKey] || "" })).filter((item) => item.value && item.label);
}

function readFrames(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.frames) ? payload.frames : [];
  const total = Number(payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const FrameDataTable = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || category || brand || status || type || fromDate || toDate);
  const { data: categoryData } = useGetAllCategorySelectQuery();
  const { data: brandData } = useGetBrandsSelectQuery();
  const categories = selectOptions(categoryData?.data, "category_name");
  const brands = selectOptions(brandData?.data, "name");

  const apiQuery = {
    page: currentPage,
    limit: pageSize,
    ...(category && { category }),
    ...(brand && { brand }),
    ...(status && { status }),
    ...(type && { type }),
    ...(datesReady && { fromDate, toDate }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  };
  const { data, isLoading, isFetching, refetch } = useGetFramesQuery(apiQuery, { skip: Boolean(dateError) });
  const { onExport, exporting } = useExportAction(catalogueSlice.endpoints.getFrames, "Frame", "Frames downloaded");
  const [updateStatus, { isLoading: loadingStatusChange }] = useUpdateStatusFrameMutation();
  const { rows, total } = readFrames(data);

  const handleStatusChange = async (id) => {
    try {
      const resp = await updateStatus(id);
      if (resp?.data?.http_status_code === 200) {
        refetch();
        toast.success(resp?.data?.message);
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setCategory("");
    setBrand("");
    setStatus("");
    setType("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, brand, status, type, fromDate, toDate]);

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
      id: "name",
      label: "Name",
      minWidth: 140,
      flex: 0.8,
      render: (row) => row?.name || "",
    },
    {
      id: "image",
      label: "Featured Image",
      width: 140,
      sortable: false,
      filterable: false,
      render: (row) => (
        <img src={row?.featured_image} alt={row?.name || ""} className="inventory_product_image" />
      ),
    },
    {
      id: "brand",
      label: "Brand",
      minWidth: 140,
      flex: 0.7,
      render: (row) => row?.brand?.name || "",
    },
    {
      id: "type",
      label: "Type",
      width: 130,
      render: (row) => row?.type || "",
    },
    {
      id: "status",
      label: "Status",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => (
        <label className="custom-switch">
          <input
            type="checkbox"
            className="custom-switch-input"
            checked={Boolean(row?.status)}
            onChange={() => handleStatusChange(row?._id)}
            disabled={!allow("Frame", "edit")}
          />
          <span className="custom-switch-indicator custum-green-btn"></span>
        </label>
      ),
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
      width: 200,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/catalogue/frames/view/${row?._id}`}>
              <Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button>
            </Link>
          </OverlayTrigger>
          {allow("Frame", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/catalogue/frames/edit/${row?._id}`}>
              <Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button>
            </Link>
          </OverlayTrigger>
)}
          {allow("Frame", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteFrame", data: row, softDelete: true }))}>
              <i className="fe fe-trash text-white"></i>
            </Button>
          </OverlayTrigger>
)}
        </div>
      ),
    },
  ], [currentPage, pageSize, dispatch]);

  return (
    <>
      {(isLoading || isFetching || loadingStatusChange) && <Loader />}
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
                placeholder="Name or brand"
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
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Category</div>
              <Form.Select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)} style={fieldStyle}>
                <option value="">All categories</option>
                {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Brand</div>
              <Form.Select aria-label="Brand" value={brand} onChange={(event) => setBrand(event.target.value)} style={fieldStyle}>
                <option value="">All brands</option>
                {brands.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Status</div>
              <Form.Select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}>
                {STATUSES.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
            <div>
              <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Type</div>
              <Form.Select aria-label="Type" value={type} onChange={(event) => setType(event.target.value)} style={fieldStyle}>
                {TYPES.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
              </Form.Select>
            </div>
          </div>
          {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
        </div>

        <MuiDataTable
          columns={columns}
          data={rows}
          compact={false}
          emptyLabel="No frames found"
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
