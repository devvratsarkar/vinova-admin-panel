import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from '../components/common/DataTable'
import toast from "react-hot-toast";
import { useGetAllCoutriesQuery, useUpdateCountryStatusMutation } from "../redux/features/currencyCountryAPIEndPoint";
import { usePermissions } from "./usePermissions";

export default function CountryDataTable() {
    const { setCountry } = usePermissions();
    const navigate = useNavigate();
    const [serialNumber, setSerialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const role = localStorage.getItem("role");
    const permissions = JSON.parse(localStorage.getItem("permissions"));


    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllCoutriesQuery();

    const [updateStatus, { isLoading: loadingStatusUpate }] = useUpdateCountryStatusMutation();

    const handleUpdateStatus = async (id, status) => {
        try {
            const resp = await updateStatus({ id: id, formData: { status } });

            if (resp?.data?.http_status_code === 200) {
                refetch();
                toast.success(resp?.data?.message);
            } else {
                console.log("error", resp);
                toast.error(resp?.data?.message);
            }
        } catch (err) {
            console.log("err", err);
            toast.error(err?.message);
        }
    };

    useEffect(() => {
        refetch();
    }, [refetch]);

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
                selector: (row, index) => `${index + serialNumber}`,
                sortable: true,
            },
            {
                name: "Country Name",
                selector: (row) => row.name,
                sortable: true,
            },
            {
                name: "Country code",
                selector: (row) => row.code,
                sortable: true,
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
                                        handleUpdateStatus(row?._id, !checked);
                                        setChecked(!checked);
                                    }}
                                    checked={checked}
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>
                        </>
                    );
                },
            },
            {
                name: "Actions",
                cell: (row) => (
                    <Button
                        variant="primary"
                        onClick={() => {
                            setCountry(row.code);
                            navigate("/dashboard");
                        }}
                    >
                        Visit
                    </Button>
                ),
            },
        ];

        const allBrandData = Array.isArray(data?.data) && data?.data?.length > 0 ? data?.data : [];
        const filteredData = allBrandData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <Button
                                className="btn btn-default"
                                variant={currentPage === i ? "primary" : "default"}
                                onClick={() => paginate(i)}
                            >
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
                {(loadingStatusUpate || isLoading) && <Loader />}
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
                    </Row>

                    <Row className="justify-content-end mb-3">
                        <Col as={Col} sm={3}>
                            <Form.Group className="mx-3">
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <DataTable data={currentItems} columns={COLUMNS} striped />
                    <div className="pagination_wrapper">
                        <Row>
                            <Col>
                                <p className="fw-bolder mx-3 mt-3">Total: - <span>{filteredData?.length}</span></p>
                            </Col>
                        </Row>
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
            </>
        );
    }
}