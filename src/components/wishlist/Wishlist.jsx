import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetWishlistQuery } from "../../redux/features/cartAPIEndPoint";
import moment from "moment";
import useDebounce from "../../hooks/useDebounce";
import MuiDataTable from "../common/MuiDataTable";
import DateRangeFields from "../common/DateRangeFields";
import { allow } from "../../commondata/permissions";

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }

function getUserName(row) {
  const user = row?.user;
  if (!user || typeof user === "string") return user || "Guest";
  return user.name || user.phone_number || user.email || "Guest";
}

function getUserEmail(row) {
  const user = row?.user;
  if (!user || typeof user === "string") return "";
  return user.email || "";
}

function readList(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.wishlist) ? payload.wishlist : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export default function Wishlist() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const datesReady = Boolean(fromDate && toDate && !dateError);
  const hasFilters = Boolean(searchTerm || fromDate || toDate);

  const { data, isLoading, isFetching } = useGetWishlistQuery({
    page: currentPage,
    limit: pageSize,
    ...(datesReady && { fromDate, toDate }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  }, { skip: Boolean(dateError) });

  const { rows, total } = readList(data);

  const handleClear = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, fromDate, toDate]);

  const columns = useMemo(() => [
    {
      id: "index",
      label: "#",
      width: 64,
      sortable: false,
      filterable: false,
      render: (_row, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      id: "user",
      label: "User Name",
      minWidth: 160,
      flex: 0.8,
      render: (row) => getUserName(row),
    },
    {
      id: "email",
      label: "Email",
      minWidth: 200,
      flex: 1,
      render: (row) => getUserEmail(row),
    },
    {
      id: "product",
      label: "Product Name",
      minWidth: 200,
      flex: 1,
      render: (row) => row?.product?.name || "N/A",
    },
    {
      id: "type",
      label: "Type",
      width: 140,
      render: (row) => row?.type || "N/A",
    },
    {
      id: "date",
      label: "Created At",
      minWidth: 190,
      flex: 0.9,
      render: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
    },
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
            <Button
              type="button"
              className="btn btn-icon btn-primary me-2"
              variant=""
              onClick={() => dispatch(openModal({ componentName: "ViewWishlist", data: row }))}
            >
              <i className="fe fe-eye"></i>
            </Button>
          </OverlayTrigger>
          {allow("Wishlist", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button
              className="btn btn-icon btn-danger border-danger"
              onClick={() => dispatch(openModal({ componentName: "RemoveWishlist", data: { wishlistId: row?.id } }))}
            >
              <i className="fe fe-trash"></i>
            </Button>
          </OverlayTrigger>
)}
        </div>
      ),
    },
  ], [currentPage, pageSize, dispatch]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Wishlist" active="wishlist" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              {(isLoading || isFetching) && <Loader />}
              <div className="e-table pb-5">
                <div className="orders-filters mx-3 mt-3 mb-4 p-3" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
                  <div className="d-flex justify-content-end mb-2">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="p-0 text-decoration-none fw-semibold"
                      onClick={handleClear}
                      disabled={!hasFilters}
                    >
                      Clear filters
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'end' }}>
                    <div>
                      <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Search</div>
                      <Form.Control
                        aria-label="Search"
                        placeholder="Name, email, or product"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        style={{ ...fieldStyle, backgroundColor: searchTerm ? '#eef5ff' : '#fff' }}
                      />
                    </div>
                    <DateRangeFields
                      fromDate={fromDate}
                      toDate={toDate}
                      onFromDate={setFromDate}
                      onToDate={setToDate}
                      onError={setDateError}
                    />
                  </div>
                  {dateError && <p className="text-danger small mb-0 mt-2">{dateError}</p>}
                </div>

                <MuiDataTable
                  columns={columns}
                  data={rows}
                  compact={false}
                  emptyLabel="No wishlist items found"
                  getRowKey={(row) => row.id || row._id}
                  paginationMode="server"
                  filterMode="server"
                  disableColumnFilter
                  rowCount={total}
                  paginationModel={{ page: currentPage - 1, pageSize }}
                  onPaginationModelChange={(model) => {
                    if (model.pageSize !== pageSize) {
                      setPageSize(model.pageSize);
                      setCurrentPage(1);
                      return;
                    }
                    setCurrentPage(model.page + 1);
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
