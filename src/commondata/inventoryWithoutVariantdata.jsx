import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import { useGetAllInventoryWithoutVariantQuery } from "../redux/features/inventory";
import { ListFilters, ListTable, boundFilters, formatDate, indexColumn, useListFilters } from "../components/common/ListFilters";

function readInventory(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function sellingPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? price : "";
}

export const InventoryWithoutVariantDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters();
  const { data, isError, error, isLoading, isFetching } = useGetAllInventoryWithoutVariantQuery(list.query, { skip: list.skip });
  const { rows, total } = readInventory(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 100, flex: 1.2, render: (row) => row?.product_id?.name || "" },
    {
      id: "image",
      label: "Image",
      width: 80,
      sortable: false,
      filterable: false,
      render: (row) => (row?.product_id?.featured_image ? <img src={row.product_id.featured_image} height={50} alt={row?.product_id?.name || ""} /> : ""),
    },
    { id: "sku", label: "SKU", minWidth: 70, flex: 0.6, render: (row) => row?.sku || "" },
    { id: "price", label: "Selling Price", minWidth: 90, flex: 0.7, render: (row) => sellingPrice(row?.selling_price) },
    { id: "stock", label: "Stock Quantity", minWidth: 90, flex: 0.7, render: (row) => row?.stock_quantity ?? "" },
    { id: "created", label: "CreatedAt", minWidth: 120, flex: 1, render: (row) => formatDate(row?.createdAt) },
    {
      id: "action",
      label: "Action",
      width: 150,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/inventory/view-invertory-without-variant/${row._id}`}><Button type="button" className="btn btn-icon btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/inventory/edit-invertory-without-variant/${row._id}`} className="action_icon"><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteInventoryWithoutVariant", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch]);

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      {isError && <Error error_mes={error} />}
      <div className="e-table pb-5">
        <ListFilters {...boundFilters(list, { placeholder: "Name, SKU, or price" })} />
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
