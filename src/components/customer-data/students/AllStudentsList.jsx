import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import Loader from '../../../layouts/layoutcomponents/loader'
import DataTable from '../../common/DataTable'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import moment from 'moment'
import Error from '../../../layouts/layoutcomponents/Error'
import { useGetAllEnquiriesQuery } from '../../../redux/features/getApiSecond'

export default function AllStudentsList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const serialNumber = (currentPage - 1) * pageSize + 1;

    const { data: apiResponse, isError, error, isLoading, isFetching } = useGetAllEnquiriesQuery(
        { page: currentPage, limit: pageSize },
        { refetchOnMountOrArgChange: true }
    );

    const responsePayload = apiResponse?.data;
    const enquiryData = Array.isArray(responsePayload)
        ? responsePayload
        : Array.isArray(responsePayload?.data)
            ? responsePayload.data
            : [];
    const totalFromApi = apiResponse?.total ?? responsePayload?.total ?? enquiryData.length;
    const totalPages = Math.ceil(totalFromApi / pageSize) || 1;

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
            width: "80px",
        },
        {
            name: "Name",
            selector: (row) => row?.name || "N/A",
            sortable: true,
            width: "180px",
        },
        {
            name: "Email",
            selector: (row) => row?.email || "N/A",
            sortable: true,
            width: "220px",
        },
        {
            name: "Phone",
            selector: (row) => row?.phone || "N/A",
            sortable: true,
            width: "150px",
        },
        {
            name: "Country",
            selector: (row) => row?.country || "N/A",
            sortable: true,
            width: "150px",
        },
        {
            name: "Message",
            selector: (row) => row?.message || "N/A",
            sortable: true,
            width: "280px",
        },
        {
            name: "Status",
            selector: (row) => row?.status,
            cell: (row) => (
                <span className={`badge rounded-pill ${row?.status ? "bg-success" : "bg-secondary"}`}>
                    {row?.status ? "Active" : "Inactive"}
                </span>
            ),
            width: "120px",
        },
        {
            name: "Created At",
            selector: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY, hh:mm A") : "N/A",
            sortable: true,
            width: "200px",
        },
    ];

    const filteredData = enquiryData?.filter((item) => {
        const term = searchTerm.toLowerCase().trim();
        const name = (item?.name ?? "").toString().toLowerCase();
        const email = (item?.email ?? "").toString().toLowerCase();
        const phone = (item?.phone ?? "").toString().toLowerCase();
        const country = (item?.country ?? "").toString().toLowerCase();
        const message = (item?.message ?? "").toString().toLowerCase();
        const createdAt = item?.createdAt
            ? moment(item.createdAt).format("DD-MM-YYYY, hh:mm A").toLowerCase()
            : "";

        return (
            name.includes(term) ||
            email.includes(term) ||
            phone.includes(term) ||
            country.includes(term) ||
            message.includes(term) ||
            createdAt.includes(term)
        );
    });

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
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <PageHeader titles="Student Enquiry" active="Student Enquiry" items={["Home"]} links={["/dashboard"]} />
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Body>
                        <div className="e-table pb-5 table-responsive">
                            <Row className="m-5">
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
                            <DataTable data={filteredData} columns={COLUMNS} striped />
                            <div className="pagination_wrapper mt-3 mx-1">
                                <div className="mt-3 ms-3">
                                    <p className="fw-bold">
                                        Total Enquiries&nbsp;:- &nbsp;
                                        <span>
                                            <Button variant="default" disabled className="text-secondary fw-bolder">
                                                {totalFromApi}
                                            </Button>
                                        </span>
                                    </p>
                                </div>
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
                    </Card.Body>
                </Card>
            </Row>
        </>
    )
}
