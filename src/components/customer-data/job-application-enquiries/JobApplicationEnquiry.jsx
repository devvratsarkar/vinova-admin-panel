import React, { useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useGetAllJobApplicationsQuery } from "../../../redux/features/getApiSecond";
import { ListFilters, ListTable, boundFilters, formatDate, indexColumn, useListFilters } from "../../common/ListFilters";

function readApplications(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export default function JobApplicationEnquiry() {
  const list = useListFilters();
  const { data, isError, error, isLoading, isFetching } = useGetAllJobApplicationsQuery(list.query, {
    skip: list.skip,
    refetchOnMountOrArgChange: true,
  });
  const { rows, total } = readApplications(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 150, flex: 1, render: (row) => row?.full_name || "N/A" },
    { id: "email", label: "Email", minWidth: 180, flex: 1.2, render: (row) => row?.email || "N/A" },
    { id: "phone", label: "Phone", minWidth: 140, flex: 0.8, render: (row) => row?.phone || "N/A" },
    {
      id: "resume",
      label: "Resume",
      width: 140,
      sortable: false,
      filterable: false,
      render: (row) => (
        row?.resume
          ? <a href={row.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
          : "N/A"
      ),
    },
    { id: "created", label: "Applied On", minWidth: 200, flex: 1, nowrap: true, render: (row) => formatDate(row?.createdAt) || "N/A" },
  ], [list.currentPage, list.pageSize]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Job Application Enquiries" active="Job Applications" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              {(isLoading || isFetching) && <Loader />}
              {isError && <Error error_mes={error} />}
              <div className="e-table pb-5">
                <ListFilters {...boundFilters(list, { placeholder: "Name, email, or phone" })} />
                <ListTable
                  columns={columns}
                  rows={rows}
                  total={total}
                  page={list.currentPage}
                  pageSize={list.pageSize}
                  onPagination={list.onPaginationModelChange}
                  emptyLabel="No job applications found"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
