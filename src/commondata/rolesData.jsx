import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import DataTable from '../components/common/DataTable'
import { Link } from "react-router-dom";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import { useGetAllRolesQuery } from "../redux/features/staffEndPoint";
import { formatRoleName } from "../utils/permissionOptions";

const getRoleId = (row) => row?._id ?? row?.id;

export default function RolesDataTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isError, error, isLoading, isFetching } = useGetAllRolesQuery();

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    const rolesData = Array.isArray(data?.data) ? data.data : [];
    const filteredData = rolesData.filter((item) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return formatRoleName(item?.name).toLowerCase().includes(term) || item?.name?.toLowerCase().includes(term);
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
            name: "Role Name",
            selector: (row) => row?.name,
            cell: (row) => formatRoleName(row?.name),
            sortable: true,
        },
        {
            name: "Created At",
            selector: (row) => row?.createdAt,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="d-flex align-items-center justify-content-center gap-1 flex-nowrap">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Link className="btn btn-icon btn-warning" to={`/staff-permissions/roles/edit/${getRoleId(row)}`}>
                            <i className="fe fe-edit"></i>
                        </Link>
                    </OverlayTrigger>
                </div>
            ),
            width: "100px",
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
            <Row className="justify-content-between mt-3 mx-2 align-items-center mb-3">
                <Col sm={6}>
                    <div className="d-block ms-3">
                        <span>Show</span>
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
                        placeholder="Search role..."
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
                    <h5>No roles found</h5>
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
