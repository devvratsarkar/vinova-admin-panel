import React, { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openModal } from '../../../redux/slices/allModalSlice'
import Loader from '../../../layouts/layoutcomponents/loader'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import toast from 'react-hot-toast'
import Error from '../../../layouts/layoutcomponents/Error'
import {
    useApproveOptometristMutation,
    useDeleteOptometristMutation,
    useGetOptometristsQuery,
    useRejectOptometristMutation,
    useRestoreOptometristMutation,
    useUpdateOptometristMutation,
    useUpdateOptometristCommissionMutation,
} from '../../../redux/features/optometristEnquiryAPIEndPoint'
import { ListFilters, ListTable, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from '../../common/ListFilters'

const FILTER_KEYS = ['status', 'trash']
const STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
]
const STATUS_LABELS = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }
const PERCENT_FIELDS = {
    platform_fee_percentage: 'Platform fee',
    customer_commission_percentage: 'Give',
    optometrist_commission_percentage: 'Take',
}

const percentNumber = (value) => {
    const text = String(value ?? '').trim()
    if (!/^\d{1,3}$/.test(text)) return null
    const number = Number(text)
    return number <= 100 ? number : null
}

const getPercent = (row, field) => {
    if (row?.updated_commission_percentage?.is_updated) {
        return row.updated_commission_percentage[field]
    }
    return row?.plan?.[field]
}

const labelOf = (value) => {
    const text = String(value || '').trim().toLowerCase()
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function readOptometrists(response) {
    const payload = response?.data
    const rows = Array.isArray(payload?.data) ? payload.data : []
    const total = Number(payload?.pagination?.total ?? payload?.total)
    return { rows, total: Number.isFinite(total) ? total : rows.length }
}

export default function AllOptometristEnquiries() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const list = useListFilters(FILTER_KEYS)
    const [rejectItem, setRejectItem] = useState(null)
    const [deleteItem, setDeleteItem] = useState(null)
    const [reason, setReason] = useState('')
    const [drafts, setDrafts] = useState({})
    const viewingTrash = list.filters.trash === true

    const { data, isError, error, isLoading, isFetching } = useGetOptometristsQuery(list.query, { skip: list.skip })
    const [approveOptometrist, { isLoading: approving }] = useApproveOptometristMutation()
    const [rejectOptometrist, { isLoading: rejecting }] = useRejectOptometristMutation()
    const [deleteOptometrist, { isLoading: deleting }] = useDeleteOptometristMutation()
    const [restoreOptometrist, { isLoading: restoring }] = useRestoreOptometristMutation()
    const [updateOptometrist, { isLoading: updating }] = useUpdateOptometristMutation()
    const [updateCommission, { isLoading: saving }] = useUpdateOptometristCommissionMutation()

    const { rows, total } = readOptometrists(data)

    const draftValue = (row, field) => {
        const edited = drafts[row?._id]
        if (edited && Object.prototype.hasOwnProperty.call(edited, field)) return edited[field]
        const value = getPercent(row, field)
        return value ?? ''
    }

    const setDraft = (row, field, value) => {
        setDrafts((prev) => ({
            ...prev,
            [row._id]: { ...prev[row._id], [field]: value },
        }))
    }

    const handleApprove = async (id) => {
        const res = await approveOptometrist(id)
        if (res?.data?.http_status_code === 200) {
            toast.success(res.data.message)
        }
    }

    const handleReject = async () => {
        if (!reason.trim()) {
            toast.error('Reason is required')
            return
        }
        const res = await rejectOptometrist({ id: rejectItem?._id, reason: reason.trim() })
        if (res?.data?.http_status_code === 200) {
            toast.success(res.data.message)
            setRejectItem(null)
            setReason('')
        }
    }

    const handleDelete = async () => {
        const action = viewingTrash ? restoreOptometrist : deleteOptometrist
        const res = await action(deleteItem?._id)
        if (res?.data?.http_status_code === 200) {
            toast.success(res.data.message)
            setDeleteItem(null)
        } else {
            toast.error(res?.data?.message || res?.error?.data?.message || `Failed to ${viewingTrash ? 'restore' : 'delete'}`)
        }
    }

    const handleStatusChange = async (row) => {
        const res = await updateOptometrist({ id: row._id, formData: { status: !row.status } })
        if (res?.data?.http_status_code === 200) {
            toast.success(res.data.message)
        }
    }

    const commitPercent = async (row, field, raw) => {
        const number = percentNumber(raw)
        if (number == null || number === Number(getPercent(row, field))) return
        const updated_commission_percentage = {
            platform_fee_percentage: Number(getPercent(row, 'platform_fee_percentage') || 0),
            customer_commission_percentage: Number(getPercent(row, 'customer_commission_percentage') || 0),
            optometrist_commission_percentage: Number(getPercent(row, 'optometrist_commission_percentage') || 0),
        }
        updated_commission_percentage[field] = number
        const res = await updateCommission({ id: row._id, updated_commission_percentage })
        if (res?.data?.http_status_code === 200) toast.success(res.data.message)
        else toast.error(res?.data?.message || res?.error?.data?.message || 'Failed to update')
    }

    const onPercentChange = (row, field, raw) => {
        if (raw !== '' && percentNumber(raw) == null) {
            toast.error(`${PERCENT_FIELDS[field]} must be a whole number from 0 to 100`)
            return
        }
        setDraft(row, field, raw)
    }

    const percentInput = (row, field) => {
        const value = draftValue(row, field)
        if (row?.plan?.is_free) return value === '' ? '—' : value
        return (
            <Form.Control
                type="text"
                inputMode="numeric"
                className="form-control-sm"
                value={value}
                disabled={saving}
                onMouseDown={(event) => event.stopPropagation()}
                onChange={(event) => onPercentChange(row, field, event.target.value)}
                onBlur={(event) => commitPercent(row, field, event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        event.currentTarget.blur()
                    }
                }}
            />
        )
    }

    const columns = useMemo(() => [
        indexColumn(list.currentPage, list.pageSize),
        {
            id: 'optometrist',
            label: 'Optometrist',
            minWidth: 180,
            flex: 0.9,
            render: (row) => (
                <div className="py-2">
                    <div className="fw-semibold">{row?.name || '—'}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>Store: {row?.store_name || '—'}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{row?.phone_number || '—'}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{row?.email || '—'}</div>
                </div>
            ),
        },
        {
            id: 'plan',
            label: 'Plan',
            minWidth: 140,
            flex: 0.7,
            render: (row) => {
                const typeLabel = labelOf(row?.plan_type)
                return (
                    <div className="d-flex flex-column align-items-start gap-1 py-2">
                        <span className="fw-semibold">{row?.plan?.name || '—'}</span>
                        {typeLabel && (
                            <span className="px-2 py-1 fw-semibold" style={{ fontSize: 11, lineHeight: 1.2, background: '#f8fafc', color: '#475569', border: '1px solid #e8edf3', borderRadius: 999 }}>
                                {typeLabel}
                            </span>
                        )}
                    </div>
                )
            },
        },
        {
            id: 'payment',
            label: 'Payment',
            minWidth: 140,
            flex: 0.7,
            render: (row) => {
                const amount = row?.payment_amount
                const hasAmount = amount === 0 || amount
                const amountNumber = hasAmount ? Number(amount) : NaN
                const amountLabel = Number.isFinite(amountNumber) ? amountNumber.toLocaleString('en-US') : '—'
                const isFree = Number.isFinite(amountNumber) && amountNumber === 0
                const methodLabel = isFree ? '' : labelOf(row?.payment_method)
                const status = String(row?.payment_status || '').trim().toLowerCase()
                const statusLabel = labelOf(status)
                const variant = status === 'completed' || status === 'paid' ? 'success' : status === 'failed' ? 'danger' : 'warning'
                return (
                    <div className="d-flex flex-column align-items-start gap-1 py-2">
                        <span className="fw-semibold">{amountLabel}</span>
                        {methodLabel && <span className="text-muted" style={{ fontSize: 12 }}>{methodLabel}</span>}
                        {statusLabel && <span className={`badge bg-${variant}`}>{statusLabel}</span>}
                    </div>
                )
            },
        },
        { id: 'platform', label: 'Platform fee %', width: 88, sortable: false, filterable: false, render: (row) => percentInput(row, 'platform_fee_percentage') },
        { id: 'give', label: 'Give %', width: 72, sortable: false, filterable: false, render: (row) => percentInput(row, 'customer_commission_percentage') },
        { id: 'take', label: 'Take %', width: 72, sortable: false, filterable: false, render: (row) => percentInput(row, 'optometrist_commission_percentage') },
        {
            id: 'review',
            label: 'Status',
            width: 156,
            sortable: false,
            filterable: false,
            render: (row) => {
                const value = row?.optometrist_status || 'pending'
                const variant = value === 'approved' ? 'success' : value === 'rejected' ? 'danger' : 'warning'
                const active = Boolean(row?.status)
                return (
                    <div className="d-inline-flex flex-column align-items-start gap-2 py-2">
                        <span className={`badge bg-${variant} mb-0`}>{STATUS_LABELS[value] || value}</span>
                        <span
                            className="d-inline-flex align-items-center gap-2"
                            style={{
                                padding: '3px 8px 3px 10px',
                                background: active ? '#f0fdf4' : '#f8fafc',
                                border: `1px solid ${active ? '#bbf7d0' : '#e8edf3'}`,
                                borderRadius: 999,
                            }}
                        >
                            <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1, color: active ? '#15803d' : '#64748b' }}>
                                {active ? 'Active' : 'Inactive'}
                            </span>
                            <StatusSwitch checked={active} disabled={updating} onChange={() => handleStatusChange(row)} />
                        </span>
                    </div>
                )
            },
        },
        {
            id: 'date',
            label: 'Created',
            minWidth: 210,
            flex: 0.8,
            render: (row) => (
                <div className="d-flex flex-column align-items-start gap-1 py-2">
                    <span className="fw-semibold">{formatDate(row?.createdAt) || '—'}</span>
                    <span className="text-muted" style={{ fontSize: 12 }}>Updated {formatDate(row?.updatedAt) || '—'}</span>
                </div>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            width: viewingTrash ? 72 : 152,
            sortable: false,
            filterable: false,
            render: (row) => {
                const isPending = row?.optometrist_status === 'pending'
                return (
                    <div className="action_icon_wrapper" style={{ justifyContent: 'center', flexWrap: 'wrap', rowGap: 6, width: '100%', padding: '10px 0' }}>
                        {!viewingTrash && (
                            <>
                                <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                                    <Button size="sm" variant="primary" className="btn-icon" onClick={() => navigate(`/optometrist/enquiry/${row._id}`)}>
                                        <i className="fe fe-eye"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Button size="sm" variant="secondary" className="btn-icon" onClick={() => dispatch(openModal({ componentName: 'EditOptometristEnquiry', data: row }))}>
                                        <i className="fe fe-edit"></i>
                                    </Button>
                                </OverlayTrigger>
                            </>
                        )}
                        <OverlayTrigger placement="top" overlay={<Tooltip>{viewingTrash ? 'Restore' : 'Delete'}</Tooltip>}>
                            <Button
                                type="button"
                                size="sm"
                                variant={viewingTrash ? 'primary' : 'danger'}
                                className="btn-icon"
                                disabled={deleting || restoring}
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setDeleteItem(row)
                                }}
                            >
                                <i className={`fe ${viewingTrash ? 'fe-refresh-ccw' : 'fe-trash'}`}></i>
                            </Button>
                        </OverlayTrigger>
                        {!viewingTrash && isPending && (
                            <>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Approve</Tooltip>}>
                                    <Button size="sm" variant="success" className="btn-icon" disabled={approving} onClick={() => handleApprove(row?._id)}>
                                        <i className="fe fe-check"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Reject</Tooltip>}>
                                    <Button size="sm" variant="danger" className="btn-icon" disabled={rejecting} onClick={() => { setRejectItem(row); setReason('') }}>
                                        <i className="fe fe-x"></i>
                                    </Button>
                                </OverlayTrigger>
                            </>
                        )}
                    </div>
                )
            },
        },
    ], [list.currentPage, list.pageSize, drafts, dispatch, navigate, approving, rejecting, deleting, restoring, saving, updating, viewingTrash])

    return (
        <>
            {(isLoading || isFetching || approving || rejecting || deleting || restoring || saving || updating) && <Loader />}
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Optometrist Enquiry" active={viewingTrash ? 'Trash' : 'Optometrist Enquiry List'} items={['Home']} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                    <Button variant="success" className="text-white" onClick={() => dispatch(openModal({ componentName: 'RegisterOptometrist' }))}>
                        <i className="fe fe-user-plus me-1"></i> Register Optometrist
                    </Button>
                    <Button variant="danger" className="text-white" onClick={() => list.setFilter('trash', viewingTrash ? '' : true)}>
                        <i className={`fe ${viewingTrash ? 'fe-list' : 'fe-trash'} me-1`}></i> {viewingTrash ? 'All enquiries' : 'Trash'}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Body className="data_table">
                        {isError && <Error error_mes={error} />}
                        <div className="e-table pb-5">
                                <ListFilters
                                    {...boundFilters(list, {
                                        placeholder: 'Store, name, or email',
                                        selects: [
                                            { label: 'Status', value: list.filters.status, onChange: (value) => list.setFilter('status', value), empty: 'All statuses', options: STATUSES },
                                        ],
                                    })}
                                />
                                <ListTable
                                    columns={columns}
                                    rows={rows}
                                    total={total}
                                    page={list.currentPage}
                                    pageSize={list.pageSize}
                                    onPagination={list.onPaginationModelChange}
                                    emptyLabel="No optometrist enquiries found"
                                    getRowHeight={() => 'auto'}
                                />
                            </div>
                    </Card.Body>
                </Card>
            </Row>
            <Modal show={Boolean(deleteItem)} onHide={() => setDeleteItem(null)}>
                <Modal.Header className="modal_header border-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">{viewingTrash ? 'Restore Optometrist' : 'Delete Optometrist'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">Are you sure you want to {viewingTrash ? 'restore' : 'delete'} {deleteItem?.name || 'this optometrist'}?</Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => setDeleteItem(null)}>Cancel</Button>
                    <Button variant={viewingTrash ? 'primary' : 'danger'} disabled={deleting || restoring} onClick={handleDelete}>{viewingTrash ? 'Restore' : 'Delete'}</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={Boolean(rejectItem)} onHide={() => { setRejectItem(null); setReason('') }}>
                <Modal.Header className="modal_header border-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Reject Optometrist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Reason <span className="required_icon">*</span></Form.Label>
                        <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Documents incomplete" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => { setRejectItem(null); setReason('') }}>Cancel</Button>
                    <Button variant="danger" onClick={handleReject}>Reject</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
