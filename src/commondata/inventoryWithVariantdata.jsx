import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import { useGetAllInventoryVariantsQuery } from "../redux/features/inventory";
import { ListFilters, ListTable, TrashActions, boundFilters, formatDate, indexColumn, useListFilters, withTrash } from "../components/common/ListFilters";
import { allow } from "./permissions";
import { catalogueSlice } from "../redux/services/catalogueSlice";
import { exportProps, useExportAction } from "../utils/fileDownload";

function readInventoryVariants(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const InventoryWithVariantDataTable = ({ viewingTrash = false }) => {
  const dispatch = useDispatch();
  const list = useListFilters();
  const query = withTrash(list.query, viewingTrash);
  const { data, isError, error, isLoading, isFetching } = useGetAllInventoryVariantsQuery(query, { skip: list.skip });
  const fileExport = useExportAction(catalogueSlice.endpoints.getAllInventoryVariants, "InventoryWithVariant", "Inventory downloaded");
  const { rows, total } = readInventoryVariants(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Product Name", minWidth: 160, flex: 1.2, render: (row) => row?.product?.name || "" },
    {
      id: "image",
      label: "Image",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => (row?.product?.featured_image ? <img src={row.product.featured_image} height={50} alt={row?.product?.name || ""} /> : ""),
    },
    { id: "brand", label: "Brand", minWidth: 140, flex: 1, render: (row) => row?.brand?.name || "" },
    { id: "created", label: "CreatedAt", minWidth: 180, flex: 1, nowrap: true, render: (row) => formatDate(row?.inventory_items?.[0]?.createdAt) },
    {
      id: "action",
      label: "Action",
      width: 140,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <TrashActions viewingTrash={viewingTrash} onRestore={() => dispatch(openModal({ componentName: "RestoreInventoryWithVariant", data: row }))} onDelete={() => dispatch(openModal({ componentName: "AddTrashVariant", data: row, softDelete: false }))}>
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/stocks/inventory-variant-sizes/${row?.product?._id}`}><Button type="button" className="btn btn-icon btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          {allow("InventoryWithVariant", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "AddTrashVariant", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
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
      {isError && <Error error_mes={error} />}
      <div className="e-table pb-5">
        <ListFilters {...boundFilters(list, { placeholder: "Product, SKU, or price", ...exportProps(fileExport, query, list.skip) })} />
        <ListTable
          columns={columns}
          rows={rows}
          total={total}
          page={list.currentPage}
          pageSize={list.pageSize}
          onPagination={list.onPaginationModelChange}
          emptyLabel="No inventory found"
          getRowHeight={() => "auto"}
        />
      </div>
    </>
  );
};
