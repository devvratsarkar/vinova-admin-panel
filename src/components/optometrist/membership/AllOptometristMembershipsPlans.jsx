import { allow } from "../../../commondata/permissions";
import React, { useState } from 'react'
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { TrashButton } from '../../common/ListFilters'
import { useDispatch } from 'react-redux'
import { openModal } from '../../../redux/slices/allModalSlice'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import Error from '../../../layouts/layoutcomponents/Error'
import { useGetAllMembershipPlansQuery } from '../../../redux/features/membershipPlanAPIEndPoint'

const planFeatures = (features) => (
    Array.isArray(features) ? features : String(features || '').split(/\n|,/)
).map((feature) => feature.trim()).filter(Boolean)

const statStyle = {
    flex: '1 1 0',
    minWidth: 88,
    padding: '10px 12px',
    background: '#f8fafc',
    border: '1px solid #e8edf3',
    borderRadius: 10,
}

export default function AllOptometristMembershipsPlans() {
    const dispatch = useDispatch()
    const [viewingTrash, setViewingTrash] = useState(false)
    const { data, isError, error, isLoading, isFetching } = useGetAllMembershipPlansQuery(viewingTrash ? { trash: true } : undefined)
    const plans = data?.data || []

    if (isLoading || isFetching) return <Loader />
    if (isError) return <Error error_mes={error} />

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Membership Plans" active="Membership Plans List" items={['Home']} links={['/dashboard']} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                    <Button variant="success" className="text-white" onClick={() => dispatch(openModal({ componentName: 'AddMembershipPlan' }))}>
                        <i className="fe fe-plus me-1"></i> Add Plan
                    </Button>
                    <TrashButton show={allow("OptometristMembership", "view-trash")} viewing={viewingTrash} onToggle={() => setViewingTrash((value) => !value)} label="Trash" backLabel="All plans" />
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <Row>
                        {plans.length === 0 && <Col><p className="text-muted mb-0">No membership plans found.</p></Col>}
                        {plans.map((plan) => {
                            const features = planFeatures(plan.features)
                            const free = Boolean(plan.is_free)
                            return (
                                <Col key={plan._id || plan.id} md={6} className="mb-4">
                                    <Card className="h-100" style={{ borderRadius: 12, border: '1px solid #e8edf3' }}>
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                                <div>
                                                    <h5 className="mb-2 fw-semibold">{plan.name}</h5>
                                                    <span className="badge" style={{ background: free ? '#e2e8f0' : '#dcfce7', color: free ? '#475569' : '#15803d' }}>{free ? 'Free' : 'Paid'}</span>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    {viewingTrash ? (
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                                            <Button variant="warning" size="sm" className="btn-icon" onClick={() => dispatch(openModal({ componentName: 'RestoreMembershipPlan', data: plan }))}>
                                                                <i className="fe fe-refresh-ccw text-white"></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    ) : allow("OptometristMembership", "edit") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                        <Button variant="primary" size="sm" className="btn-icon" onClick={() => dispatch(openModal({ componentName: 'EditMembershipPlan', data: plan }))}>
                                                            <i className="fe fe-edit"></i>
                                                        </Button>
                                                    </OverlayTrigger>
)}
                                                    {!viewingTrash && allow("OptometristMembership", "delete") && (
<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                                        <Button variant="danger" size="sm" className="btn-icon" onClick={() => dispatch(openModal({ componentName: 'DeleteMembershipPlan', data: plan }))}>
                                                            <i className="fe fe-trash"></i>
                                                        </Button>
                                                    </OverlayTrigger>
)}
                                                </div>
                                            </div>
                                            {plan.description && <p className="text-muted mb-3">{plan.description}</p>}
                                            <div className="d-flex gap-2 mb-3">
                                                <div style={statStyle}>
                                                    <div className="text-muted" style={{ fontSize: 12 }}>Monthly</div>
                                                    <div className="fw-semibold">{free ? 'Free' : `$${plan.monthly_price}`}</div>
                                                </div>
                                                <div style={statStyle}>
                                                    <div className="text-muted" style={{ fontSize: 12 }}>Yearly</div>
                                                    <div className="fw-semibold">{free ? 'Free' : `$${plan.yearly_price}`}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 flex-wrap mb-3">
                                                {[
                                                    ['Platform fee', plan.platform_fee_percentage],
                                                    ['Give', plan.customer_commission_percentage],
                                                    ['Take', plan.optometrist_commission_percentage],
                                                ].map(([label, value]) => (
                                                    <span key={label} className="px-2 py-1" style={{ fontSize: 12, fontWeight: 600, color: '#475569', background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 999 }}>
                                                        {label} {value}%
                                                    </span>
                                                ))}
                                            </div>
                                            {features.length > 0 && (
                                                <ul className="mb-0 ps-0" style={{ listStyle: 'none' }}>
                                                    {features.map((feature) => (
                                                        <li key={feature} className="d-flex align-items-start gap-2 mb-1">
                                                            <i className="fe fe-check mt-1" style={{ color: '#15803d' }}></i>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}
