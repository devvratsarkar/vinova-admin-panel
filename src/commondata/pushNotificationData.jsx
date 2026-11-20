import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from '../components/common/DataTable'
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { hasPermission } from "./permissions";
// import { useGetAllNotificationQuery, useGetAllPushNotificationQuery } from "../redux/features/supportDeskEndPoint";

const dummyData = [
  {
    id: 1,
    title: "New Feature Released",
    content: "<p>We have launched a new feature for all users. Check it out!</p>",
    date: "2025-01-12",
    status: "Active",
  },
  {
    id: 2,
    title: "Scheduled Maintenance",
    content: "<p>Our system will undergo maintenance on <strong>March 15</strong>.</p>",
    date: "2025-02-20",
    status: "Inactive",
  },
  {
    id: 3,
    title: "Holiday Sale",
    content: "<p>Get <strong>50% OFF</strong> on all products!</p>",
    date: "2025-03-01",
    status: "Active",
  },
  {
    id: 4,
    title: "App Update Available",
    content: "<p>Update to the latest version for better performance.</p>",
    date: "2025-03-04",
    status: "Active",
  },
  {
    id: 5,
    title: "Payment Reminder",
    content: "<p>Your subscription is about to expire. Renew now!</p>",
    date: "2025-03-09",
    status: "Inactive",
  },
  {
    id: 6,
    title: "Security Alert",
    content: "<p>We detected a new login to your account.</p>",
    date: "2025-04-01",
    status: "Active",
  },
  {
    id: 7,
    title: "Weekly Summary",
    content: "<p>Your account summary for this week is ready.</p>",
    date: "2025-04-07",
    status: "Inactive",
  },
  {
    id: 8,
    title: "Promo Code",
    content: "<p>Use code <strong>WELCOME10</strong> for a 10% discount!</p>",
    date: "2025-04-10",
    status: "Active",
  },
  {
    id: 9,
    title: "Survey Request",
    content: "<p>Please take 2 minutes to fill out our survey.</p>",
    date: "2025-04-15",
    status: "Inactive",
  },
  {
    id: 10,
    title: "New Blog Post",
    content: "<p>Read our latest blog post on productivity tips.</p>",
    date: "2025-04-20",
    status: "Active",
  }
];

export const PushNotificationDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  // const { data, isError, error, isLoading, isFetching } = useGetAllPushNotificationQuery();
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = hasPermission(role, permissions, "PushNotification", "edit")
  const showAddTrash = hasPermission(role, permissions, "PushNotification", "add-trash")

  // if (isError) {
  //   return <Error error_mes={error} />;
  // }
  const COLUMNS = [
    {
      name: "#",
      selector: (row) => row.index + 1,
      sortable: true,
      sortFunction: (a, b) => b.index - a.index,
    },
    {
      name: "Title",
      sortable: true,
      selector: (row) => row?.title,
      cell: (row) => (<div>{row?.title}</div>)
    },
    {
      name: "Content",
      selector: (row) => row?.content,
      cell: (row) => (<div dangerouslySetInnerHTML={{ __html: row?.content }}></div>)
    },
    {
      name: "Dated",
      selector: (row) => row?.date,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      cell: (row) => (
        <div className="action_icon_wrapper">
          <button className={`notification_status notification_status_${row.status}`} variant="">{row?.status}</button>
        </div>
      )
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action_icon_wrapper">
          {
            showEdit && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Link to={`/push-notification/edit-push-notification/${row?.id}`} ><Button className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
              </OverlayTrigger>
            )
          }
          {
            showAddTrash && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeletedPushNotification', data: row, softDelete: true })) }}> <i className="fe fe-trash text-light"></i> </Button>
              </OverlayTrigger>
            )
          }
        </div>
      ),
    },
  ];
  // const notificationData = Array.isArray(data?.data) ? data.data : [];
  const notificationData = dummyData;
  const indexedData = notificationData.map((item, index) => ({ ...item, index }));
  const filteredData = indexedData.filter((item) =>
    item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const displayPages = () => {
    const pageButtons = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        pageButtons.push(
          <li key={i} className={currentPage === i ? "active" : ""}>
            <Button className="btn btn-default" variant={currentPage === i ? "primary" : "default"} onClick={() => paginate(i)}>
              {i}
            </Button>
          </li>
        );
      } else if (i === left - 1 || i === right + 1) {
        pageButtons.push(<li key={i} className="ellipsis_pagination">......</li>);
      }
    }
    return pageButtons;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="e-table pb-5 table-responsive">
        <Row className="m-5">
          {/* {isLoading || isFetching ? <Loader /> : null} */}
          <Col as={Col} sm={9}>
            <span>Show</span>
            <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>Entries</span>
          </Col>
          <Col as={Col} sm={3}>
            <Form.Group className="mx-3">
              <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
            </Form.Group>
          </Col>
        </Row>

        <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
        <div className="pagination_wrapper">
          <div className="fs-6 fw-bolder mt-3"> Total:- <span>{filteredData.length}</span></div>
          <ul className="pagination">
            <li>
              <Button className="btn btn-default" variant="default" disabled={currentItems === 1} onClick={prevPage}>
                <i className="fa fa-angle-left"></i> Previous
              </Button>
            </li>
            {displayPages()}
            <li>
              <Button className="btn btn-default" variant="default" disabled={currentPage === totalPages} onClick={nextPage}>
                Next <i className="fa fa-angle-right"></i>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}