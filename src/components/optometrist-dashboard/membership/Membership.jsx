import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { useGetOptometristUserProfileQuery, usePayOptometristPlanMutation } from '../../../redux/features/optometristAPIEndPoint'
import { openPaymentLink, paymentLink, paymentRequired, planRenewDue } from '../../../commondata/optometristPayment'
import RenewPlanModal from './RenewPlanModal'

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

function asText(value) {
  return value === undefined || value === null ? '' : String(value).trim()
}

function displayDate(value) {
  const text = asText(value)
  if (!text || !/^\d{4}-\d{2}-\d{2}/.test(text)) return text
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return text
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function featureList(value) {
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean)
  return asText(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatMoney(amount) {
  if (amount === undefined || amount === null || amount === '') return ''
  const value = Number(amount)
  if (Number.isNaN(value)) return asText(amount)
  if (value === 0) return 'Free'
  return String(value)
}

function periodKey(value) {
  const raw = asText(value).toUpperCase()
  if (raw === 'MONTHLY' || raw === 'MONTH') return 'MONTHLY'
  if (raw === 'YEARLY' || raw === 'YEAR' || raw === 'ANNUAL') return 'YEARLY'
  return raw
}

function hasRate(value) {
  return value !== undefined && value !== null && value !== ''
}

function titleWord(value) {
  const text = asText(value)
  if (!text) return ''
  return text.replace(/[_-]+/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function paidAmount(value) {
  if (value === undefined || value === null || value === '') return ''
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString('en-US') : asText(value)
}

export default function Membership() {
  const { data: profileResponse, isLoading } = useGetOptometristUserProfileQuery()
  const [payPlan, { isLoading: isPaying }] = usePayOptometristPlanMutation()
  const user = profileResponse?.data?.userData || profileResponse?.data || {}
  const needsPayment = paymentRequired(profileResponse)
  const renewDue = !needsPayment && planRenewDue(user)
  const [renewOpen, setRenewOpen] = useState(false)

  const startPayment = async () => {
    const returnUrl = `${window.location.origin}${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/optometrist-dashboard/overview`
    const result = await payPlan({ return_url: returnUrl })
    if (result?.error) {
      toast.error(typeof result.error === 'string' ? result.error : 'Could not start payment')
      return
    }
    const link = paymentLink(result?.data)
    if (!link) {
      toast.error(result?.data?.message || 'Could not start payment')
      return
    }
    openPaymentLink(link)
  }
  const plan = user.plan && typeof user.plan === 'object' ? user.plan : {}
  const membership = user.membership || {}
  const override = user.updated_commission_percentage || {}
  const useOverride = Boolean(override.is_updated)

  const name = asText(plan.name || membership.plan_name)
  const planName = asText(membership.plan_name || user.plan_name || plan.name)
  const paymentAmountLabel = paidAmount(user.payment_amount ?? membership.payment_amount)
  const paymentMethodLabel = titleWord(user.payment_method || membership.payment_method)
  const billing = periodKey(user.plan_type || membership.plan_type)
  const started = displayDate(
    user.plan_start_date
    || user.plan_started_at
    || membership.plan_start_date
    || membership.plan_started_at
    || plan.plan_start_date
    || plan.plan_started_at
  )
  const expires = asText(user.plan_expiry_date || membership.plan_expiry_date || plan.plan_expiry_date)
  const description = asText(plan.description)
  const features = featureList(plan.features)
  const monthly = formatMoney(plan.monthly_price)
  const yearly = formatMoney(plan.yearly_price)
  const platformFee = useOverride
    ? override.platform_fee_percentage
    : (membership.platform_fee_percentage ?? plan.platform_fee_percentage)
  const giveRate = useOverride
    ? override.customer_commission_percentage
    : (membership.give_rate ?? plan.customer_commission_percentage)
  const takeRate = useOverride
    ? override.optometrist_commission_percentage
    : (membership.take_rate ?? plan.optometrist_commission_percentage)

  const currentPrice = [
    { key: 'MONTHLY', label: 'Monthly', value: monthly, unit: '/ month', hint: 'Billed every month' },
    { key: 'YEARLY', label: 'Yearly', value: yearly, unit: '/ year', hint: 'Billed once a year' },
  ].find((item) => item.key === billing && item.value)
  const rates = [
    { label: 'Platform fee', value: platformFee, note: 'Taken on referred orders' },
    { label: 'Give', value: giveRate, note: 'Customer commission' },
    { label: 'Take', value: takeRate, note: 'Your commission' },
  ].filter((item) => hasRate(item.value))

  return (
    <>
      <style>{`
        .op-rates .op-rate + .op-rate { border-top: 1px solid #eef2f7; }
        @media (min-width: 768px) {
          .op-rates .op-rate + .op-rate { border-top: 0; border-left: 1px solid #eef2f7; }
        }
      `}</style>
      {isLoading && <Loader />}

      <Row>
        <Col>
          <PageHeader
            titles="Manage your membership"
            active="Membership"
            items={['Overview']}
            links={['/optometrist-dashboard/overview']}
          />
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div className="d-flex align-items-start gap-3">
              <span
                className="d-flex align-items-center justify-content-center fw-semibold"
                style={{ width: 52, height: 52, borderRadius: 12, background: '#eff6ff', color: '#3b82f6', fontSize: 18 }}
              >
                {(name || 'P').slice(0, 1).toUpperCase()}
              </span>
              <div>
                <h4 className="fw-semibold mb-1" style={{ fontSize: '1.25rem' }}>
                  {name || 'No plan assigned'}
                </h4>
                <p className="text-muted mb-0">
                  {description || 'Your subscription for the professional profile and enquiry booking dashboard.'}
                </p>
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              {billing && (
                <span
                  className="d-inline-flex align-items-center"
                  style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, overflow: 'hidden' }}
                >
                  <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13 }}>Billing</span>
                  <span className="px-3 py-2" style={{ fontSize: 12, color: '#64748b', borderLeft: '1px solid #e8edf3', background: '#fff' }}>
                    {billing === 'YEARLY' ? 'Yearly' : 'Monthly'}
                  </span>
                </span>
              )}
              {started && (
                <span
                  className="d-inline-flex align-items-center"
                  style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, overflow: 'hidden' }}
                >
                  <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13 }}>Started</span>
                  <span className="px-3 py-2" style={{ fontSize: 12, color: '#64748b', borderLeft: '1px solid #e8edf3', background: '#fff' }}>
                    {started}
                  </span>
                </span>
              )}
              {expires && (
                <span
                  className="d-inline-flex align-items-center"
                  style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, overflow: 'hidden' }}
                >
                  <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13 }}>Valid until</span>
                  <span className="px-3 py-2" style={{ fontSize: 12, color: '#64748b', borderLeft: '1px solid #e8edf3', background: '#fff' }}>
                    {expires}
                  </span>
                </span>
              )}
              {useOverride && (
                <span className="px-3 py-2 fw-semibold" style={{ fontSize: 13, background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: 10 }}>
                  Admin rates
                </span>
              )}
              {name && (
                <span
                  className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                  style={{ fontSize: 13, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 10 }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#15803d' }} />
                  Active
                </span>
              )}
              {(needsPayment || renewDue) && (
                <button
                  type="button"
                  onClick={() => (needsPayment ? startPayment() : setRenewOpen(true))}
                  disabled={isPaying}
                  className="btn btn-primary flex-shrink-0"
                  style={{ height: 38, padding: '0 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, lineHeight: '38px', whiteSpace: 'nowrap' }}
                >
                  {isPaying ? 'Starting...' : needsPayment ? 'Pay now' : 'Renew'}
                </button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <RenewPlanModal show={renewOpen} profile={profileResponse} onClose={() => setRenewOpen(false)} />

      {name ? (
        <>
          <Card className="mb-4" style={{ ...cardStyle, overflow: 'hidden' }}>
            <Card.Body className="p-0">
              {currentPrice && (
                <div
                  className="d-flex align-items-center justify-content-between gap-3"
                  style={{ padding: '18px 20px', background: '#f8fbff', borderBottom: '1px solid #e7eef8' }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1d4ed8' }}>
                      {currentPrice.label}
                    </div>
                    <div className="d-flex align-items-baseline gap-2" style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: '#1e3a8a' }}>{paymentAmountLabel || currentPrice.value}</span>
                      <span style={{ fontSize: 14, color: '#64748b' }}>{currentPrice.unit}</span>
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>{currentPrice.hint}</div>
                  </div>
                  <span className="d-inline-flex align-items-center gap-1 px-2 py-1 fw-semibold text-nowrap" style={{ fontSize: 12, color: '#1d4ed8', background: '#dbeafe', borderRadius: 999 }}>
                    <FaCheck size={9} />
                    Current
                  </span>
                </div>
              )}

              <Row className="g-0 op-rates">
                {[
                  { label: 'Plan name', value: planName },
                  { label: 'Payment method', value: paymentMethodLabel },
                ].filter((item) => item.value).map((item) => (
                  <Col key={item.label} xs={12} md={6} className="op-rate">
                    <div style={{ padding: '16px 20px', height: '100%' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b' }}>{item.label}</div>
                      <div className="fw-semibold" style={{ marginTop: 4, fontSize: 18, letterSpacing: '-0.02em', color: '#0f172a' }}>{item.value}</div>
                    </div>
                  </Col>
                ))}
              </Row>

              {rates.length > 0 && (
                <Row className="g-0 op-rates" style={{ borderTop: '1px solid #eef2f7' }}>
                  {rates.map((item) => (
                    <Col key={item.label} xs={12} md={4} className="op-rate">
                      <div style={{ padding: '16px 20px', height: '100%' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b' }}>{item.label}</div>
                        <div className="fw-semibold" style={{ marginTop: 4, fontSize: 22, letterSpacing: '-0.03em', color: '#0f172a' }}>{item.value}%</div>
                        <div style={{ marginTop: 2, fontSize: 13, color: '#64748b' }}>{item.note}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}

              <div style={{ padding: '16px 20px', borderTop: '1px solid #eef2f7' }}>
                <div className="fw-semibold" style={{ fontSize: 13, marginBottom: 10 }}>What&apos;s included</div>
                {features.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span key={feature} className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{ fontSize: 13, color: '#0f172a', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 999 }}>
                        <FaCheck size={9} color="#15803d" />
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted small">No features listed on this plan.</span>
                )}
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Card className="mb-4" style={cardStyle}>
          <Card.Body className="p-4">
            <p className="text-muted small mb-0">No membership plan is assigned yet.</p>
          </Card.Body>
        </Card>
      )}
    </>
  )
}
