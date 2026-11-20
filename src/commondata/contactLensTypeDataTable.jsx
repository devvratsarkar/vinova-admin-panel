import React, { useEffect, useMemo, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { useGetAllContactLensTypeQuery, useUpdateContactLensTypeStatusMutation } from "../redux/features/contactLensTypeAPIEndPoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from "../components/common/ListFilters";

const FILTER_KEYS = ["status"];

function readContactLensTypes(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

function ContactLensTypeStatusSwitch({ row, updateStatus, onSuccess }) {
  const [checked, setChecked] = useState(!!row?.status);

  useEffect(() => {
    setChecked(!!row?.status);
  }, [row?.status]);

  const handleStatusChange = async () => {
    const nextStatus = !checked;
    setChecked(nextStatus);
    try {
      const resp = await updateStatus({ id: row?._id, formData: { status: nextStatus } });
      if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
        onSuccess?.();
        toast.success(resp?.data?.message || "Status updated successfully");
      } else {
        setChecked(!nextStatus);
        toast.error(resp?.data?.message || "Failed to update status");
      }
    } catch (err) {
      setChecked(!nextStatus);
      toast.error(err?.message || "An error occurred");
    }
  };

  return <StatusSwitch checked={checked} onChange={handleStatusChange} />;
}

export const ContactLensTypeDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, refetch } = useGetAllContactLensTypeQuery(list.query, { skip: list.skip });
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateContactLensTypeStatusMutation();
  const { rows, total } = readContactLensTypes(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 160, flex: 1, render: (row) => row?.name || "" },
    { id: "slug", label: "Slug", minWidth: 160, flex: 1, render: (row) => row?.slug || "" },
    {
      id: "status",
      label: "Status",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => <ContactLensTypeStatusSwitch row={row} updateStatus={updateStatus} onSuccess={refetch} />,
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
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/catalogue/contact-lens-type/view/${row?._id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/catalogue/contact-lens-type/edit/${row?._id}`}><Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteContactLensType", data: row }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch, refetch, updateStatus]);

  return (
    <>
      {(isLoading || isFetching || loadingStatus) && <Loader />}
      <div className="e-table pb-5">
        <ListFilters
          {...boundFilters(list, {
            placeholder: "Name or slug",
            selects: [
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No contact lens types found" />
      </div>
    </>
  );
};
