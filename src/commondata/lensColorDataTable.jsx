import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { useGetLensColorQuery, useUpdateLinseColorStatusMutation } from "../redux/features/lensColorAPIEndPoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from "../components/common/ListFilters";
import { allow } from "./permissions";

const FILTER_KEYS = ["status"];

function readLensColors(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const LensColorDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, refetch } = useGetLensColorQuery(list.query, { skip: list.skip });
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateLinseColorStatusMutation();
  const { rows, total } = readLensColors(data);

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
    indexColumn(list.currentPage, list.pageSize, true),
    { id: "name", label: "Name", minWidth: 160, flex: 1, render: (row) => row?.name || "" },
    {
      id: "color",
      label: "Color",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => (
        <div style={{ width: 30, height: 30, backgroundColor: row?.code || "transparent", borderRadius: 4, border: "1px solid #ccc" }} />
      ),
    },
    { id: "date", label: "Created At", minWidth: 190, flex: 0.8, render: (row) => formatDate(row?.createdAt) },
    {
      id: "status",
      label: "Status",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch disabled={!allow("LensColor", "edit")}  checked={row?.status} onChange={() => handleStatus(row?.id)} />,
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
            <Link to={`/catalogue/lens-color/view/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          {allow("LensColor", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/catalogue/lens-color/edit/${row?._id}`}><Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
)}
          {allow("LensColor", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteLensColor", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
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
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No lens colors found" />
      </div>
    </>
  );
};
