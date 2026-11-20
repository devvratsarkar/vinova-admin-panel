import React, { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import DataTable from '../components/common/DataTable'
import moment from 'moment';

const DUMMY_DATA = [
    { id: 1, optometrist: 'Dr. Sarah Mitchell', orders: 24, sales: 4850, commissionEarned: 242.50, createdAt: '2025-02-10T14:30:00Z' },
    { id: 2, optometrist: 'Dr. James Chen', orders: 18, sales: 3620, commissionEarned: 181.00, createdAt: '2025-02-12T09:15:00Z' },
    { id: 3, optometrist: 'Dr. Emily Roberts', orders: 31, sales: 6190, commissionEarned: 309.50, createdAt: '2025-02-08T16:45:00Z' },
    { id: 4, optometrist: 'Dr. Michael Torres', orders: 12, sales: 2280, commissionEarned: 114.00, createdAt: '2025-02-14T11:20:00Z' },
    { id: 5, optometrist: 'Dr. Priya Sharma', orders: 27, sales: 5410, commissionEarned: 270.50, createdAt: '2025-02-06T08:00:00Z' },
    { id: 6, optometrist: 'Dr. David Kim', orders: 15, sales: 2950, commissionEarned: 147.50, createdAt: '2025-02-13T13:10:00Z' },
    { id: 7, optometrist: 'Dr. Lisa Anderson', orders: 22, sales: 4380, commissionEarned: 219.00, createdAt: '2025-02-11T10:30:00Z' },
    { id: 8, optometrist: 'Dr. Robert Williams', orders: 19, sales: 3840, commissionEarned: 192.00, createdAt: '2025-02-09T15:00:00Z' },
];

export default function CommissionByOptometristDataTable() {
    const [serialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const COLUMNS = [
        {
            name: '#',
            selector: (row, index) => index + serialNumber,
            sortable: true,
        },
        {
            name: 'Optometrist',
            selector: (row) => row.optometrist,
            sortable: true,
            width: '220px',
        },
        {
            name: 'Orders',
            selector: (row) => row.orders,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Sales',
            selector: (row) => row.sales,
            sortable: true,
            cell: (row) => `$${row.sales.toLocaleString()}`,
            width: '140px',
        },
        {
            name: 'Commission earned',
            selector: (row) => row.commissionEarned,
            sortable: true,
            cell: (row) => `$${row.commissionEarned.toLocaleString()}`,
            width: '180px',
        },
        {
            name: 'Created at',
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => (row.createdAt ? moment(row.createdAt).fromNow() : '—'),
            width: '160px',
        },
    ];

    const productsData = DUMMY_DATA;
    const filteredproductData = searchTerm
        ? productsData.filter((item) => {
            const searchTermLower = searchTerm.toLowerCase();
            const createdAtAgo = item?.createdAt ? moment(item.createdAt).fromNow().toLowerCase() : '';
            return (
                item?.optometrist?.toLowerCase().includes(searchTermLower) ||
                item?.orders?.toString().includes(searchTermLower) ||
                item?.sales?.toString().includes(searchTermLower) ||
                item?.commissionEarned?.toString().includes(searchTermLower) ||
                createdAtAgo.includes(searchTermLower)
            );
        })
        : productsData;

    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(filteredproductData?.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredproductData?.slice(indexOfFirstItem, indexOfLastItem);

    const displayPages = () => {
        const pageButtons = [];
        const delta = 2;
        const left = currentPage - delta;
        const right = currentPage + delta + 1;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i < right)) {
                pageButtons.push(
                    <li key={i} className={currentPage === i ? 'active' : ''}>
                        <Button
                            className="btn btn-default"
                            variant={currentPage === i ? 'primary' : 'default'}
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="e-table p-5">
            <h4 className="fw-semibold mb-4">Commission by Optometrist</h4>
            <Row className="justify-content-between mb-4">
                <Col as={Col} xs={12} sm={6}>
                    <div className="d-block">
                        <span>Show </span>
                        <select
                            className="m-1"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
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
                <Col as={Col} xs={12} sm={6}>
                    <Form.Group className="w_fit ms-auto">
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {filteredproductData.length > 0 ? (
                <DataTable data={currentItems} columns={COLUMNS} striped />
            ) : (
                <div className="text-center py-4">
                    <h5>No records found</h5>
                </div>
            )}

            <div className="pagination_wrapper">
                <Row>
                    <Col>
                        <p className="fw-bolder mx-3 mt-3">
                            Total: - <span>{filteredproductData?.length}</span>
                        </p>
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
    );
}
