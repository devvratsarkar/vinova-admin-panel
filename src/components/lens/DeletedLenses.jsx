import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from '../common/DataTable'
import { openModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetDeletedLensQuery } from "../../redux/features/LensAPIEndPoint";
import moment from "moment";


export default function DeletedLenses() {
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetDeletedLensQuery()

    const role = localStorage.getItem('role')
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.Lens.includes("edit"))
    const showRestore = role === "Admin" || (role === "Staff" && permissions.Lens.includes("srestore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Lens.includes("delete"))


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
                selector: (row, index) => `${index + serialNumber}`,
                sortable: true
            },
            {
                name: "Name",
                selector: (row) => row.name,
                sortable: true,
                wrap: true,
            },
            {
                name: "Image",
                selector: (row) => row?.featured_image,
                cell: (row) => (
                    <img
                        src={row?.image}
                        alt={row?.name}
                        className={`inventory_product_image`}
                    />
                ),
            },
            {
                name: "Brand",
                selector: (row) => row?.brand?.name,
                sortable: true
            },
            {
                name: "Type",
                selector: (row) => row?.type,
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
                                    checked={checked}
                                    disabled
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>
                        </>
                    )
                },
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
                sortable: true
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        {/* {
                            showRestore && ( */}
                        <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                            <Button type="button" className="btn btn-icon  btn-primary" variant="" onClick={() => { dispatch(openModal({ componentName: 'RestoreLens', data: row })) }}><i className="fe fe-refresh-ccw text-white"></i></Button>
                        </OverlayTrigger>
                        {/* )
                        }
                        {
                            showEdit && ( */}
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteLens', data: row, softDelete: false })) }}><i className="fe fe-trash text-white"></i></Button>
                        </OverlayTrigger>
                        {/* )
                        } */}
                    </div>
                ),
            },
        ];

        const categoryData = Array.isArray(data?.data) && data.data.length > 0 ? data.data : [];

        console.log("categoryData", data?.data)
        const filteredData = categoryData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.createdAt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <Button className="btn btn-default" variant="default" onClick={() => paginate(i)}>
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
                <Row>
                    <Col>
                        <PageHeader titles="Lens quality category" active={[`Lens quality category Trash`]} items={["Home", `Lens quality category List`]} links={["/dashboard", "/catalogue/lenses"]} />
                    </Col>
                </Row>
                <Card className="data_table">
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
            </>
        );
    };
};
