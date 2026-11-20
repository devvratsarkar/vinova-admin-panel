import React, { useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useGetAllContactEnquiriesQuery } from "../../../redux/features/getApiSecond";
import { ListFilters, ListTable, STATUS_FILTERS, boundFilters, formatDate, indexColumn, useListFilters } from "../../common/ListFilters";
import { commonDataSlice } from "../../../redux/slices/commonApiSlice";
import { exportProps, useExportAction } from "../../../utils/fileDownload";

const FILTER_KEYS = ["status"];

function readContacts(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export default function ContactEnquiries() {
  const list = useListFilters(FILTER_KEYS);
  const { data, isError, error, isLoading, isFetching } = useGetAllContactEnquiriesQuery(list.query, {
    skip: list.skip,
    refetchOnMountOrArgChange: true,
  });
  const fileExport = useExportAction(commonDataSlice.endpoints.getAllContactEnquiries, "ContactEnquiry", "Contact enquiries downloaded");
  const { rows, total } = readContacts(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Customer Name", minWidth: 150, flex: 1, render: (row) => row?.name || "N/A" },
    { id: "email", label: "Email", minWidth: 180, flex: 1.2, render: (row) => row?.email || "N/A" },
    { id: "phone", label: "Phone", minWidth: 140, flex: 0.8, render: (row) => row?.phone || "N/A" },
    {
      id: "message",
      label: "Message",
      minWidth: 180,
      flex: 1.4,
      render: (row) => (
        <div className="text-truncate" style={{ maxWidth: 280 }} title={row?.message || ""}>
          {row?.message || "N/A"}
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      render: (row) => (
        <span className={`badge rounded-pill ${row?.status ? "bg-success" : "bg-secondary"}`}>
          {row?.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    { id: "created", label: "Created At", minWidth: 200, flex: 1, nowrap: true, render: (row) => formatDate(row?.createdAt) || "N/A" },
  ], [list.currentPage, list.pageSize]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Contact Enquiries" active="Contact Enquiries" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              {(isLoading || isFetching) && <Loader />}
              {isError && <Error error_mes={error} />}
              <div className="e-table pb-5">
                <ListFilters
                  {...boundFilters(list, { placeholder: "Name, email, or phone", ...exportProps(fileExport, list.query, list.skip) })}
                  selects={[{ label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS }]}
                />
                <ListTable
                  columns={columns}
                  rows={rows}
                  total={total}
                  page={list.currentPage}
                  pageSize={list.pageSize}
                  onPagination={list.onPaginationModelChange}
                  emptyLabel="No contact enquiries found"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
