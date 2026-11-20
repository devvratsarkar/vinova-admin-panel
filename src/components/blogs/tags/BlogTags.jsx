import React, { useEffect, useMemo, useRef } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useGetAllBlogsTagsQuery } from "../../../redux/features/getApiSecond";
import { ListFilters, ListTable, boundFilters, indexColumn, useListFilters } from "../../common/ListFilters";

function readTags(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.pagination?.total ?? payload?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
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

export default function BlogTags() {
  const dispatch = useDispatch();
  const list = useListFilters();
  const bare = useGetAllBlogsTagsQuery();
  const { data, isError, error, isLoading, isFetching, refetch } = useGetAllBlogsTagsQuery(list.query, { skip: list.skip });
  useRefreshAfterBareQuery(bare, refetch);
  const { rows, total } = readTags(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 160, flex: 1, render: (row) => row?.name || "" },
    { id: "count", label: "Count", width: 120, render: (row) => row?.count ?? "" },
    {
      id: "action",
      label: "Action",
      width: 160,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-primary" variant="" onClick={() => dispatch(openModal({ componentName: "ViewBlogTag", data: row }))}><i className="fe fe-eye"></i></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-warning" variant="" onClick={() => dispatch(openModal({ componentName: "EditBlogTags", data: row }))}><i className="fe fe-edit"></i></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" onClick={() => dispatch(openModal({ componentName: "BlogTagsDelete", data: row, softDelete: true }))}><i className="fe fe-trash"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Blog Tags" active="Blog Tags List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end">
          <Button className="btn btn-success me-3" variant="" onClick={() => dispatch(openModal({ componentName: "AddBlogTags" }))}>Add New Blog Tag</Button>
          <Link to="/all-blog-tags/trash" className="btn btn-danger">Trash</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              {(isLoading || isFetching) && <Loader />}
              {isError && <Error error_mes={error} />}
              <div className="e-table pb-5">
                <ListFilters {...boundFilters(list, { placeholder: "Name" })} />
                <ListTable
                  columns={columns}
                  rows={rows}
                  total={total}
                  page={list.currentPage}
                  pageSize={list.pageSize}
                  onPagination={list.onPaginationModelChange}
                  emptyLabel="No tags found"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
