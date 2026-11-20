import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import { useGetAllAccessoriesDataQuery } from "../redux/features/framesAPIEndPoint";
import { useGetBrandsSelectQuery } from "../redux/features/BrandAPIEndpoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, namedOptions, useListFilters, withTrash, TrashActions } from "../components/common/ListFilters";
import { allow } from "./permissions";
import { catalogueSlice } from "../redux/services/catalogueSlice";
import { exportProps, useExportAction } from "../utils/fileDownload";

const FILTER_KEYS = ["brand", "status"];

function readAccessories(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const AccessoriesDataTable = ({ viewingTrash = false }) => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const query = withTrash(list.query, viewingTrash);
  const { data: brandData } = useGetBrandsSelectQuery();
  const { data, isLoading, isFetching } = useGetAllAccessoriesDataQuery(query, { skip: list.skip });
  const fileExport = useExportAction(catalogueSlice.endpoints.getAllAccessoriesData, "Accessories", "Accessories downloaded");
  const { rows, total } = readAccessories(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 140, flex: 0.8, render: (row) => row?.name || "" },
    {
      id: "image",
      label: "Featured Image",
      width: 140,
      sortable: false,
      filterable: false,
      render: (row) => <img src={row?.featured_image} alt={row?.name || ""} className="inventory_product_image" />,
    },
    { id: "brand", label: "Brand", minWidth: 140, flex: 0.7, render: (row) => row?.brand?.name || "" },
    { id: "type", label: "Type", width: 130, render: (row) => row?.type || "" },
    {
      id: "status",
      label: "Status",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch checked={row?.status} disabled />,
    },
    { id: "date", label: "Created At", minWidth: 190, flex: 0.8, render: (row) => formatDate(row?.createdAt) },
    {
      id: "action",
      label: "Action",
      width: 200,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <TrashActions viewingTrash={viewingTrash} onRestore={() => dispatch(openModal({ componentName: "RestoreAccessories", data: row }))} onDelete={() => dispatch(openModal({ componentName: "DeleteAccessroies", data: row, softDelete: false }))}>
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/catalogue/accessories/view/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          {allow("Accessories", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/catalogue/accessories/edit/${row?._id}`}><Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
)}
          {allow("Accessories", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteAccessroies", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
)}
          </TrashActions>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch, viewingTrash]);

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <div className="e-table pb-5">
        <ListFilters
          {...boundFilters(list, {
            placeholder: "Name or brand",
            ...exportProps(fileExport, query, list.skip),
            selects: [
              { label: "Brand", value: list.filters.brand, onChange: (value) => list.setFilter("brand", value), empty: "All brands", options: namedOptions(brandData?.data) },
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No accessories found" getRowHeight={() => "auto"} />
      </div>
    </>
  );
};
