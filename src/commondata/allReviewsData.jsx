import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import { openModal } from "../redux/slices/allModalSlice";
import { useGetAllReviewsQuery } from "../redux/features/getApiSecond";
import { useUpdateReviewStatusMutation } from "../redux/features/postApiSecond";
import { ListFilters, ListTable, boundFilters, formatDate, indexColumn, useListFilters } from "../components/common/ListFilters";

const FILTER_KEYS = ["status"];

const REVIEW_STATUSES = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function readReviews(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.reviews)
      ? payload.reviews
      : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function customerName(row) {
  return row?.user_id?.name || row?.customer_name || (row?.guest_user ? "Guest" : "N/A");
}

function statusClass(status) {
  const normalized = (status ?? "").toString().toLowerCase();
  if (normalized === "approved" || normalized === "success") return "bg-success";
  if (normalized === "rejected") return "bg-danger";
  if (normalized === "pending") return "bg-warning text-dark";
  return "bg-secondary";
}

export const AllReviewssData = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isError, error, isLoading, isFetching, refetch } = useGetAllReviewsQuery(list.query, {
    skip: list.skip,
    refetchOnMountOrArgChange: true,
  });
  const [updateReviewStatus, { isLoading: updatingStatus }] = useUpdateReviewStatusMutation();
  const { rows, total } = readReviews(data);

  const openReview = (row) => {
    dispatch(openModal({ componentName: "ViewReview", data: row }));
  };

  const changeStatus = async (event, reviewId, status) => {
    event.stopPropagation();
    try {
      const res = await updateReviewStatus({ id: reviewId, status });
      if (res?.data?.http_status_code === 200) refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "product", label: "Product Name", minWidth: 140, flex: 1.1, render: (row) => row?.product_id?.name || "N/A" },
    {
      id: "image",
      label: "Image",
      width: 90,
      sortable: false,
      filterable: false,
      render: (row) => (
        row?.product_id?.featured_image
          ? <img src={row.product_id.featured_image} alt={row?.product_id?.name || "Product"} height={50} />
          : "N/A"
      ),
    },
    { id: "customer", label: "Customer Name", minWidth: 130, flex: 1, render: (row) => customerName(row) },
    {
      id: "rating",
      label: "Rating",
      width: 130,
      sortable: false,
      filterable: false,
      render: (row) => (
        <Box>
          <Rating name="read-only" size="small" value={row?.star_rating || 0} readOnly />
        </Box>
      ),
    },
    {
      id: "review",
      label: "Review",
      minWidth: 180,
      flex: 1.4,
      render: (row) => (
        <div className="text-truncate" style={{ maxWidth: 280 }} title={row?.text || ""}>
          {row?.text || "N/A"}
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <span className={`badge rounded-pill ${statusClass(row?.status)}`}>{row?.status || "N/A"}</span>,
    },
    { id: "type", label: "Type", minWidth: 90, flex: 0.6, render: (row) => row?.type || "N/A" },
    { id: "created", label: "Created At", minWidth: 160, flex: 1, render: (row) => formatDate(row?.createdAt) || "N/A" },
    {
      id: "action",
      label: "Action",
      width: 120,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => {
        if ((row?.status ?? "").toString().toLowerCase() !== "pending") return null;
        return (
          <div className="action_icon_wrapper d-flex justify-content-center" onClick={(event) => event.stopPropagation()}>
            <OverlayTrigger placement="top" overlay={<Tooltip>Approve</Tooltip>}>
              <Button className="btn btn-icon btn-success text-light" variant="" onClick={(event) => changeStatus(event, row?.id, "approved")} disabled={updatingStatus}>
                <i className="fe fe-check"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Reject</Tooltip>}>
              <Button className="btn btn-icon btn-danger text-light" variant="" onClick={(event) => changeStatus(event, row?.id, "rejected")} disabled={updatingStatus}>
                <i className="fe fe-x"></i>
              </Button>
            </OverlayTrigger>
          </div>
        );
      },
    },
  ], [list.currentPage, list.pageSize, updatingStatus]);

  return (
    <>
      {(isLoading || isFetching || updatingStatus) && <Loader />}
      {isError && <Error error_mes={error} />}
      <div className="e-table pb-5">
        <ListFilters
          {...boundFilters(list, { placeholder: "Product, customer, or review" })}
          selects={[{ label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: REVIEW_STATUSES }]}
        />
        <ListTable
          columns={columns}
          rows={rows}
          total={total}
          page={list.currentPage}
          pageSize={list.pageSize}
          onPagination={list.onPaginationModelChange}
          emptyLabel="No reviews found"
          getRowHeight={() => "auto"}
          onRowClick={(params) => openReview(params.row)}
          disableRowSelectionOnClick
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </>
  );
};
