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
// import { useGetAllNotificationQuery } from "../redux/features/supportDeskEndPoint";


const dummyNotificationData = [
  {
    id: 1,
    title: "Server Maintenance Scheduled",
    content: "<p>We will be performing scheduled maintenance on <strong>Saturday at 2:00 AM</strong>. Services may be temporarily unavailable.</p>",
    date: "2025-01-15",
    status: "Active",
  },
  {
    id: 2,
    title: "New Feature Released",
    content: "<p>We have added a new dashboard feature to improve your experience. Check it out under the <strong>Analytics</strong> tab.</p>",
    date: "2025-02-01",
    status: "Active",
  },
  {
    id: 3,
    title: "Password Expiry Notice",
    content: "<p>Your password will expire in <strong>7 days</strong>. Please update it to maintain access.</p>",
    date: "2025-02-10",
    status: "Inactive",
  },
  {
    id: 4,
    title: "Policy Update",
    content: "<p>Our privacy policy has been updated. Please review the changes on the settings page.</p>",
    date: "2025-03-01",
    status: "Active",
  },
  {
    id: 5,
    title: "Security Alert",
    content: "<p>We detected a login attempt from a new device. If this wasn't you, please reset your password immediately.</p>",
    date: "2025-03-18",
    status: "Inactive",
  },
  {
    id: 6,
    title: "Backup Completed",
    content: "<p>Your full system backup completed successfully on <strong>March 20th</strong>.</p>",
    date: "2025-03-20",
    status: "Active",
  },
  {
    id: 7,
    title: "Subscription Renewal",
    content: "<p>Your subscription will renew on <strong>April 1st</strong>. No action is required.</p>",
    date: "2025-03-25",
    status: "Active",
  },
  {
    id: 8,
    title: "Welcome to the System",
    content: "<p>Thank you for joining! Explore the dashboard to get started.</p>",
    date: "2025-01-01",
    status: "Active",
  },
  {
    id: 9,
    title: "Data Sync Completed",
    content: "<p>Your data sync with the server was completed successfully.</p>",
    date: "2025-03-27",
    status: "Active",
  },
  {
    id: 10,
    title: "Trial Period Ending Soon",
    content: "<p>Your trial will end in <strong>3 days</strong>. Upgrade now to continue enjoying premium features.</p>",
    date: "2025-03-30",
    status: "Inactive",
  },
];

export const NotificationDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  // const { data, isError, error, isLoading, isFetching } = useGetAllNotificationQuery();


  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showRestore = hasPermission(role, permissions, "Notification", "restore-trash")
  const showDelete = hasPermission(role, permissions, "Notification", "delete")

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
      cell: (row) => (<div dangerouslySetInnerHTML={{ __html: row?.content || '' }}></div>)
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
            showRestore && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Link to={`/support-desk/notification/edit-notification/${row.id}`} ><Button className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
              </OverlayTrigger>
            )
          }
          {
            showDelete && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteNotifiation', data: row, softDelete: true })) }}> <i className="fe fe-trash text-light"></i> </Button>
              </OverlayTrigger>
            )}
        </div>
      ),
    },
  ];
  // const notificationData = Array.isArray(data?.data) ? data.data : [];
  const notificationData = dummyNotificationData;
  const indexedData = notificationData.map((item, index) => ({ ...item, index }));
  const filteredData = indexedData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.toLowerCase().includes(searchTerm.toLowerCase())
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
