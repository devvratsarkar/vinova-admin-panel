import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Button,
    Form,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import DataTable from '../components/common/DataTable'
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { openModal } from "../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import {
    useGetAllPoliciesQuery,
    useUpdatePolicyStatusMutation,
} from "../redux/features/policyAPIEndPoint";
import { allow } from "./permissions";

const getPolicyId = (row) => row?.id ?? row?._id;

const getPolicyTypeLabel = (type) => {
    const labels = {
        "terms-conditions": "Terms & Condition",
        "privacy-policy": "Privacy Policy",
        "refund-return": "Refund & Return Policy",
        "cancelation-policy": "Cancellation Policy",
        "vendor-policy": "Vendor Policy",
    };
    return labels[type] || type || "N/A";
};

function PolicyStatusSwitch({ row, updateStatus, onSuccess }) {
    const [checked, setChecked] = useState(!!row?.status);

    useEffect(() => {
        setChecked(!!row?.status);
    }, [row?.status]);

    const handleStatusChange = async () => {
        const nextStatus = !checked;
        setChecked(nextStatus);

        try {
            const resp = await updateStatus({
                id: getPolicyId(row),
                formData: { status: nextStatus },
            });

            if (resp?.data?.http_status_code === 200 || resp?.data?.http_status_code === 201) {
                onSuccess?.();
                toast.success(resp?.data?.message || "Status updated successfully");
            } else {
                setChecked(!nextStatus);
                toast.error(resp?.data?.message || "Failed to update status");
            }
        } catch (err) {
            setChecked(!nextStatus);
            toast.error(err?.message || "An error occurred");
        }
    };

    return (
        <label className="custom-switch" style={{ cursor: "pointer" }}>
            <input
                type="checkbox"
                className="custom-switch-input"
                onChange={handleStatusChange}
                checked={checked}
             disabled={!allow("Policy", "edit")} />
            <span className="custom-switch-indicator custum-green-btn"></span>
        </label>
    );
}

export default function PolicyDatatable() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [serialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllPoliciesQuery(
        undefined,
        { refetchOnMountOrArgChange: true }
    );
    const [updateStatus, { isLoading: updateStatusLoading }] = useUpdatePolicyStatusMutation();

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    if (!isSuccess) {
        return null;
    }

    const policyList = Array.isArray(data?.data) ? data.data : [];

    const filteredData = policyList.filter((item) => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        if (!searchTermLower) return true;

        const type = getPolicyTypeLabel(item?.type).toLowerCase();
        const title = (item?.title ?? "").toString().toLowerCase();
        const status = item?.status ? "active" : "inactive";
        const createdAt = (item?.createdAt ?? "").toString().toLowerCase();

        return (
            type.includes(searchTermLower) ||
            title.includes(searchTermLower) ||
            createdAt.includes(searchTermLower) ||
            status.includes(searchTermLower)
        );
    });

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const COLUMNS = [
        {
            name: "#",
            selector: (row, index) => index + serialNumber,
            sortable: true,
        },
        {
            name: "Type",
            sortable: true,
            cell: (row) => getPolicyTypeLabel(row?.type),
        },
        {
            name: "Banner",
            cell: (row) =>
                row?.banner ? (
                    <img src={row.banner} width={75} height={75} alt="banner" />
                ) : (
                    "N/A"
                ),
        },
        {
            name: "Title",
            sortable: true,
            cell: (row) => row?.title || "N/A",
        },
        {
            name: "Created At",
            selector: (row) => row?.createdAt,
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => (
                <PolicyStatusSwitch
                    row={row}
                    updateStatus={updateStatus}
                    onSuccess={refetch}
                />
            ),
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="d-flex justify-content-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link className="btn btn-icon btn-primary mx-1" to={`/view-policy/${getPolicyId(row)}`}>
                            <i className="fe fe-eye"></i>
                        </Link>
                    </OverlayTrigger>

                    {allow("Policy", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Link className="btn btn-icon btn-warning mx-1" to={`/edit-policy/${getPolicyId(row)}`}>
                            <i className="fe fe-edit"></i>
                        </Link>
                    </OverlayTrigger>
)}

                    {allow("Policy", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                            className="btn btn-icon btn-danger text-light mx-1"
                            variant=""
                            onClick={() => {
                                dispatch(
                                    openModal({
                                        componentName: "DeletePolicy",
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
        },
    ];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    return (
        <>
            {updateStatusLoading && <Loader />}

            <div className="e-table pb-5 table-responsive">
                <Row className="justify-content-between mt-3 mx-2 align-items-center">
                    <Col sm={6} xs={12}>
                        <div className="d-inline-block">
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

                    <Col sm={3} xs={12}>
                        <Form.Group className="m-3">
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <DataTable data={currentItems} columns={COLUMNS} striped />

                <div className="pagination_wrapper mt-3 d-flex justify-content-between align-items-center">
                    <div>
                        <p className="fw-bold mb-0">
                            Total Policies:{" "}
                            <Button variant="default" disabled className="text-secondary fw-bolder">
                                {filteredData.length}
                            </Button>
                        </p>
                    </div>
                    <ul className="pagination mb-0">
                        <li>
                            <Button variant="default" onClick={prevPage} disabled={currentPage === 1}>
                                <i className="fa fa-angle-left"></i> Previous
                            </Button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i}>
                                <Button
                                    variant={currentPage === i + 1 ? "primary" : "default"}
                                    onClick={() => paginate(i + 1)}
                                    className="mx-1"
                                >
                                    {i + 1}
                                </Button>
                            </li>
                        ))}
                        <li>
                            <Button
                                variant="default"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
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
