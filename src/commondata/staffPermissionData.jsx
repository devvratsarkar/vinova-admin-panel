import React, { useState } from "react";
import { Col, Row, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from '../components/common/DataTable'
import { useGetAllStaffQuery } from "../redux/features/staffEndPoint";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { formatRoleName } from "../utils/permissionOptions";

const getStaffId = (row) => row?._id ?? row?.id;

const safeIncludes = (value, term) => (value ?? "").toString().toLowerCase().includes(term);

export default function StaffPermissionDataTable() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isError, error, isLoading, isFetching } = useGetAllStaffQuery();

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    const staffData = Array.isArray(data?.data) ? data.data : [];

    const filteredData = staffData.filter((item) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
            safeIncludes(item?.name, term) ||
            safeIncludes(item?.email, term) ||
            safeIncludes(item?.phone_number, term) ||
            safeIncludes(item?.role?.name, term) ||
            safeIncludes(formatRoleName(item?.role?.name), term)
        );
    });

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const COLUMNS = [
        {
            name: "#",
            selector: (row, index) => indexOfFirstItem + index + 1,
            width: "70px",
        },
        {
            name: "Name",
            sortable: true,
            selector: (row) => row?.name,
            cell: (row) => row?.name || "N/A",
        },
        {
            name: "Profile Picture",
            cell: (row) =>
                row?.profile_pic ? (
                    <img src={row.profile_pic} width={70} height={70} alt={row?.name || "Staff"} />
                ) : (
                    "N/A"
                ),
        },
        {
            name: "Email",
            selector: (row) => row?.email,
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: (row) => row?.phone_number,
            sortable: true,
        },
        {
            name: "Role",
            selector: (row) => row?.role?.name,
            cell: (row) => formatRoleName(row?.role?.name),
            sortable: true,
        },
        {
            name: "DOB",
            selector: (row) => row?.dob,
            cell: (row) => {
                if (!row?.dob) return "N/A";
                return row.dob.includes("T") ? row.dob.split("T")[0] : row.dob;
            },
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="d-flex align-items-center justify-content-center gap-1 flex-nowrap">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link className="btn btn-icon btn-primary" to={`/staff-permissions/staff/view/${getStaffId(row)}`}>
                            <i className="fe fe-eye"></i>
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Link className="btn btn-icon btn-warning" to={`/staff-permissions/staff/edit/${getStaffId(row)}`}>
                            <i className="fe fe-edit"></i>
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                            className="btn btn-icon btn-danger"
                            variant=""
                            onClick={() => dispatch(openModal({ componentName: "DeleteStaff", data: row }))}
                        >
                            <i className="fe fe-trash"></i>
                        </Button>
                    </OverlayTrigger>
                </div>
            ),
            width: "150px",
            grow: 0,
        },
    ];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="e-table pb-5 table-responsive">
            <Row className="justify-content-between m-2 align-items-center">
                <Col sm={6}>
                    <div className="d-block">
                        <span>Show </span>
                        <select
                            className="mx-2"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value, 10));
                                setCurrentPage(1);
                            }}
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
                <Col sm={3}>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </Col>
            </Row>

            {currentItems.length > 0 ? (
                <DataTable data={currentItems} columns={COLUMNS} striped />
            ) : (
                <div className="text-center py-4">
                    <h5>No staff found</h5>
                </div>
            )}

            <div className="pagination_wrapper">
                <Row>
                    <Col>
                        <p className="fw-bolder mx-3 mt-3">
                            Total: - <span>{filteredData.length}</span>
                        </p>
                    </Col>
                </Row>
                <ul className="pagination">
                    <li>
                        <Button variant="default" onClick={prevPage} disabled={currentPage === 1}>
                            <i className="fa fa-angle-left"></i> Previous
                        </Button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                            <Button
                                variant={currentPage === index + 1 ? "primary" : "default"}
                                onClick={() => paginate(index + 1)}
                                className="mx-1"
                            >
                                {index + 1}
                            </Button>
                        </li>
                    ))}
                    <li>
                        <Button variant="default" onClick={nextPage} disabled={currentPage === totalPages}>
                            Next <i className="fa fa-angle-right"></i>
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
