import React, { useEffect, useMemo, useRef } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import { useGetAllBlogsCategoryQuery } from "../../../redux/features/getApiSecond";
import { openModal } from "../../../redux/slices/allModalSlice";
import { ListFilters, ListTable, boundFilters, indexColumn, useListFilters } from "../../common/ListFilters";

function readCategories(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function plainText(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function useRefreshAfterBareQuery(bare, refetch) {
  const seen = useRef(null);
  useEffect(() => {
    const stamp = bare?.fulfilledTimeStamp;
    if (!stamp) return;
    if (seen.current == null) {
      seen.current = stamp;
      return;
    }
    if (seen.current !== stamp) {
      seen.current = stamp;
      refetch();
    }
  }, [bare?.fulfilledTimeStamp, refetch]);
}

export const BlogsCategoriesDatatable = () => {
  const dispatch = useDispatch();
  const list = useListFilters();
  const bare = useGetAllBlogsCategoryQuery();
  const { data, isError, error, isLoading, isFetching, refetch } = useGetAllBlogsCategoryQuery(list.query, { skip: list.skip });
  useRefreshAfterBareQuery(bare, refetch);
  const { rows, total } = readCategories(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 140, flex: 1, render: (row) => row?.name || row?.category_name || "N/A" },
    {
      id: "image",
      label: "Image",
      width: 100,
      sortable: false,
      filterable: false,
      render: (row) => (row?.banner_image ? <img src={row.banner_image} alt="" height={50} width={50} /> : ""),
    },
    {
      id: "description",
      label: "Description",
      minWidth: 180,
      flex: 1.4,
      render: (row) => {
        const text = plainText(row?.description);
        return <div className="text-truncate" style={{ maxWidth: 320 }} title={text}>{text || "N/A"}</div>;
      },
    },
    { id: "slug", label: "Slug", minWidth: 140, flex: 1, render: (row) => row?.slug || "" },
    {
      id: "action",
      label: "Action",
      width: 160,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => {
        const rowId = row?._id || row?.id;
        return (
          <div className="action_icon_wrapper d-flex justify-content-center">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/all-blog-category/view-blog-category/${rowId}`} className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link to={`/all-blog-category/edit-blog-category/${rowId}`} className="btn btn-icon btn-warning"><i className="fe fe-edit"></i></Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Button type="button" className="btn btn-icon btn-danger" onClick={() => dispatch(openModal({ componentName: "DeleteBlogCategory", data: row, softDelete: true }))}>
                <i className="fe fe-trash"></i>
              </Button>
            </OverlayTrigger>
          </div>
        );
      },
    },
  ], [list.currentPage, list.pageSize, dispatch]);

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      {isError && <Error error_mes={error} />}
      <div className="e-table pb-5">
        <ListFilters {...boundFilters(list, { placeholder: "Name or slug" })} />
        <ListTable
          columns={columns}
          rows={rows}
          total={total}
          page={list.currentPage}
          pageSize={list.pageSize}
          onPagination={list.onPaginationModelChange}
          emptyLabel="No categories found"
        />
      </div>
    </>
  );
};
