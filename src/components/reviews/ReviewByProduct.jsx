import React, { useState } from "react";
import { Col, Card, Button, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import DataTable from '../common/DataTable'



export const dummyProductReviews = [
    {
        _id: "rev001",
        type: "product",
        user_id: {
            name: "Rohit Sharma",
            email: "rohit@example.com",
        },
        itemId: {
            name: "Organic Honey",
            banner_image:
                "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60",
        },
        rating: 4,
        text: "<p>Great quality honey! Very pure and authentic.</p>",
        status: "pending",
    },
    {
        _id: "rev002",
        type: "product",
        user_id: {
            name: "Priya Verma",
            email: "priya.verma@example.com",
        },
        itemId: {
            name: "Organic Honey",
            banner_image:
                "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60",
        },
        rating: 5,
        text: "<p>Absolutely amazing taste! Highly recommend.</p>",
        status: "success",
    },
    {
        _id: "rev003",
        type: "product",
        user_id: {
            name: "Amit Patel",
            email: "amit.patel@example.com",
        },
        itemId: {
            name: "Organic Honey",
            banner_image:
                "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60",
        },
        rating: 2,
        text: "<p>Not what I expected. Taste was average.</p>",
        status: "rejected",
    },
    {
        _id: "rev004",
        type: "product",
        user_id: {
            name: "Sneha Gupta",
            email: "sneha.g@example.com",
        },
        itemId: {
            name: "Organic Honey",
            banner_image:
                "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60",
        },
        rating: 3,
        text: "<p>Good product but delivery was late.</p>",
        status: "pending",
    },
    {
        _id: "rev005",
        type: "product",
        user_id: {
            name: "Vikas Singh",
            email: "vikas.singh@example.com",
        },
        itemId: {
            name: "Organic Honey",
            banner_image:
                "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60",
        },
        rating: 4.5,
        text: "<p>Quality is superb, will order again!</p>",
        status: "success",
    },
];

export default function ReviewByProduct() {
    const { type, id, product_name } = useParams();
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [searchTerm, setSearchTerm] = useState("");
    // const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetReviewsByProductQuery({ type: type, id: id })
    const [serialNumber, setSerialNumber] = useState(1)
    // const [acceptReview, { isLoading: loading }] = useAcceptReviewMutation();
    // const [rejectReview, { isLoading: load }] = useRejectReviewMutation();

    // if (isLoading || isFetching) {
    //     return <Loader />;
    // }
    // if (isError) {
    //     return <Error error_mes={error} />;
    // }


    // if (isSuccess) {

    const COLUMNS = [
        {
            name: "#",
            cell: (row, index) => index + serialNumber,
            sortable: true,
        },
        {
            name: "Customer Name",
            selector: (row) => row.user_id?.name,
            cell: (row) => row.user_id?.name,
            sortable: true,
        },
        {
            name: "Customer Email",
            selector: (row) => row.user_id?.email,
            cell: (row) => row.user_id?.email,
            sortable: true,
        },
        {
            name: "Image",
            selector: (row) => row?.itemId?.banner_image,
            cell: (row) => <img src={row?.itemId?.banner_image} width={75} height={75} />,
        },
        {
            name: "Product Name",
            selector: (row) => row.itemId?.name,
        },
        {
            name: "Total Rating",
            selector: (row) => row.rating,
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <Box sx={{ "& > legend": { mt: 0 } }}>
                        <Rating name="read-only" className="Rating" size="small" value={row.rating} readOnly />
                    </Box>
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: "Reviews",
            selector: (row) => row.latest_review?.text,
            cell: (row) => (
                <div className="grid review-section">
                    <div className="review_content">
                        <div dangerouslySetInnerHTML={{ __html: row?.text }} />
                    </div>
                </div>
            ),
            // width: "300px", // Add this to increase the width of the Reviews column
            wrap: true,
        },
        {
            name: "status",
            selector: (row) => row.latest_review?.text,
            cell: (row) => {
                const status = row.status || getStatus(row.rating);
                return (
                    <span
                        className={`badge ${status.toLowerCase() === "pending" ? "bg-warning" : status.toLowerCase() === "success" ? "bg-success" : "bg-danger"}`}
                    >
                        {status.toLowerCase() === "pending" ? "Pending" : status.toLowerCase() === "Success" ? "bg-success" : "Rejected"}
                    </span>
                );
            },
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action_icon_wrapper d-flex justify-content-center gap-2">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link
                            className="btn btn-icon btn-primary"
                            to={`/reviews/view/${row?.type}/${row.id}`}
                        >
                            <i className="fe fe-eye"></i>
                        </Link>
                    </OverlayTrigger>
                    {row?.status.toLowerCase() === 'pending' &&
                        <>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Approve</Tooltip>}>
                                <Button
                                    className="btn btn-icon btn-success text-light"
                                    variant=""
                                    onClick={() => handleApprove(row._id)}
                                >
                                    <i className="fe fe-check"></i>
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Reject</Tooltip>}>
                                <Button
                                    className="btn btn-icon btn-danger text-light"
                                    variant=""
                                    onClick={() => handleReject(row._id)}
                                >
                                    <i className="fe fe-x"></i>
                                </Button>
                            </OverlayTrigger>
                        </>
                    }
                </div>
            ),
        },
    ];

    const handleApprove = async (reviewId) => {
        try {
            // const res = await acceptReview(reviewId);
            // if (res?.data?.http_status_code === 200) {
            //     refetch()
            // }

        } catch (error) {
            console.log('error', error);
        }
    };

    const handleReject = async (reviewId) => {
        try {
            // const res = await rejectReview(reviewId);
            // if (res?.data?.http_status_code === 200) {
            //     refetch()
            // }

        } catch (error) {
            console.log('error', error);
        }
    };

    // const allReviewData = data?.data || [];
    const allReviewData = dummyProductReviews;
    const filteredData = allReviewData?.filter((item) =>
        item?.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.type.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles={`${product_name} Reviews`} active={`${product_name} Reviews`} items={["Home", "View All Reviews"]} links={["/dashboard", `/reviews`]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-4">
                    <Link to={`/reviews`} className="btn btn-success text-white me-3">
                        View Reviews list
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <div className="e-table pb-5 table-responsive review_table">
                                <Row className="m-5">
                                    {/* {loading || load && <Loader />} */}
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
                                <DataTable
                                    data={currentItems}
                                    columns={COLUMNS}
                                    striped
                                    customStyles={{
                                        rows: {
                                            style: {
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                },
                                            },
                                        },
                                    }}
                                />
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
// }
