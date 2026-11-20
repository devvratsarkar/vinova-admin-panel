import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import { useGetAllCustomFieldsQuery } from "../redux/features/customFieldsAPIEndPoint";
import { useGetAllCategorySelectQuery } from "../redux/features/CategoryAPIEndPoint";
import { ListFilters, ListTable, boundFilters, indexColumn, namedOptions, useListFilters, withTrash, TrashActions } from "../components/common/ListFilters";
import { allow } from "./permissions";
import { catalogueSlice } from "../redux/services/catalogueSlice";
import { exportProps, useExportAction } from "../utils/fileDownload";

const FILTER_KEYS = ["attribute_type", "category"];
const TYPES = [
  { value: "Color", label: "Color" },
  { value: "Shape", label: "Shape" },
  { value: "Select", label: "Select" },
];

function readCustomFields(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const CustomFieldDataTable = ({ viewingTrash = false }) => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const query = withTrash(list.query, viewingTrash);
  const { data: categoryData } = useGetAllCategorySelectQuery();
  const { data, isLoading, isFetching } = useGetAllCustomFieldsQuery(query, { skip: list.skip });
  const fileExport = useExportAction(catalogueSlice.endpoints.getAllCustomFields, "CustomField", "Custom fields downloaded");
  const { rows, total } = readCustomFields(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize, true),
    { id: "order", label: "Order", width: 90, render: (row) => row?.list_order ?? "" },
    { id: "name", label: "Name", minWidth: 160, flex: 1, render: (row) => row?.attribute_name || "" },
    { id: "type", label: "Type", width: 130, render: (row) => row?.attribute_type || "" },
    {
      id: "category",
      label: "Category",
      minWidth: 180,
      flex: 1,
      render: (row) => (Array.isArray(row?.category_id) ? row.category_id.map((item) => item?.category_name).filter(Boolean).join(", ") : ""),
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
          <TrashActions viewingTrash={viewingTrash} onRestore={() => dispatch(openModal({ componentName: "CustomFieldRestore", data: row }))} onDelete={() => dispatch(openModal({ componentName: "DeleteField", data: row, softDelete: false }))}>
          <OverlayTrigger placement="top" overlay={<Tooltip>Add Custom Field Value</Tooltip>}>
            <Link to={`/catalogue/custom-field-value/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-plus-square"></i></Button></Link>
          </OverlayTrigger>
          {allow("CustomField", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Button className="btn btn-icon btn-warning border-warning me-2" onClick={() => dispatch(openModal({ componentName: "EditCustomField", data: row }))}><i className="fe fe-edit"></i></Button>
          </OverlayTrigger>
)}
          {allow("CustomField", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button className="btn btn-icon btn-danger border-danger" onClick={() => dispatch(openModal({ componentName: "DeleteField", data: row, softDelete: true }))}><i className="fe fe-trash"></i></Button>
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
            placeholder: "Name",
            ...exportProps(fileExport, query, list.skip),
            selects: [
              { label: "Type", value: list.filters.attribute_type, onChange: (value) => list.setFilter("attribute_type", value), empty: "All types", options: TYPES },
              { label: "Category", value: list.filters.category, onChange: (value) => list.setFilter("category", value), empty: "All categories", options: namedOptions(categoryData?.data, "category_name") },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No custom fields found" getRowHeight={() => "auto"} />
      </div>
    </>
  );
};
