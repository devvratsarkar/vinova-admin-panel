import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { useGetAllFiltersQuery, useUpdateLensTypeStatusMutation } from "../redux/features/FiltersAPIEndPoint";
import { useGetAllLensQuery } from "../redux/features/LensAPIEndPoint";
import { useGetLensColorQuery } from "../redux/features/lensColorAPIEndPoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, namedOptions, useListFilters } from "../components/common/ListFilters";
import { allow } from "./permissions";

function readCoatings(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

const FILTER_KEYS = ["lens", "lensColor", "type", "status"];
const TYPES = [
  { value: "specs", label: "Specs" },
  { value: "sunglass", label: "Sunglass" },
];

export const FilterDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data: lensData } = useGetAllLensQuery();
  const { data: colorData } = useGetLensColorQuery();
  const { data, isLoading, isFetching, refetch } = useGetAllFiltersQuery(list.query, { skip: list.skip });
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateLensTypeStatusMutation();
  const { rows, total } = readCoatings(data);

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
    { id: "name", label: "Name", minWidth: 140, flex: 0.8, render: (row) => row?.name || "" },
    {
      id: "lens",
      label: "Lens quality category",
      minWidth: 180,
      flex: 1,
      render: (row) => (row?.lens || []).map((item) => item?.name).filter(Boolean).join(", "),
    },
    {
      id: "color",
      label: "Lens Color",
      minWidth: 150,
      flex: 0.8,
      render: (row) => (row?.lensColor || []).map((item) => item?.name).filter(Boolean).join(", "),
    },
    { id: "type", label: "Type", width: 120, render: (row) => row?.type || "" },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch disabled={!allow("LensType", "edit")}  checked={row?.status} onChange={() => handleStatus(row?._id)} />,
    },
    { id: "date", label: "Created At", minWidth: 180, flex: 0.7, render: (row) => formatDate(row?.createdAt) },
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
            <Link to={`/catalogue/lens-type/view/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          {allow("LensType", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/catalogue/lens-type/edit/${row?._id}`}><Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
)}
          {allow("LensType", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteFilter", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
)}
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
              { label: "Lens color", value: list.filters.lensColor, onChange: (value) => list.setFilter("lensColor", value), empty: "All colors", options: namedOptions(colorData?.data) },
              { label: "Type", value: list.filters.type, onChange: (value) => list.setFilter("type", value), empty: "All types", options: TYPES },
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No coatings found" getRowHeight={() => "auto"} />
      </div>
    </>
  );
};
