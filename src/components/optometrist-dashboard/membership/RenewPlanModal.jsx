import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useRenewOptometristPlanMutation } from '../../../redux/features/optometristAPIEndPoint'
import { openPaymentLink, paymentLink } from '../../../commondata/optometristPayment'

function accountFrom(source) {
  return source?.data?.userData || source?.data || source || {}
}

function periodKey(value) {
  const raw = String(value || '').trim().toUpperCase()
  if (raw === 'MONTHLY' || raw === 'MONTH') return 'MONTHLY'
  if (raw === 'YEARLY' || raw === 'YEAR' || raw === 'ANNUAL') return 'YEARLY'
  return raw === 'MONTHLY' || raw === 'YEARLY' ? raw : ''
}

function priceNumber(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : null
}

function money(value) {
  return Number(value).toLocaleString('en-US')
}

function walletBalance(user, source) {
  const wallet = user?.wallet && typeof user.wallet === 'object' ? user.wallet : source?.data?.wallet
  const amount = wallet?.balance ?? user?.wallet_balance ?? source?.data?.wallet_balance
  const number = Number(amount)
  return Number.isFinite(number) ? number : 0
}

export default function RenewPlanModal({ show, profile, onClose }) {
  const user = accountFrom(profile)
  const plan = user.plan && typeof user.plan === 'object' ? user.plan : {}
  const currency = plan.currency_code || user.currency_code || ''
  const current = periodKey(user.plan_type || user.membership?.plan_type) || 'MONTHLY'
  const options = [
    { key: 'MONTHLY', label: 'Monthly', amount: priceNumber(plan.monthly_price_riyal ?? plan.monthly_price) },
    { key: 'YEARLY', label: 'Yearly', amount: priceNumber(plan.yearly_price_riyal ?? plan.yearly_price) },
  ].filter((item) => item.amount != null)
  const balance = walletBalance(user, profile)
  const [planType, setPlanType] = useState(current)
  const [method, setMethod] = useState('wallet')
  const [renewPlan, { isLoading }] = useRenewOptometristPlanMutation()

  useEffect(() => {
    if (!show) return
    setPlanType(options.some((item) => item.key === current) ? current : (options[0]?.key || 'MONTHLY'))
    setMethod('wallet')
  }, [show, current])

  const selected = options.find((item) => item.key === planType) || options[0]
  const amount = selected?.amount
  const walletShort = method === 'wallet' && amount != null && balance < amount

  const submit = async () => {
    if (amount == null || walletShort) return
    const body = {
      plan_type: selected.key,
      amount,
      payment_method: method,
    }
    if (method === 'zibal') {
      body.return_url = `${window.location.origin}${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/optometrist-dashboard/overview`
    }
    const result = await renewPlan(body)
    if (result?.error) return
    if (method === 'zibal') {
      const link = paymentLink(result?.data)
      if (!link) {
        toast.error(result?.data?.message || 'Could not start payment')
        return
      }
      openPaymentLink(link)
      return
    }
    toast.success(result?.data?.message || 'Plan renewed from your wallet')
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: '1.05rem' }}>Renew plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Billing</div>
        <div className="d-flex flex-column gap-2 mb-3">
          {options.map((item) => {
            const active = item.key === selected?.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setPlanType(item.key)}
                className="d-flex justify-content-between align-items-center text-start"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: active ? '1px solid #bfdbfe' : '1px solid #e8edf3',
                  background: active ? '#f8fbff' : '#fff',
                  color: '#0f172a',
                }}
              >
                <span className="fw-semibold">{item.label}</span>
                <span className="fw-semibold">{[money(item.amount), currency].filter(Boolean).join(' ')}</span>
              </button>
            )
          })}
        </div>
        <div className="text-muted mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Pay with</div>
        <div className="d-flex gap-2">
          {[
            { key: 'wallet', label: 'Wallet' },
            { key: 'zibal', label: 'Online' },
          ].map((item) => {
            const active = method === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setMethod(item.key)}
                className="flex-fill"
                style={{
                  height: 38,
                  borderRadius: 10,
                  border: active ? '1px solid #293896' : '1px solid #e8edf3',
                  background: active ? '#293896' : '#fff',
                  color: active ? '#fff' : '#334155',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <p className="mb-0 mt-2" style={{ fontSize: 13, color: walletShort ? '#b91c1c' : '#64748b' }}>
          {walletShort
            ? `Wallet balance ${money(balance)} is not enough for this plan.`
            : `Wallet balance ${money(balance)}`}
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <button type="button" onClick={onClose} style={{ height: 38, padding: '0 14px', borderRadius: 8, border: '1px solid #e8edf3', background: '#fff', fontWeight: 600 }}>
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isLoading || amount == null || walletShort}
          style={{ height: 38, padding: '0 14px', border: 0, borderRadius: 8, background: '#293896', color: '#fff', fontWeight: 600, opacity: isLoading || amount == null || walletShort ? 0.6 : 1 }}
        >
          {isLoading ? 'Renewing...' : 'Renew'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
