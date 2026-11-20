import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCopyVariantsMutation, useGetInventorySizeWiseQuery, useUpdateInventoryStatusMutation } from "../../redux/features/inventory";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { openModal } from "../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters, visibleRows } from "../common/ListFilters";
import { allow } from "../../commondata/permissions";

const FILTER_KEYS = ["status"];

function readSizes(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  const total = Number(payload?.total ?? payload?.pagination?.total ?? response?.total ?? response?.pagination?.total);
  const paginated = Number.isFinite(total);
  return { rows, total: paginated ? total : rows.length, paginated };
}

function SizeStatusSwitch({ row, productId, updateStatus, onSuccess }) {
  const [checked, setChecked] = useState(!!row?.status);
  useEffect(() => setChecked(!!row?.status), [row?.status]);

  const handleChange = async () => {
    const next = !checked;
    setChecked(next);
    try {
      const resp = await updateStatus({ id: productId, type: row?.size, status: next });
      if (resp?.data?.http_status_code === 200) {
        onSuccess?.();
        toast.success(resp?.data?.message);
      } else {
        setChecked(!next);
        toast.error(resp?.data?.message);
      }
    } catch (err) {
      setChecked(!next);
      toast.error(err?.message);
    }
  };

  return <StatusSwitch disabled={!allow("InventoryWithVariant", "edit")}  checked={checked} onChange={handleChange} />;
}

export default function InventorySizes() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const [updateStatus, { isLoading: loadingStatusUpdate }] = useUpdateInventoryStatusMutation();
  const [copyDocument, { isLoading: loadingCopyDocument }] = useCopyVariantsMutation();
  const { data, isError, error, isLoading, isFetching, refetch } = useGetInventorySizeWiseQuery(
    { id, ...list.query },
    { skip: !id || list.skip },
  );
  const result = readSizes(data);
  const rows = visibleRows(result, list.currentPage, list.pageSize);

  const handleCopyVariant = async (type) => {
    try {
      const resp = await copyDocument({ id, type });
      if (resp?.data?.http_status_code === 200) {
        refetch();
        toast.error(resp?.data?.message);
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Product Name", minWidth: 150, flex: 1.2, render: (row) => row?.product_details?.name || "" },
    { id: "size", label: "Size", width: 90, render: (row) => row?.size || "" },
    {
      id: "image",
      label: "Image",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => (row?.product_details?.featured_image ? <img src={row.product_details.featured_image} height={50} alt={row?.product_details?.name || ""} /> : ""),
    },
    { id: "created", label: "CreatedAt", minWidth: 180, flex: 1, nowrap: true, render: (row) => formatDate(row?.createdAt) },
    {
      id: "status",
      label: "Status",
      width: 110,
      render: (row) => <SizeStatusSwitch row={row} productId={id} updateStatus={updateStatus} onSuccess={refetch} />,
    },
    {
      id: "action",
      label: "Action",
      width: 180,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/inventor/view-invertory-with-varient/${row?.size}/${row?.product_details?._id}`}><Button type="button" className="btn btn-icon btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          {allow("InventoryWithVariant", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit variant (Frames Shape, Color, etc.)</Tooltip>}>
            <Button
              type="button"
              className="btn btn-icon btn-warning"
              variant=""
              onClick={() => dispatch(openModal({
                componentName: "EditVariant",
                data: { ...row, _id: row?.product_id || row?.product_details?._id },
              }))}
            >
              <i className="fe fe-edit"></i>
            </Button>
          </OverlayTrigger>
)}
          {result.total === 1 && (
            <OverlayTrigger placement="top" overlay={<Tooltip>Copy</Tooltip>}>
              <Button onClick={() => handleCopyVariant(row?.size)} type="button" className="btn btn-icon btn-success" variant=""><i className="fe fe-copy text-light"></i></Button>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch, id, updateStatus, refetch, result.total]);

  return (
    <>
      {(isLoading || isFetching || loadingStatusUpdate || loadingCopyDocument) && <Loader />}
      <Row>
        <Col as={Col} md={6}>
          <PageHeader titles="Inventory" active="Inventory With Variant Sizes" items={["Home", "Inventory With Variant List"]} links={["/dashboard", "/stocks/inventory"]} />
        </Col>
      </Row>
      <Card>
        <Card.Body className="data_table">
          {isError && <Error error_mes={error} />}
          <div className="e-table pb-5">
              <ListFilters
                {...boundFilters(list, {
                  placeholder: "Product name",
                  selects: [
                    { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
                  ],
                })}
              />
              <ListTable
                columns={columns}
                rows={rows}
                total={result.total}
                page={list.currentPage}
                pageSize={list.pageSize}
                onPagination={list.onPaginationModelChange}
                emptyLabel="No sizes found"
                getRowHeight={() => "auto"}
              />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
