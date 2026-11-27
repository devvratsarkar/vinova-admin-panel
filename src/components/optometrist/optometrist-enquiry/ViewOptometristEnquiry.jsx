import React, { useState } from 'react'
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { ListFilters, ListTable, boundFilters, indexColumn, useListFilters } from '../../common/ListFilters'
import { useParams } from 'react-router-dom'
import { State } from 'country-state-city'
import moment from 'moment'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import Error from '../../../layouts/layoutcomponents/Error'
import { useGetSingleOptometristQuery } from '../../../redux/features/optometristEnquiryAPIEndPoint'

const STATUS_LABELS = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }
const STATUS_BADGE = { approved: 'success', pending: 'warning', rejected: 'danger' }

const text = (value) => (value === 0 || value ? String(value) : '—')
const yesNo = (value) => (value ? 'Yes' : 'No')
const money = (value) => (value != null ? Number(value).toLocaleString() : '—')
const date = (value) => {
    if (!value) return '—'
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('DD MMM YYYY [at] hh:mm A') : value
}
const shortDate = (value) => {
    if (!value) return '—'
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('DD MMM YYYY [at] hh:mm A') : value
}

const InfoItem = ({ label, value }) => (
    <div className="mb-3">
        <div className="text-muted small fw-semibold mb-1">{label}</div>
        <div className="fw-medium">{value ?? '—'}</div>
    </div>
)

const SectionCard = ({ title, children }) => (
    <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
            <h6 className="text-uppercase text-muted fw-bold mb-3 pb-2 border-bottom" style={{ letterSpacing: '0.07em', fontSize: '0.75rem' }}>
                {title}
            </h6>
            {children}
        </Card.Body>
    </Card>
)

function StatCell({ label, value, sub, color }) {
    return (
        <div className="text-center px-3 py-2" style={{ borderRight: '1px solid #e8edf3' }}>
            <div className="fw-bold" style={{ fontSize: '1.1rem', color: color || 'inherit' }}>{value}</div>
            <div className="text-muted small">{label}</div>
            {sub && <div className="text-muted" style={{ fontSize: '0.7rem' }}>{sub}</div>}
        </div>
    )
}

function CopyReferral({ code }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }
    return (
        <span className="d-inline-flex align-items-center gap-1 font-monospace px-2 py-1"
            style={{ background: '#eff4ff', color: '#3b6ef8', border: '1px solid #c7d7fd', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            Referral: {code}
            <button
                onClick={handleCopy}
                title="Copy referral code"
                style={{ background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', color: copied ? '#16a34a' : '#3b6ef8', fontSize: 13, lineHeight: 1 }}
            >
                {copied ? <IoCheckmarkOutline size={14} /> : <IoCopyOutline size={14} />}
            </button>
        </span>
    )
}

export default function ViewOptometristEnquiry() {
    const { id } = useParams()
    const txnList = useListFilters([])
    const txnPage = txnList.currentPage
    const txnPageSize = txnList.pageSize

    const { data, isLoading, isError, error } = useGetSingleOptometristQuery({
        id,
        ...txnList.query,
    })
    const item = data?.data || {}
    const plan = item.plan || {}
    const commission = item.updated_commission_percentage || {}
    const transactions = Array.isArray(item.transactions) ? item.transactions : []
    const wallet = item.wallet || {}
    const appointments = item.appointments || {}
    const earnings = item.earnings || {}
    const expenses = item.expenses || {}
    const withdrawals = item.withdrawals || {}
    const stateName = State.getStateByCodeAndCountry(item.state_code, item.country_code || 'IR')?.name || item.state
    const fee = (field) => (commission.is_updated ? commission[field] : plan[field])

    const txnRows = transactions.slice((txnPage - 1) * txnPageSize, txnPage * txnPageSize)

    const TRANSACTION_COLUMNS = [
        indexColumn(txnPage, txnPageSize),
        { id: 'plan', label: 'Plan', render: (r) => r?.plan_name || r?.plan?.name || '—', width: 140 },
        { id: 'plan_type', label: 'Plan type', render: (r) => r?.plan_type || '—', width: 120 },
        { id: 'amount', label: 'Amount', render: (r) => r?.amount?.toLocaleString() ?? '—', width: 120 },
        { id: 'currency', label: 'Currency', render: (r) => r?.currency_code || '—', width: 100 },
        { id: 'method', label: 'Payment method', render: (r) => r?.payment_method || '—', width: 150 },
        { id: 'status', label: 'Status', render: (r) => r?.status || '—', width: 120 },
        { id: 'source', label: 'Source', render: (r) => r?.source || '—', width: 110 },
        { id: 'purchased_by', label: 'Purchased by', render: (r) => r?.purchased_by || '—', width: 130 },
        { id: 'transaction_id', label: 'Transaction ID', render: (r) => r?.transaction_id || '—', width: 220 },
        { id: 'description', label: 'Description', render: (r) => r?.description || '—', width: 280 },
        { id: 'createdAt', label: 'Created at', render: (r) => r?.createdAt || '—', width: 180 },
    ]

    if (isLoading) return <Loader />
    if (isError) return <Error error_mes={error} />
    if (!item._id) return <p className="p-4">Optometrist not found</p>

    const initials = (item.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    const statusKey = item.optometrist_status || 'pending'
    const features = plan.features ? plan.features.split('\n').filter(Boolean) : []

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

            {/* Profile header */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-4 flex-wrap">
                        {item.profile_pic ? (
                            <img
                                src={item.profile_pic}
                                alt={item.name}
                                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                className="d-flex align-items-center justify-content-center bg-primary text-white fw-bold fs-4 rounded-circle"
                                style={{ width: 80, height: 80, flexShrink: 0 }}
                            >
                                {initials}
                            </div>
                        )}
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                <h4 className="mb-0 fw-bold">{item.name || '—'}</h4>
                                <Badge bg={STATUS_BADGE[statusKey] || 'secondary'} className="text-capitalize">
                                    {STATUS_LABELS[statusKey] || statusKey}
                                </Badge>
                                {item.selected_working_rule && (
                                    <Badge bg="light" text="dark" className="border text-capitalize">
                                        {item.selected_working_rule.replace(/_/g, ' ')}
                                    </Badge>
                                )}
                            </div>
                            <div className="text-muted mb-2">{item.store_name || '—'}</div>
                            <div className="d-flex gap-3 flex-wrap align-items-center small text-muted">
                                {(item.country || item.state) && (
                                    <span>📍 {[stateName, item.country].filter(Boolean).join(', ')}</span>
                                )}
                                {item.optometrist_referral_code && (
                                    <CopyReferral code={item.optometrist_referral_code} />
                                )}
                            </div>
                        </div>
                        {/* Quick stats */}
                        <div className="d-flex gap-0 flex-wrap" style={{ borderRadius: 8, border: '1px solid #e8edf3', overflow: 'hidden' }}>
                            <StatCell label="Customers" value={text(item.total_customers)} />
                            <StatCell label="Prescriptions" value={text(item.total_prescriptions)} />
                            <StatCell label="Appointments" value={text(appointments.total)} />
                            <StatCell label="Payment" value={
                                <Badge bg={item.payment_status === 'completed' ? 'success' : 'warning'} className="text-capitalize">
                                    {item.payment_status || '—'}
                                </Badge>
                            } style={{ borderRight: 'none' }} />
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Row>
                <Col lg={6}>
                    <SectionCard title="Basic Info">
                        <Row>
                            <Col sm={6}><InfoItem label="Name" value={text(item.name)} /></Col>
                            <Col sm={6}><InfoItem label="Phone" value={text(item.phone_number)} /></Col>
                            <Col sm={6}><InfoItem label="Email" value={text(item.email)} /></Col>
                            <Col sm={6}><InfoItem label="Store name" value={text(item.store_name)} /></Col>
                            <Col sm={6}><InfoItem label="Gender" value={text(item.gender)} /></Col>
                            <Col sm={6}><InfoItem label="Date of birth" value={text(item.dob)} /></Col>
                            <Col sm={6}><InfoItem label="Designation" value={text(item.designation)} /></Col>
                            <Col sm={6}><InfoItem label="Qualification" value={text(item.qualification)} /></Col>
                            <Col sm={6}><InfoItem label="Experience" value={item.experience ? `${item.experience} years` : '—'} /></Col>
                            {item.specialty?.length > 0 && (
                                <Col sm={6}><InfoItem label="Specialty" value={item.specialty.join(', ')} /></Col>
                            )}
                            {item.spoken_lang?.length > 0 && (
                                <Col sm={6}><InfoItem label="Languages" value={item.spoken_lang.join(', ')} /></Col>
                            )}
                            {item.about && <Col sm={12}><InfoItem label="About" value={item.about} /></Col>}
                        </Row>
                    </SectionCard>
                </Col>

                <Col lg={6}>
                    <SectionCard title="Account & Verification">
                        <Row>
                            <Col sm={6}><InfoItem label="Status" value={
                                <Badge bg={STATUS_BADGE[statusKey] || 'secondary'} className="text-capitalize">
                                    {STATUS_LABELS[statusKey] || statusKey}
                                </Badge>
                            } /></Col>
                            <Col sm={6}><InfoItem label="Active" value={yesNo(item.status)} /></Col>
                            {/* <Col sm={6}><InfoItem label="Email verified" value={yesNo(item.is_email_verified)} /></Col> */}
                            <Col sm={6}><InfoItem label="Verified" value={yesNo(item.is_verified)} /></Col>
                            {/* <Col sm={6}><InfoItem label="First time user" value={yesNo(item.first_time_user)} /></Col> */}
                            <Col sm={6}><InfoItem label="Working rule" value={item.selected_working_rule?.replace(/_/g, ' ') || '—'} /></Col>
                            <Col sm={6}><InfoItem label="Created at" value={date(item.createdAt)} /></Col>
                            <Col sm={6}><InfoItem label="Updated at" value={date(item.updatedAt)} /></Col>
                        </Row>
                    </SectionCard>
                </Col>
            </Row>

            <Row>
                <Col lg={6}>
                    <SectionCard title="Location">
                        <Row>
                            <Col sm={6}><InfoItem label="Country" value={text(item.country)} /></Col>
                            {/* <Col sm={6}><InfoItem label="Country code" value={text(item.country_code)} /></Col> */}
                            <Col sm={6}><InfoItem label="State" value={text(stateName)} /></Col>
                            {/* <Col sm={6}><InfoItem label="State code" value={text(item.state_code)} /></Col> */}
                            {/* <Col sm={6}><InfoItem label="Currency" value={text(item.currency_code)} /></Col> */}
                            <Col sm={12}><InfoItem label="Address" value={text(item.address)} /></Col>
                        </Row>
                    </SectionCard>
                </Col>

                <Col lg={6}>
                    <SectionCard title="Commission">
                        <Row>
                            <Col sm={4}><InfoItem label="Platform fee %" value={text(fee('platform_fee_percentage'))} /></Col>
                            <Col sm={4}><InfoItem label="Give %" value={text(fee('customer_commission_percentage'))} /></Col>
                            <Col sm={4}><InfoItem label="Take %" value={text(fee('optometrist_commission_percentage'))} /></Col>
                            {/* <Col sm={12}><InfoItem label="Updated by super admin" value={yesNo(commission.is_updated)} /></Col> */}
                        </Row>
                    </SectionCard>
                </Col>
            </Row>

            {/* Wallet & Earnings */}
            <Row>
                <Col lg={6}>
                    <SectionCard title="Wallet">
                        <Row>
                            <Col sm={6}><InfoItem label="Balance" value={`${money(wallet.balance)} ${wallet.currency || ''}`} /></Col>
                            <Col sm={6}><InfoItem label="Available balance" value={`${money(wallet.available_balance)} ${wallet.currency || ''}`} /></Col>
                            <Col sm={6}><InfoItem label="Appointment balance" value={`${money(wallet.appointment_balance)} ${wallet.currency || ''}`} /></Col>
                            <Col sm={6}><InfoItem label="Referral balance" value={`${money(wallet.referral_balance)} ${wallet.currency || ''}`} /></Col>
                            <Col sm={6}><InfoItem label="Pending withdrawal" value={`${money(wallet.pending_withdrawal)} ${wallet.currency || ''}`} /></Col>
                        </Row>
                    </SectionCard>
                </Col>

                <Col lg={6}>
                    <SectionCard title="Earnings">
                        <Row>
                            <Col sm={4}><InfoItem label="Total" value={money(earnings.total)} /></Col>
                            <Col sm={4}><InfoItem label="Appointment" value={money(earnings.appointment)} /></Col>
                            <Col sm={4}><InfoItem label="Referral" value={money(earnings.referral)} /></Col>
                        </Row>
                    </SectionCard>
                </Col>
            </Row>

            {/* Appointments */}
            <SectionCard title="Appointments">
                <Row className="mb-3">
                    <Col xs={6} sm={4} md={2}><InfoItem label="Total" value={text(appointments.total)} /></Col>
                    <Col xs={6} sm={4} md={2}><InfoItem label="Pending" value={text(appointments.pending)} /></Col>
                    <Col xs={6} sm={4} md={2}><InfoItem label="Accepted" value={text(appointments.accepted)} /></Col>
                    <Col xs={6} sm={4} md={2}><InfoItem label="Completed" value={text(appointments.completed)} /></Col>
                    <Col xs={6} sm={4} md={2}><InfoItem label="Rejected" value={text(appointments.rejected)} /></Col>
                    <Col xs={6} sm={4} md={2}><InfoItem label="Cancelled" value={text(appointments.cancelled)} /></Col>
                </Row>
                <div className="border-top pt-3">
                    <div className="text-muted small fw-semibold mb-2 text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>Type</div>
                    <Row className="mb-3">
                        <Col xs={6} sm={4}><InfoItem label="Online" value={text(appointments.online)} /></Col>
                        <Col xs={6} sm={4}><InfoItem label="In-person" value={text(appointments.in_person)} /></Col>
                        {/* <Col xs={6} sm={4}><InfoItem label="Both" value={text(appointments.both)} /></Col> */}
                    </Row>
                </div>
                <div className="border-top pt-3">
                    <div className="text-muted small fw-semibold mb-2 text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>Payments</div>
                    <Row>
                        <Col xs={6} sm={3}><InfoItem label="Paid count" value={text(appointments.paid_count)} /></Col>
                        <Col xs={6} sm={3}><InfoItem label="Paid amount" value={money(appointments.paid_amount)} /></Col>
                        <Col xs={6} sm={3}><InfoItem label="Refund pending" value={`${text(appointments.refund_pending_count)} (${money(appointments.refund_pending_amount)})`} /></Col>
                        <Col xs={6} sm={3}><InfoItem label="Refunded" value={`${text(appointments.refunded_count)} (${money(appointments.refunded_amount)})`} /></Col>
                    </Row>
                </div>
            </SectionCard>

            {/* Withdrawals */}
            <SectionCard title="Withdrawals">
                <Row>
                    <Col xs={6} sm={3}><InfoItem label="Total requests" value={text(withdrawals.total_requests)} /></Col>
                    <Col xs={6} sm={3}><InfoItem label="Pending" value={`${text(withdrawals.pending?.count)} (${money(withdrawals.pending?.amount)})`} /></Col>
                    <Col xs={6} sm={3}><InfoItem label="Completed" value={`${text(withdrawals.completed?.count)} (${money(withdrawals.completed?.amount)})`} /></Col>
                    <Col xs={6} sm={3}><InfoItem label="Rejected" value={`${text(withdrawals.rejected?.count)} (${money(withdrawals.rejected?.amount)})`} /></Col>
                </Row>
            </SectionCard>

            {/* Expenses */}
            {/* <SectionCard title="Expenses">
                <Row>
                    <Col xs={6} sm={4} md={3}><InfoItem label="Total" value={money(expenses.total)} /></Col>
                    <Col xs={6} sm={4} md={3}><InfoItem label="Membership plan" value={money(expenses.membership_plan)} /></Col>
                    <Col xs={6} sm={4} md={3}><InfoItem label="Paid from wallet" value={money(expenses.membership_plan_paid_from_wallet)} /></Col>
                    <Col xs={6} sm={4} md={3}><InfoItem label="Paid other" value={money(expenses.membership_plan_paid_other)} /></Col>
                </Row>
            </SectionCard> */}

            {/* Plan */}
            <SectionCard title="Plan">
                <Row>
                    <Col md={3} sm={6}><InfoItem label="Plan name" value={text(plan.name)} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Plan type" value={text(item.plan_type)} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Monthly price" value={plan.monthly_price != null ? `${plan.monthly_price}` : '—'} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Yearly price" value={plan.yearly_price != null ? `${plan.yearly_price}` : '—'} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Free plan" value={yesNo(plan.is_free)} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Plan status" value={plan.status ? 'Active' : 'Inactive'} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Started at" value={shortDate(item.plan_started_at)} /></Col>
                    <Col md={3} sm={6}><InfoItem label="Expires at" value={shortDate(item.plan_expires_at)} /></Col>
                    {plan.description && (
                        <Col md={12}><InfoItem label="Description" value={plan.description} /></Col>
                    )}
                    {features.length > 0 && (
                        <Col md={12}>
                            <div className="text-muted small fw-semibold mb-1">Features</div>
                            <ul className="mb-0 ps-3">
                                {features.map((f, i) => <li key={i} className="fw-medium">- {f}</li>)}
                            </ul>
                        </Col>
                    )}
                </Row>
            </SectionCard>

            {/* Transactions */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="data_table">
                    <div className="e-table pb-5">
                        <h6 className="text-uppercase text-muted fw-bold mb-3 p-3 border-bottom" style={{ letterSpacing: '0.07em', fontSize: '0.75rem' }}>
                            Transactions
                        </h6>
                        <ListFilters
                            {...boundFilters(txnList, { placeholder: 'Plan, method, or transaction ID' })}
                        />
                        <ListTable
                            columns={TRANSACTION_COLUMNS}
                            rows={txnRows}
                            total={transactions.length}
                            page={txnPage}
                            pageSize={txnPageSize}
                            onPagination={txnList.onPaginationModelChange}
                            emptyLabel="No transactions found"
                            getRowHeight={() => 'auto'}
                        />
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
