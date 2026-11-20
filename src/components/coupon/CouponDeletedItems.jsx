import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import DataTable from '../common/DataTable'
import { openModal } from "../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetTrashedCouponsQuery, useUpdateCouponStatusMutation } from "../../redux/features/couponAPIEndPoint";
import moment from "moment";
import { hasPermission } from "../../commondata/permissions";


export const CouponDeletedItems = () => {
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const [updateStatus, { isLoading: loading }] = useUpdateCouponStatusMutation()
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetTrashedCouponsQuery()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = hasPermission(role, permissions, "Coupon", "restore-trash")
    const showEdit = hasPermission(role, permissions, "Coupon", "edit")
    const showDelete = hasPermission(role, permissions, "Coupon", "delete")


    const handleStatusChange = async (id, status) => {
        try {
            const resp = await updateStatus({ id: id, formData: { status } })
            if (resp?.data?.http_status_code === 200) {
                refetch()
                toast.success(resp?.data?.message)
            } else {
                toast.error(resp?.data?.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message)
        }
    }


    useEffect(() => {
        refetch()
    }, [refetch])

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row, index) => `${index + serialNumber} {${row?.id}}`,
                sortable: true
            },
            {
                name: "Coupon Code",
                selector: (row) => row.coupon_code,
            },
            {
                name: "Coupon Type",
                selector: (row) => row.coupon_type,
            },
            {
                name: "Value",
                selector: (row) => row?.value,
            },
            {
                name: "Expiry Date",
                selector: (row) => row?.expiry_date,
            },
            {
                name: "No. of Coupon",
                selector: (row) => row?.no_coupon,
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A") : null,
            },
            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [checked, setChecked] = useState(row?.status);
                    return (
                        <>
                            <label className="custom-switch">
                                <input
                                    type="checkbox"
                                    className="custom-switch-input"
                                    onChange={() => {
                                        handleStatusChange(row?._id, !checked)
                                        setChecked(!checked)
                                    }}
                                    checked={checked}
                                    disabled={!showEdit}
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>
                        </>
                    )
                },
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                            <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreCoupon', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteCoupon', data: row, softDelete: false })) }} ><i className="fe fe-trash text-light"></i></Button>
                        </OverlayTrigger>
                    </div>
                ),
            },
        ];
        const couponData = data?.data || []
        const filteredData = couponData?.filter((item) => {
            const search = searchTerm.trim().toLowerCase();

            return (
                item.coupon_code.toLowerCase().includes(search) ||
                item.coupon_type.toLowerCase().includes(search) ||
                item.value.toString().toLowerCase().includes(search) ||
                item.expiry_date.toLowerCase().includes(search) ||
                item.no_coupon.toString().includes(search) ||
                item.createdAt.toLowerCase().includes(search)
            );
        });
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

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
                        <PageHeader titles="Coupons" active="Deleted Coupon List" items={["Home", "Coupon List"]} links={["/dashboard", "/coupons"]} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body className="data_table">
                                <div className="e-table pb-5 table-responsive">
                                    {loading && <Loader />}
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

                                    <DataTable data={currentItems} columns={COLUMNS} striped />

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
    };
};
