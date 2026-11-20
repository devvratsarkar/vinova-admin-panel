import React from 'react'
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { openModal } from '../../../redux/slices/allModalSlice'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import Error from '../../../layouts/layoutcomponents/Error'
import { useGetTrashedMembershipPlansQuery } from '../../../redux/features/membershipPlanAPIEndPoint'

export default function TrashedMembershipPlans() {
    const dispatch = useDispatch()
    const { data, isError, error, isLoading, isFetching } = useGetTrashedMembershipPlansQuery()
    const plans = data?.data || []

    if (isLoading || isFetching) return <Loader />
    if (isError) return <Error error_mes={error} />

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Membership Plans" active="Trash" items={['Home', 'Membership Plans List']} links={['/dashboard', '/optometrist/memberships-plans']} />
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <Row>
                        {plans.length === 0 && <Col><p className="text-muted mb-0">No trashed membership plans found.</p></Col>}
                        {plans.map((plan) => (
                            <Col key={plan._id || plan.id} md={6} className="mb-4">
                                <Card className="h-100 shadow-sm">
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="mb-0 fw-semibold">{plan.name}</h5>
                                                <span className="small text-muted">{plan.is_free ? 'Free' : 'Paid'}</span>
                                            </div>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                                <Button variant="warning" size="sm" className="btn-icon" onClick={() => dispatch(openModal({ componentName: 'RestoreMembershipPlan', data: plan }))}>
                                                    <i className="fe fe-refresh-ccw text-white"></i>
                                                </Button>
                                            </OverlayTrigger>
                                        </div>
                                        {plan.description && <p className="mb-1">{plan.description}</p>}
                                        <p className="mb-1">Price: {plan.is_free ? 'Free' : `Monthly: $${plan.monthly_price} | Yearly: $${plan.yearly_price}`}</p>
                                        <p className="mb-1">Platform fee: {plan.platform_fee_percentage}%</p>
                                        <p className="mb-1">Give (customer): {plan.customer_commission_percentage}%</p>
                                        <p className="mb-1">Take (optometrist): {plan.optometrist_commission_percentage}%</p>
                                        {plan.features && (
                                            <ul className="mb-0">
                                                {(Array.isArray(plan.features) ? plan.features : String(plan.features).split(/\n|,/))
                                                    .map((feature) => feature.trim())
                                                    .filter(Boolean)
                                                    .map((feature, idx) => (
                                                        <li key={idx} className="mb-1">• {feature}</li>
                                                    ))}
                                            </ul>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}
