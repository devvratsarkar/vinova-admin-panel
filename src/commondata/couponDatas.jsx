import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { useGetAllCouponsQuery, useUpdateCouponStatusMutation } from "../redux/features/couponAPIEndPoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from "../components/common/ListFilters";

const FILTER_KEYS = ["coupon_type", "status"];
const TYPES = [
  { value: "fixed", label: "Fixed" },
  { value: "percentage", label: "Percentage" },
];

function readCoupons(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const CouponData = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, refetch } = useGetAllCouponsQuery(list.query, { skip: list.skip });
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateCouponStatusMutation();
  const { rows, total } = readCoupons(data);

  const handleStatus = async (id, status) => {
    try {
      const resp = await updateStatus({ id, formData: { status } });
      if (resp?.data?.http_status_code === 200) {
        refetch();
        toast.success(resp?.data?.message);
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message);
    }
  };

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "code", label: "Coupon Code", minWidth: 140, flex: 0.7, render: (row) => row?.coupon_code || "" },
    { id: "type", label: "Coupon Type", minWidth: 130, flex: 0.6, render: (row) => row?.coupon_type || "" },
    { id: "value", label: "Value", width: 100, render: (row) => row?.value ?? "" },
    { id: "expiry", label: "Expiry Date", minWidth: 180, flex: 0.7, render: (row) => formatDate(row?.expiry_date) },
    { id: "count", label: "No. of Coupon", width: 140, render: (row) => row?.no_coupon ?? "" },
    {
      id: "date",
      label: "Created At",
      minWidth: 180,
      flex: 0.8,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
    },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch checked={row?.status} onChange={() => handleStatus(row?._id, !row?.status)} />,
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
            <Link to={`/view-coupon/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/edit-coupon/${row?._id}`}><Button className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteCoupon", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
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
            placeholder: "Coupon code",
            selects: [
              { label: "Coupon type", value: list.filters.coupon_type, onChange: (value) => list.setFilter("coupon_type", value), empty: "All types", options: TYPES },
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No coupons found" getRowKey={(row) => row?._id} />
      </div>
    </>
  );
};
