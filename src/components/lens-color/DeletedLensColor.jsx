import React, { useEffect, useState } from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, OverlayTrigger, Tooltip, Form, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LensColorDataTable } from "../../commondata/lensColorDataTable";
import { useGetAllSoftDeletedLensColorQuery } from "../../redux/features/lensColorAPIEndPoint";
import { useDispatch } from "react-redux";
import DataTable from '../common/DataTable'
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import Loader from "../../layouts/layoutcomponents/loader";
import { openModal } from "../../redux/slices/allModalSlice";
import useDebounce from "../../hooks/useDebounce";
import { allow } from "../../commondata/permissions";



export default function DeletedLensColor() {
    const [serialNumberm, setSerialNUmber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllSoftDeletedLensColorQuery({
        search: debouncedSearch.trim(),
    })

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);



    if (isLoading) {
        return <Loader />;
    }

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row, index) => `${index + serialNumberm} {${row?.id}}`,
                sortable: true
            },
            {
                name: "Name",
                selector: (row) => row.name,
                sortable: true
            },
            {
                name: "Color",
                selector: (row) => row.code,
                cell: (row) => (
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: row.code,
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    />
                ),
                sortable: true
            },
            {
                name: "Color Code",
                selector: (row) => row.code,
                sortable: true
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt,
                sortable: true
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
                                    // onChange={() => {
                                    //     handleStatusChange(row?.id)
                                    //     setChecked(!checked)
                                    // }}
                                    checked={checked}
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>

                        </>
                    );
                },
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">

                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button type="button" className="btn btn-icon  btn-warning" variant="" onClick={() => { dispatch(openModal({ componentName: 'RestoreLensColor', data: row, softDelete: true })) }}><i className="fe fe-refresh-ccw text-white"></i></Button>
                        </OverlayTrigger>

                        {allow("LensColor", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteLensColor', data: row, softDelete: false })) }}><i className="fe fe-trash text-white"></i></Button>
                        </OverlayTrigger>
)}

                    </div>
                ),
            },
        ];
        const categoryData = Array.isArray(data?.data) && data.data.length > 0 ? data.data : [];
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(categoryData.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = categoryData.slice(indexOfFirstItem, indexOfLastItem);

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
                {isFetching && <Loader />}
                <Row className="align-items-center">
                    <Col>
                        <PageHeader titles="Lens Color" active="Trash Les Color List" items={["Home", "Lens Color List"]} links={['/dashboard', "/catalogue/lens-color"]} />
                    </Col>
                    <Col className="text-end d-flex justify-content-end gap-1">
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body className="data_table">
                                <Row className="mt-3 px-3">
                                </Row>
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
