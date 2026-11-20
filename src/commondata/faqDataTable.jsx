import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from '../components/common/DataTable'
import { openModal } from "../redux/slices/allModalSlice";
import { Link } from "react-router-dom";
import Loader from "../layouts/layoutcomponents/loader";
import moment from "moment";
import toast from "react-hot-toast";
import { useGetAllFaqQuery, useUpdateFaqStatusMutation } from "../redux/features/faqAPIEndPoint";
import { allow } from "./permissions";

export default function FaqsDatatable() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serialNumber, setSerialNumber] = useState(1)

  const { data, refetch, isLoading, isSuccess } = useGetAllFaqQuery();
  const [updateFaqs] = useUpdateFaqStatusMutation();

  const faqs = data?.data || [];

  const toggleStatus = async (id, status) => {
    try {
      const resp = await updateFaqs({ id: id, formData: { status } });
      if (resp?.data?.http_status_code === 200) {
        refetch();
        toast.success(resp?.data?.message);
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  if (isSuccess) {
    const COLUMNS = [
      {
        name: "#",
        selector: (row, index) => index + serialNumber,
        sortable: true,
        width: "80px",
      },
      {
        name: "Question",
        selector: (row) => row.question,
        sortable: true,
        cell: (row) => (
          <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {row.question.length > 50 ? `${row.question.substring(0, 50)}...` : row.question}
          </div>
        ),
        width: "500px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status)
          return (
            <label className="custom-switch">
              <input
                type="checkbox"
                className="custom-switch-input"
                onChange={() => {
                  toggleStatus(row._id, !checked)
                  setChecked(!checked)
                }}
                checked={checked}
                disabled={!allow("Faqs", "edit")}
              />
              <span className="custom-switch-indicator custum-green-btn"></span>
            </label>
          );
        },
        width: "150px",
      },
      {
        name: "Created At",
        selector: (row) => moment(row.createdAt).format("DD-MM-YYYY"),
        sortable: true,
        width: "150px",
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper d-flex justify-content-center">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link
                className="btn btn-icon btn-primary"
                to={`/cms/faqs/view/${row._id}`}
              >
                <i className="fe fe-eye"></i>
              </Link>
            </OverlayTrigger>

            {allow("Faqs", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                className="btn btn-icon btn-warning"
                to={`/cms/faqs/edit/${row._id}`}
              >
                <i className="fe fe-edit"></i>
              </Link>
            </OverlayTrigger>
)}
            {allow("Faqs", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Button
                className="btn btn-icon btn-danger text-light"
                variant=""
                onClick={() => {
                  dispatch(
                    openModal({
                      componentName: "DeleteFaqs",
                      data: row,
                    })
                  );
                }}
              >
                <i className="fe fe-trash"></i>
              </Button>
            </OverlayTrigger>
)}
          </div>
        ),
        width: "200px",
      },
    ];

    // Filter data based on search term
    const filteredData = faqs.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        item.course?.course_name?.toLowerCase().includes(searchTermLower) ||
        item.question?.toLowerCase().includes(searchTermLower) ||
        item.answer?.toLowerCase().includes(searchTermLower) ||
        moment(item.createdAt).format("DD-MM-YYYY").toLowerCase().includes(searchTermLower)
      );
    });

    // Pagination calculations
    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination controls
    const displayPages = () => {
      const pageButtons = [];
      const delta = 2;
      const left = currentPage - delta;
      const right = currentPage + delta + 1;

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i < right)) {
          pageButtons.push(
            <li key={i} className={currentPage === i ? "active" : ""}>
              <Button
                className="btn btn-default"
                variant={currentPage === i ? "primary" : "default"}
                onClick={() => setCurrentPage(i)}
              >
                {i}
              </Button>
            </li>
          );
        } else if (i === left - 1 || i === right + 1) {
          pageButtons.push(
            <li key={i} className="ellipsis_pagination">
              ......
            </li>
          );
        }
      }
      return pageButtons;
    };

    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handlePageSizeChange = (e) => {
      setPageSize(parseInt(e.target.value, 10));
      setCurrentPage(1);
    };
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    };

    return (
      <>
        {(isLoading) && <Loader />}
        <div className="">
          <Row className="justify-content-end mt-3 mx-2 align-items-center">
            <Col sm={6} xs={12}>
              <div className="d-block ms-5">
                <span>Show</span>
                <select
                  className="mx-2"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {[10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span>Entries</span>
              </div>
            </Col>
            <Col sm={6} xs={12} className="text-sm-end"></Col>
          </Row>
          <Row className="justify-content-end">
            <Col as={Col} sm={3}>
              <Form.Group className="m-3">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Form.Group>
            </Col>
          </Row>
          <DataTable data={currentItems} columns={COLUMNS} striped />
          <div className="pagination_wrapper">
            <div className="mt-3 ms-3">
              <p className="fw-bold">
                Total FAQs :
                <span>
                  <Button
                    variant="default"
                    disabled
                    className="text-secondary fw-bolder"
                  >
                    {" "}
                    {filteredData.length}
                  </Button>
                </span>
              </p>
            </div>
            <ul className="pagination">
              <li>
                <Button
                  className="btn btn-default"
                  variant="default"
                  onClick={prevPage}
                >
                  <i className="fa fa-angle-left"></i> Previous
                </Button>
              </li>
              {displayPages()}
              <li>
                <Button
                  className="btn btn-default"
                  variant="default"
                  onClick={nextPage}
                >
                  Next <i className="fa fa-angle-right"></i>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}