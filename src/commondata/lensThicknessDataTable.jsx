import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { useGetAllFiltersQuery } from "../redux/features/FiltersAPIEndPoint";
import { useGetAllLensThicknessQuery, useUpdateLensThicknessStatusMutation } from "../redux/features/lensThicknessAPIEndPoint";
import { useGetAllLensQuery } from "../redux/features/LensAPIEndPoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, indexColumn, namedOptions, useListFilters } from "../components/common/ListFilters";

function readThickness(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function coatingNames(row) {
  const list = Array.isArray(row?.filters) ? row.filters : Array.isArray(row?.lensFilters) ? row.lensFilters : [];
  return list.map((item) => (typeof item === "string" ? item : item?.name)).filter(Boolean);
}

const FILTER_KEYS = ["lens", "lensFilters", "type", "isFree", "status"];
const TYPES = [
  { value: "specs", label: "Specs" },
  { value: "sunglass", label: "Sunglass" },
];
const FREE_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const chipStyle = {
  display: "inline-block",
  background: "rgba(98,89,202,0.08)",
  color: "#4b45a1",
  borderRadius: 6,
  padding: "2px 8px",
  fontSize: "0.75rem",
  fontWeight: 500,
  lineHeight: 1.5,
  whiteSpace: "nowrap",
};

function ChipList({ items, limit = 2 }) {
  if (!items.length) return <span className="text-muted">—</span>;
  const visible = items.slice(0, limit);
  const hidden = items.slice(limit);
  return (
    <div className="d-flex flex-wrap gap-1 py-2">
      {visible.map((name, index) => <span key={index} style={chipStyle} title={name}>{name}</span>)}
      {hidden.length > 0 && (
        <OverlayTrigger placement="top" overlay={<Tooltip>{hidden.join(", ")}</Tooltip>}>
          <span style={{ ...chipStyle, background: "#f1f3f7", color: "#6b7280" }}>+{hidden.length} more</span>
        </OverlayTrigger>
      )}
    </div>
  );
}

export const LensThicknessDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data: lensData } = useGetAllLensQuery();
  const { data: coatingData } = useGetAllFiltersQuery();
  const { data, isLoading, isFetching, refetch } = useGetAllLensThicknessQuery(list.query, { skip: list.skip });
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateLensThicknessStatusMutation();
  const { rows, total } = readThickness(data);

  const handleStatus = async (id) => {
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

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 150, flex: 0.8, render: (row) => <span className="fw-semibold py-2">{row?.name || ""}</span> },
    {
      id: "price",
      label: "Category & Price",
      minWidth: 220,
      flex: 1.2,
      render: (row) => {
        const lensPrices = Array.isArray(row?.lensPrices) ? row.lensPrices : [];
        if (!lensPrices.length) return <span className="py-2">{row?.price ?? "—"}</span>;
        return (
          <div className="py-2 d-flex flex-column gap-1" style={{ fontSize: "0.8rem" }}>
            {lensPrices.map((item, index) => (
              <div key={item?.lens?._id || index}>
                <span style={{ color: "#4b5563" }}>{item?.lens?.name || "—"}:</span>
                <span className="fw-semibold ms-1" style={{ color: "#111827" }}>{item?.price}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "coating",
      label: "Coating",
      minWidth: 180,
      flex: 1,
      render: (row) => <ChipList items={coatingNames(row)} />,
    },
    { id: "type", label: "Type", width: 120, render: (row) => <span className="text-capitalize">{Array.isArray(row?.type) ? row.type.join(", ") : row?.type || ""}</span> },
    { id: "free", label: "Is Free", width: 100, render: (row) => row?.isFree ? "Yes" : "No" },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch checked={row?.status} onChange={() => handleStatus(row?._id)} />,
    },
    {
      id: "date",
      label: "Created At",
      width: 130,
      render: (row) => row?.createdAt ? (
        <div className="py-2" style={{ fontSize: "0.8rem" }}>
          <div>{moment(row.createdAt).format("DD-MM-YYYY")}</div>
          <div className="text-muted">{moment(row.createdAt).format("hh:mm A")}</div>
        </div>
      ) : "",
    },
    {
      id: "action",
      label: "Action",
      width: 190,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/catalogue/lens-thickness/view/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/catalogue/lens-thickness/edit/${row?._id}`}><Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteLensThickness", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch]);

  return (
    <>
      {(isLoading || isFetching || loadingStatus) && <Loader />}
      <div className="e-table pb-5">
        <ListFilters
          {...boundFilters(list, {
            placeholder: "Name",
            selects: [
              { label: "Lens quality category", value: list.filters.lens, onChange: (value) => list.setFilter("lens", value), empty: "All categories", options: namedOptions(lensData?.data) },
              { label: "Coating", value: list.filters.lensFilters, onChange: (value) => list.setFilter("lensFilters", value), empty: "All coatings", options: namedOptions(coatingData?.data) },
              { label: "Type", value: list.filters.type, onChange: (value) => list.setFilter("type", value), empty: "All types", options: TYPES },
              { label: "Is free", value: list.filters.isFree, onChange: (value) => list.setFilter("isFree", value), empty: "All", options: FREE_OPTIONS },
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No refractive indexes found" getRowHeight={() => "auto"} />
      </div>
    </>
  );
};
