import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import { useGetAllBlogsQuery } from "../../redux/features/getApiSecond";
import { openModal } from "../../redux/slices/allModalSlice";
import { USER_BASE_URL } from "../../utils/config";
import { useEditBlogMutation } from "../../redux/features/postApiSecond";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from "../common/ListFilters";

const FILTER_KEYS = ["status"];

function readBlogs(response) {
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

function BlogStatusSwitch({ row, editBlog, onSuccess }) {
  const [checked, setChecked] = useState(!!row?.status);
  useEffect(() => setChecked(!!row?.status), [row?.status]);

  const handleChange = async () => {
    const next = !checked;
    setChecked(next);
    try {
      const response = await editBlog({ blogId: row?._id || row?.id, blogData: { status: next } });
      if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) onSuccess?.();
      else setChecked(!next);
    } catch (err) {
      setChecked(!next);
    }
  };

  return <StatusSwitch checked={checked} onChange={handleChange} />;
}

export const BlogsDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const bare = useGetAllBlogsQuery();
  const { data, isError, error, isLoading, isFetching, refetch } = useGetAllBlogsQuery(list.query, { skip: list.skip });
  useRefreshAfterBareQuery(bare, refetch);
  const [editBlog, { isLoading: updating }] = useEditBlogMutation();
  const [selected, setSelected] = useState([]);
  const { rows, total } = readBlogs(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "title", label: "Title", minWidth: 160, flex: 1.2, render: (row) => row?.title || "" },
    {
      id: "image",
      label: "Banner Image",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => (row?.banner_image ? <img src={row.banner_image} height={50} alt="Banner" /> : ""),
    },
    {
      id: "excerpt",
      label: "Excerpt",
      minWidth: 180,
      flex: 1.4,
      render: (row) => {
        const text = plainText(row?.excerpt);
        return <div className="text-truncate" style={{ maxWidth: 280 }} title={text}>{text}</div>;
      },
    },
    {
      id: "status",
      label: "Status",
      width: 100,
      sortable: false,
      filterable: false,
      render: (row) => <BlogStatusSwitch row={row} editBlog={editBlog} onSuccess={refetch} />,
    },
    { id: "created", label: "Date", minWidth: 180, flex: 1, nowrap: true, render: (row) => formatDate(row?.createdAt) },
    {
      id: "link",
      label: "Live Link",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => (
        <a href={`${USER_BASE_URL}blogs/${row?.slug}`} target="_blank" rel="noopener noreferrer">Click Here</a>
      ),
    },
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
          <div className="action_icon_wrapper d-flex justify-content-center" onClick={(event) => event.stopPropagation()}>
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/all-posts/view-post/${rowId}`} className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link to={`/all-posts/edit-post/${rowId}`} className="btn btn-icon btn-warning"><i className="fe fe-edit"></i></Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Button type="button" className="btn btn-icon btn-danger" onClick={() => dispatch(openModal({ componentName: "DeletePost", data: row, softDelete: true }))}>
                <i className="fe fe-trash"></i>
              </Button>
            </OverlayTrigger>
          </div>
        );
      },
    },
  ], [list.currentPage, list.pageSize, dispatch, editBlog, refetch]);

  const deleteSelected = () => {
    const ids = rows.filter((row) => selected.includes(row?._id || row?.id)).map((row) => row?.id ?? row?._id);
    dispatch(openModal({ componentName: "BulkDelete", data: ids }));
  };

  return (
    <>
      {(isLoading || isFetching || updating) && <Loader />}
      {isError && <Error error_mes={error} />}
      <div className="e-table pb-5">
        <ListFilters
          {...boundFilters(list, { placeholder: "Title" })}
          selects={[{ label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS }]}
        />
        {selected.length > 0 && (
          <div className="d-flex justify-content-end mx-3 mb-3">
            <Button variant="danger" className="text-light" onClick={deleteSelected}>Delete Selected ({selected.length})</Button>
          </div>
        )}
        <ListTable
          columns={columns}
          rows={rows}
          total={total}
          page={list.currentPage}
          pageSize={list.pageSize}
          onPagination={list.onPaginationModelChange}
          emptyLabel="No blogs found"
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selected}
          onRowSelectionModelChange={(model) => setSelected(Array.isArray(model) ? [...model] : [])}
        />
      </div>
    </>
  );
};
