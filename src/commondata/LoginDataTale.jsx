import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import DataTable from '../components/common/DataTable'
import { useGetLoginDataQuery } from '../redux/features/popUpEndpoints';
import Loader from '../layouts/layoutcomponents/loader';
import Error from '../layouts/layoutcomponents/Error';
import moment from 'moment';

export default function LoginDataTale() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const serialNumber = (currentPage - 1) * pageSize + 1;

    const { data: apiResponse, isError, error, isLoading, isFetching } = useGetLoginDataQuery(
        undefined,
        { refetchOnMountOrArgChange: true }
    );

    const responsePayload = apiResponse?.data;
    const loginData = Array.isArray(responsePayload)
        ? responsePayload
        : Array.isArray(responsePayload?.data)
            ? responsePayload.data
            : Array.isArray(apiResponse)
                ? apiResponse
                : [];

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    const COLUMNS = [
        {
            name: "#",
            selector: (row, index) => index + serialNumber,
            sortable: true,
        },
        {
            name: "Name",
            sortable: true,
            cell: (row) => row?.name || "N/A",
        },
        {
            name: "Email",
            sortable: true,
            cell: (row) => row?.email || "N/A",
        },
        {
            name: "Phone Number",
            sortable: true,
            cell: (row) => row?.phone_number || row?.phone || "N/A",
        },
        {
            name: "IP",
            sortable: true,
            cell: (row) => row?.IP || row?.ip || "N/A",
        },
        {
            name: "Created At",
            sortable: true,
            cell: (row) =>
                row?.createdAt
                    ? row.createdAt
                    : "N/A",
        },
    ];

    const filteredData = loginData.filter((item) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;

        const name = (item?.name ?? "").toString().toLowerCase();
        const email = (item?.email ?? "").toString().toLowerCase();
        const phone = (item?.phone_number ?? item?.phone ?? "").toString().toLowerCase();
        const ip = (item?.IP ?? item?.ip ?? "").toString().toLowerCase();
        const createdAt = item?.createdAt
            ? moment(item.createdAt).format("DD-MM-YYYY, hh:mm A").toLowerCase()
            : "";

        return (
            name.includes(term) ||
            email.includes(term) ||
            phone.includes(term) ||
            ip.includes(term) ||
            createdAt.includes(term)
        );
    });

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
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
        <div className="e-table pb-5 table-responsive">
            <Row className="mt-3 mx-2 align-items-center my-3">
                <Col as={Col} sm={5} xs={12}>
                    <div className="d-block ms-5">
                        <span>Show</span>
                        <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                            {[10, 25, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span>Entries</span>
                    </div>
                </Col>
                <Col as={Col} sm={4} xs={12}>
                    <Form.Group className="mx-3">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
            <div className="pagination_wrapper">
                <ul className="pagination">
                    <li>
                        <Button className="btn btn-default" variant="default" onClick={prevPage}>
                            <i className="fa fa-angle-left"></i> Previous
                        </Button>
                    </li>
                    {displayPages()}
                    <li>
                        <Button className="btn btn-default" variant="default" onClick={nextPage}>
                            Next <i className="fa fa-angle-right"></i>
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
