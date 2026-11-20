import React, { useEffect, useMemo, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { useGetBrandsQuery, useGetBrandsSelectQuery, useUpdateBrandStatusMutation } from "../redux/features/BrandAPIEndpoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, indexColumn, useListFilters } from "../components/common/ListFilters";

const FILTER_KEYS = ["status"];

function readBrands(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function BrandStatusSwitch({ row, onToggle }) {
  const [checked, setChecked] = useState(!!row?.status);
  useEffect(() => setChecked(!!row?.status), [row?.status]);
  return (
    <StatusSwitch
      checked={checked}
      onChange={() => {
        setChecked(!checked);
        onToggle(row?._id);
      }}
    />
  );
}

export const BrandDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, refetch } = useGetBrandsQuery(list.query, { skip: list.skip });
  const { refetch: refetchSelectBrand } = useGetBrandsSelectQuery();
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateBrandStatusMutation();
  const { rows, total } = readBrands(data);

  const handleUpdateStatus = async (id) => {
    try {
      const resp = await updateStatus(id);
      if (resp?.data?.http_status_code === 200) {
        refetch();
        refetchSelectBrand();
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
    { id: "name", label: "Brand Name", minWidth: 160, flex: 0.8, render: (row) => row?.name || "" },
    {
      id: "image",
      label: "Image",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => row?.featured_image
        ? <img src={row.featured_image} alt={row.name || ""} width={60} height={60} style={{ objectFit: "contain", borderRadius: 6 }} />
        : "N/A",
    },
    {
      id: "description",
      label: "Short Description",
      minWidth: 220,
      flex: 1.2,
      render: (row) => (
        <div className="text-truncate" style={{ maxWidth: 280 }} dangerouslySetInnerHTML={{ __html: row?.short_description || "—" }} />
      ),
    },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <BrandStatusSwitch row={row} onToggle={handleUpdateStatus} />,
    },
    { id: "type", label: "Type", minWidth: 120, flex: 0.5, render: (row) => row?.type || "" },
    {
      id: "action",
      label: "Action",
      width: 190,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center gap-1">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/view-brand/${row?._id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/edit-brand/${row?._id}`}><Button className="btn btn-icon btn-warning border-warning"><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteBrand", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
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
            placeholder: "Brand name",
            selects: [
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No brands found" getRowHeight={() => "auto"} />
      </div>
    </>
  );
};
