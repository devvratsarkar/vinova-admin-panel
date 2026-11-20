import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import DataTable from '../../common/DataTable'
import { useParams } from 'react-router-dom'
import { State } from 'country-state-city'
import moment from 'moment'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import Error from '../../../layouts/layoutcomponents/Error'
import { useGetSingleOptometristQuery } from '../../../redux/features/optometristEnquiryAPIEndPoint'

const STATUS_LABELS = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }

const text = (value) => (value === 0 || value ? String(value) : '—')
const yesNo = (value) => (value ? 'Yes' : 'No')
const date = (value) => {
    if (!value) return '—'
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('DD-MM-YYYY [at] hh:mm A') : value
}

const Field = ({ label, value, md = 4 }) => (
    <Col md={md} className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control value={text(value)} readOnly />
    </Col>
)

export default function ViewOptometristEnquiry() {
    const { id } = useParams()
    const { data, isLoading, isError, error } = useGetSingleOptometristQuery(id)
    const item = data?.data || {}
    const plan = item.plan || {}
    const commission = item.updated_commission_percentage || {}
    const transactions = Array.isArray(item.transactions) ? item.transactions : []
    const stateName = State.getStateByCodeAndCountry(item.state_code, item.country_code || 'IR')?.name || item.state
    const fee = (field) => (commission.is_updated ? commission[field] : plan[field])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredTransactions = transactions.filter((txn) => {
        const term = searchTerm.toLowerCase()
        if (!term) return true
        return [txn.plan_name, txn.plan?.name, txn.plan_type, txn.payment_method, txn.status, txn.source, txn.purchased_by, txn.transaction_id, txn.description]
            .join(' ')
            .toLowerCase()
            .includes(term)
    })
    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
    const currentItems = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const TRANSACTION_COLUMNS = [
        { name: '#', selector: (row, index) => (currentPage - 1) * pageSize + index + 1, width: '70px' },
        { name: 'Plan', selector: (row) => row?.plan_name || row?.plan?.name || '—', sortable: true, width: '140px' },
        { name: 'Plan type', selector: (row) => row?.plan_type || '—', sortable: true, width: '130px' },
        { name: 'Amount', selector: (row) => row?.amount ?? '—', sortable: true, width: '110px' },
        { name: 'Currency', selector: (row) => row?.currency_code || '—', width: '110px' },
        { name: 'Payment method', selector: (row) => row?.payment_method || '—', width: '150px' },
        { name: 'Status', selector: (row) => row?.status || '—', sortable: true, width: '120px' },
        { name: 'Source', selector: (row) => row?.source || '—', width: '120px' },
        { name: 'Purchased by', selector: (row) => row?.purchased_by || '—', width: '140px' },
        { name: 'Transaction ID', selector: (row) => row?.transaction_id || '—', width: '220px' },
        { name: 'Description', selector: (row) => row?.description || '—', width: '280px' },
        { name: 'Created at', selector: (row) => row?.createdAt || '—', width: '180px' },
    ]

    if (isLoading) return <Loader />
    if (isError) return <Error error_mes={error} />
    if (!item._id) return <p className="p-4">Optometrist not found</p>

    return (
        <>
            <Row>
                <Col>
                    <PageHeader
                        titles="Optometrist Enquiry"
                        active="View Optometrist"
                        items={['Home', 'Optometrist Enquiry']}
                        links={['/dashboard', '/optometrist/enquiry']}
                    />
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    <Card.Header className="bg-primary text-white fs-5 rounded-3">Basic details</Card.Header>
                    <Row className="mt-3">
                        <Field label="Name" value={item.name} />
                        <Field label="Phone number" value={item.phone_number} />
                        <Field label="Email" value={item.email} />
                        <Field label="Store name" value={item.store_name} />
                        <Field label="Gender" value={item.gender} />
                        <Field label="Date of birth" value={item.dob} />
                        <Field label="Designation" value={item.designation} />
                        <Field label="Qualification" value={item.qualification} />
                        <Field label="About" value={item.about} md={12} />
                    </Row>
                    {item.profile_pic && (
                        <div className="mb-3">
                            <Form.Label>Profile picture</Form.Label>
                            <div><img src={item.profile_pic} alt={item.name} style={{ maxWidth: 120, borderRadius: 8 }} /></div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Header className="bg-primary text-white fs-5 rounded-3">Account</Card.Header>
                    <Row className="mt-3">
                        <Field label="Optometrist status" value={STATUS_LABELS[item.optometrist_status] || item.optometrist_status} />
                        <Field label="Active" value={yesNo(item.status)} />
                        <Field label="Email verified" value={yesNo(item.is_email_verified)} />
                        <Field label="Verified" value={yesNo(item.is_verified)} />
                        <Field label="First time user" value={yesNo(item.first_time_user)} />
                        <Field label="Created at" value={date(item.createdAt)} />
                        <Field label="Updated at" value={date(item.updatedAt)} />
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Header className="bg-primary text-white fs-5 rounded-3">Location</Card.Header>
                    <Row className="mt-3">
                        <Field label="Country" value={item.country} />
                        <Field label="Country code" value={item.country_code} />
                        <Field label="State" value={stateName} />
                        <Field label="State code" value={item.state_code} />
                        <Field label="Address" value={item.address} md={12} />
                        <Field label="Currency" value={item.currency_code} />
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Header className="bg-primary text-white fs-5 rounded-3">Plan</Card.Header>
                    <Row className="mt-3">
                        <Field label="Plan" value={plan.name} />
                        <Field label="Plan type" value={item.plan_type} />
                        <Field label="Free plan" value={yesNo(plan.is_free)} />
                        <Field label="Monthly price" value={plan.monthly_price} />
                        <Field label="Yearly price" value={plan.yearly_price} />
                        <Field label="Plan status" value={plan.status ? 'Active' : 'Inactive'} />
                        <Col md={12} className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={text(plan.description)} readOnly />
                        </Col>
                        <Col md={12} className="mb-3">
                            <Form.Label>Features</Form.Label>
                            <Form.Control as="textarea" rows={2} value={text(plan.features)} readOnly />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Header className="bg-primary text-white fs-5 rounded-3">Commission</Card.Header>
                    <Row className="mt-3">
                        <Field label="Platform fee %" value={fee('platform_fee_percentage')} />
                        <Field label="Give %" value={fee('customer_commission_percentage')} />
                        <Field label="Take %" value={fee('optometrist_commission_percentage')} />
                        <Field label="Updated by super admin" value={yesNo(commission.is_updated)} />
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Header className="bg-primary text-white fs-5 rounded-3">Transactions</Card.Header>
                    <div className="e-table pb-5 table-responsive mt-3">
                        <Row className="m-5">
                            <Col sm={6}>
                                <span>Show</span>
                                <select className="mx-2" value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setCurrentPage(1) }}>
                                    {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                                </select>
                                <span>Entries</span>
                            </Col>
                            <Col sm={6}>
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} />
                            </Col>
                        </Row>
                        <DataTable data={currentItems} columns={TRANSACTION_COLUMNS} striped keyField="_id" />
                        <div className="pagination_wrapper">
                            <ul className="pagination">
                                <li>
                                    <Button className="btn btn-default" variant="default" onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}>
                                        <i className="fa fa-angle-left"></i> Previous
                                    </Button>
                                </li>
                                <li className={currentPage === 1 ? 'active' : ''}>
                                    <Button className="btn btn-default" variant={currentPage === 1 ? 'primary' : 'default'} onClick={() => setCurrentPage(1)}>1</Button>
                                </li>
                                {totalPages > 1 && Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((page) => (
                                    <li key={page} className={currentPage === page ? 'active' : ''}>
                                        <Button className="btn btn-default" variant={currentPage === page ? 'primary' : 'default'} onClick={() => setCurrentPage(page)}>{page}</Button>
                                    </li>
                                ))}
                                <li>
                                    <Button className="btn btn-default" variant="default" onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}>
                                        Next <i className="fa fa-angle-right"></i>
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
