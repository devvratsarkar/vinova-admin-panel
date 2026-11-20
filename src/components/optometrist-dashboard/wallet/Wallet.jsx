import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { FaCalendarAlt, FaPen, FaPlus, FaShareAlt, FaTrash, FaUniversity, FaWallet } from 'react-icons/fa'
import moment from 'moment'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import {
  useCreateOptometristWithdrawalRequestMutation,
  useDeleteOptometristBankMutation,
  useGetOptometristBanksQuery,
  useGetOptometristTransactionsQuery,
  useGetOptometristUserProfileQuery,
  useGetOptometristWithdrawalRequestsQuery,
  useAddOptometristBankMutation,
  useUpdateOptometristBankMutation,
} from '../../../redux/features/optometristAPIEndPoint'
import { OPTOMETRIST_API_BASE_URL } from '../../../utils/config'
import BankFormModal, { bankPayload } from './BankFormModal'
import './Wallet.css'

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, backgroundColor: '#fff' }
const PAGE_SIZES = [10, 20, 50]
const WITHDRAWAL_STATUSES = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Cancelled', label: 'Cancelled' },
]
const TRANSACTION_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'referral', label: 'Referral credits' },
  { value: 'withdrawal', label: 'Withdrawals' },
]
const STATUS_STYLE = {
  Pending: { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' },
  Completed: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  Rejected: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
  Cancelled: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' },
  Credit: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  Debit: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
}

function titleCase(value) {
  const raw = value == null ? '' : String(value).trim()
  if (!raw) return ''
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

function formatAmount(amount) {
  if (amount === undefined || amount === null || amount === '') return '—'
  const value = Number(amount)
  return Number.isFinite(value) ? value.toLocaleString('en-US') : String(amount)
}

function currencyCode(value) {
  const raw = String(value || '').trim()
  return /^[A-Za-z]{3}$/.test(raw) ? raw.toUpperCase() : 'IRR'
}

function recordId(item) {
  return item?.id ?? item?._id ?? ''
}

function fileHref(src) {
  const path = typeof src === 'string' ? src : src?.url || src?.path || ''
  if (!path) return ''
  if (/^(https?:|blob:|data:)/i.test(path)) return path
  const origin = String(OPTOMETRIST_API_BASE_URL || '').replace(/\/api\/[^/]+\/?$/i, '')
  return `${origin.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function isSuccess(result) {
  const body = result?.data
  return body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201
}

function readPage(response) {
  const payload = response?.data
  if (Array.isArray(payload)) return { rows: payload, total: payload.length, totalPages: 1 }
  if (!payload || typeof payload !== 'object') return { rows: [], total: 0, totalPages: 1 }
  const rows = ['data', 'banks', 'withdrawalRequests', 'withdrawals', 'requests', 'transactions', 'items', 'rows']
    .map((key) => payload[key])
    .find((value) => Array.isArray(value)) || []
  const pagination = payload.pagination && typeof payload.pagination === 'object' ? payload.pagination : payload
  const total = Number(pagination.total)
  const totalPages = Number(pagination.totalPages)
  return {
    rows,
    total: Number.isFinite(total) ? total : rows.length,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  }
}

function firstAmount(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === '') continue
    return value
  }
  return null
}

function readWallet(response) {
  const account = response?.data?.userData || response?.data || {}
  const profileWallet = response?.data?.wallet
  const wallet = account.wallet && typeof account.wallet === 'object'
    ? account.wallet
    : (profileWallet && typeof profileWallet === 'object' ? profileWallet : {})
  const status = wallet.status
  const active = status === true || status === 'true' || status === 1 || String(status).toLowerCase() === 'active'
  const inactive = status === false || status === 'false' || status === 0 || String(status).toLowerCase() === 'inactive'
  return {
    amount: wallet.balance ?? account.wallet_balance ?? response?.data?.wallet_balance,
    referral: firstAmount(wallet.referral_balance, profileWallet?.referral_balance, account.referral_balance, response?.data?.referral_balance),
    appointment: firstAmount(wallet.appointment_balance, profileWallet?.appointment_balance, account.appointment_balance, response?.data?.appointment_balance),
    currency: titleCase(wallet.currency),
    code: currencyCode(wallet.currency),
    active,
    inactive,
  }
}

function pageNumbers(page, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  return Array.from({ length: 5 }, (_, index) => start + index)
}

function when(value) {
  if (!value) return ''
  const date = moment(value)
  return date.isValid() ? date.format('D MMM YYYY, h:mm A') : String(value)
}

function PagerButton({ active, disabled, onClick, children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      style={{
        minWidth: 34,
        height: 34,
        padding: '0 10px',
        borderRadius: 8,
        border: `1px solid ${active ? '#bfdbfe' : '#e8edf3'}`,
        background: active ? '#eff6ff' : '#fff',
        color: disabled ? '#cbd5e1' : active ? '#2563eb' : '#475569',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function FilterChips({ options, value, onChange }) {
  return (
    <div className="d-inline-flex flex-wrap" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10, padding: 3, gap: 2 }}>
      {options.map((opt) => (
        <button
          key={opt.value || opt.label}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            background: value === opt.value ? '#fff' : 'transparent',
            color: value === opt.value ? '#3b82f6' : '#64748b',
            boxShadow: value === opt.value ? '0 0 0 1px #e8edf3' : 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function StatusPill({ status }) {
  if (!status) return null
  const style = STATUS_STYLE[status] || { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }
  return (
    <span className="px-2 py-1 fw-semibold" style={{ fontSize: 12, borderRadius: 999, ...style }}>{status}</span>
  )
}

function Pager({ page, totalPages, limit, total, onPage, onLimit }) {
  if (!total) return null
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid #eef2f6' }}>
      <div className="text-muted" style={{ fontSize: 13 }}>
        Showing <span className="fw-semibold" style={{ color: '#0f172a' }}>{from}–{to}</span> of {total}
      </div>
      <div className="d-flex flex-wrap align-items-center gap-3">
        <label className="d-flex align-items-center gap-2 mb-0 text-muted" style={{ fontSize: 13 }}>
          Rows
          <Form.Select
            aria-label="Rows per page"
            value={String(limit)}
            onChange={(event) => onLimit(Number(event.target.value))}
            style={{ width: 76, height: 34, borderColor: '#e8edf3', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#334155' }}
          >
            {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </Form.Select>
        </label>
        {totalPages > 1 && (
          <div className="d-inline-flex align-items-center" style={{ gap: 4 }}>
            <PagerButton label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</PagerButton>
            {pageNumbers(page, totalPages).map((number) => (
              <PagerButton key={number} active={number === page} onClick={() => onPage(number)}>{number}</PagerButton>
            ))}
            <PagerButton label="Next page" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</PagerButton>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyNote({ children }) {
  return (
    <div className="px-3 py-4 text-muted small text-center" style={{ background: '#f8fafc', border: '1px solid #e8edf3', borderRadius: 10 }}>
      {children}
    </div>
  )
}

function Bone({ width = '40%', height = 12, radius = 8, className = '' }) {
  return <span className={`wallet-bone ${className}`} style={{ width, height, borderRadius: radius }} />
}

function ListSkeleton({ rows = 3 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="d-flex justify-content-between align-items-center gap-3 py-3" style={{ borderTop: '1px solid #eef2f7' }}>
          <div className="flex-grow-1">
            <Bone width="34%" height={14} />
            <Bone width="62%" className="mt-2" />
            <Bone width="46%" className="mt-2" />
          </div>
          <Bone width="88px" height={26} radius={999} />
        </div>
      ))}
    </div>
  )
}

function DeleteBankModal({ bank, isSaving, onClose, onConfirm }) {
  return (
    <Modal show={Boolean(bank)} onHide={onClose} centered>
      <Modal.Header className="justify-content-center mx-2">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Delete bank</Modal.Title>
      </Modal.Header>
      <Button type="button" onClick={onClose} className="btn-close position-absolute end-0 p-3" variant="" aria-label="Close">
        <i className="fe fe-x fw-bolder"></i>
      </Button>
      <Modal.Body className="text-center">
        <p className="mb-1">Delete {bank?.bank_name || 'this bank account'}?</p>
        <p className="text-muted small mb-0">Withdrawal requests already sent to it stay on record.</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center border-0 pt-0">
        <Button type="button" variant="light" onClick={onClose} disabled={isSaving}>Cancel</Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={isSaving}>
          {isSaving ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default function Wallet() {
  const { data, isLoading } = useGetOptometristUserProfileQuery(undefined, { refetchOnMountOrArgChange: true })
  const { data: banksResponse, isLoading: banksLoading } = useGetOptometristBanksQuery()
  const [addBank, { isLoading: isAdding }] = useAddOptometristBankMutation()
  const [updateBank, { isLoading: isUpdating }] = useUpdateOptometristBankMutation()
  const [deleteBank, { isLoading: isDeleting }] = useDeleteOptometristBankMutation()
  const [createWithdrawal, { isLoading: isRequesting }] = useCreateOptometristWithdrawalRequestMutation()

  const [bankModal, setBankModal] = useState(null)
  const [bankToDelete, setBankToDelete] = useState(null)
  const [withdrawalStatus, setWithdrawalStatus] = useState('')
  const [withdrawalPage, setWithdrawalPage] = useState(1)
  const [withdrawalLimit, setWithdrawalLimit] = useState(10)
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [transactionPage, setTransactionPage] = useState(1)
  const [transactionLimit, setTransactionLimit] = useState(10)
  const [amount, setAmount] = useState('')
  const [bankId, setBankId] = useState('')
  const [amountError, setAmountError] = useState('')
  const [bankError, setBankError] = useState('')

  const wallet = readWallet(data)
  const banks = useMemo(() => {
    const rows = readPage(banksResponse).rows.filter((item) => item && !item.deletedAt)
    return [...rows].sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)))
  }, [banksResponse])

  const transactionQuery = transactionFilter === 'referral'
    ? { type: 'Credit', transaction_type: 'Referral' }
    : transactionFilter === 'withdrawal'
      ? { type: 'Debit', transaction_type: 'Withdrawal' }
      : {}

  const { data: withdrawalsResponse, isLoading: withdrawalsLoading, isFetching: withdrawalsFetching } = useGetOptometristWithdrawalRequestsQuery({
    page: withdrawalPage,
    limit: withdrawalLimit,
    status: withdrawalStatus,
  })
  const { data: transactionsResponse, isLoading: transactionsLoading, isFetching: transactionsFetching } = useGetOptometristTransactionsQuery({
    page: transactionPage,
    limit: transactionLimit,
    ...transactionQuery,
  })

  const withdrawals = readPage(withdrawalsResponse)
  const transactions = readPage(transactionsResponse)
  const statusLabel = wallet.active ? 'Active' : wallet.inactive ? 'Inactive' : ''
  const statusStyle = wallet.active
    ? { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
    : { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
  const withdrawalsBusy = withdrawalsLoading || withdrawalsFetching
  const transactionsBusy = transactionsLoading || transactionsFetching
  const busy = isLoading || banksLoading || isAdding || isUpdating || isDeleting

  useEffect(() => {
    if (!banks.length) {
      setBankId('')
      return
    }
    const stillThere = banks.some((item) => String(recordId(item)) === String(bankId))
    if (stillThere) return
    const primary = banks.find((item) => item.is_primary) || banks[0]
    setBankId(String(recordId(primary)))
  }, [banks, bankId])

  useEffect(() => {
    if (withdrawals.totalPages > 0 && withdrawalPage > withdrawals.totalPages) setWithdrawalPage(withdrawals.totalPages)
  }, [withdrawalPage, withdrawals.totalPages])

  useEffect(() => {
    if (transactions.totalPages > 0 && transactionPage > transactions.totalPages) setTransactionPage(transactions.totalPages)
  }, [transactionPage, transactions.totalPages])

  const saveBank = async (values, id) => {
    const result = id
      ? await updateBank({ id, ...values })
      : await addBank(values)
    if (!isSuccess(result)) return
    toast.success(result?.data?.message || (id ? 'Bank updated' : 'Bank added'))
    setBankModal(null)
  }

  const makePrimary = async (bank) => {
    const result = await updateBank({ id: recordId(bank), ...bankPayload({ ...bank, is_primary: true }) })
    if (!isSuccess(result)) return
    toast.success(result?.data?.message || 'Primary bank updated')
  }

  const confirmDelete = async () => {
    if (!bankToDelete) return
    const result = await deleteBank(recordId(bankToDelete))
    if (!isSuccess(result)) return
    toast.success(result?.data?.message || 'Bank deleted')
    setBankToDelete(null)
  }

  const requestWithdrawal = async (event) => {
    event.preventDefault()
    const value = Number(amount)
    const balance = Number(wallet.amount)
    if (!banks.length) {
      setAmountError('')
      setBankError('Add a bank before requesting a withdrawal.')
      return
    }
    if (!Number.isFinite(value) || value <= 0) {
      setBankError('')
      setAmountError('Enter an amount greater than zero.')
      return
    }
    if (Number.isFinite(balance) && value > balance) {
      setBankError('')
      setAmountError('Amount is higher than your wallet balance.')
      return
    }
    if (!bankId) {
      setAmountError('')
      setBankError('Choose a bank.')
      return
    }
    setAmountError('')
    setBankError('')
    const numericId = Number(bankId)
    const result = await createWithdrawal({
      amount: value,
      bank_id: Number.isFinite(numericId) && String(numericId) === String(bankId) ? numericId : bankId,
      currency_symbol: wallet.code,
    })
    if (!isSuccess(result)) return
    toast.success(result?.data?.message || 'Withdrawal requested')
    setAmount('')
    setWithdrawalStatus('')
    setWithdrawalPage(1)
    setTransactionFilter('all')
    setTransactionPage(1)
  }

  return (
    <>
      {busy && <Loader />}
      <Row>
        <Col>
          <PageHeader titles="Wallet" active="Wallet" items={['Overview']} links={['/optometrist-dashboard/overview']} />
        </Col>
      </Row>

      <Card className="mb-4" style={{ ...cardStyle, overflow: 'hidden' }}>
        <div className="d-flex flex-wrap align-items-stretch">
          {[
            { key: 'balance', label: 'Balance', value: wallet.amount, icon: <FaWallet size={16} />, tint: '#eff6ff', color: '#3b82f6' },
            wallet.referral != null && { key: 'referral', label: 'Referral', value: wallet.referral, icon: <FaShareAlt size={14} />, tint: '#f0fdf4', color: '#15803d' },
            wallet.appointment != null && { key: 'appointment', label: 'Appointments', value: wallet.appointment, icon: <FaCalendarAlt size={15} />, tint: '#fff7ed', color: '#c2410c' },
          ].filter(Boolean).map((item, index, items) => (
            <div
              key={item.key}
              className="d-flex align-items-center gap-3"
              style={{ flex: '1 1 220px', padding: '20px 24px', borderRight: index < items.length - 1 ? '1px solid #eef2f7' : 'none' }}
            >
              <span className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 10, background: item.tint, color: item.color }}>
                {item.icon}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.label}</div>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <span className="fw-semibold" style={{ fontSize: '1.65rem', lineHeight: 1, color: '#0f172a' }}>{formatAmount(item.value)}</span>
                  {wallet.currency && <span className="text-muted" style={{ fontSize: 13 }}>{wallet.currency}</span>}
                </div>
              </div>
            </div>
          ))}
          {statusLabel && (
            <div className="d-flex align-items-center ms-auto" style={{ padding: '20px 24px', borderLeft: '1px solid #eef2f7' }}>
              <span className="d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold" style={{ fontSize: 13, borderRadius: 10, ...statusStyle }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />
                {statusLabel}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h5 className="fw-semibold mb-1">Bank accounts</h5>
              <p className="text-muted mb-0 small">Withdrawals are paid to the bank you choose.</p>
            </div>
            <Button type="button" onClick={() => setBankModal({})}>
              <FaPlus className="me-2" />Add bank
            </Button>
          </div>
          {banks.length === 0 ? (
            <EmptyNote>No bank accounts yet. Add one before requesting a withdrawal.</EmptyNote>
          ) : banks.map((bank, index) => (
            <div key={recordId(bank) || index} className="d-flex flex-wrap justify-content-between align-items-start gap-3 py-3" style={{ borderTop: '1px solid #eef2f7' }}>
              <div className="d-flex gap-3">
                <span className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 10, background: '#f8fafc', color: '#3b82f6' }}>
                  <FaUniversity />
                </span>
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="fw-semibold">{bank.bank_name || 'Bank'}</span>
                    {bank.is_primary && (
                      <span className="px-2 py-1 fw-semibold" style={{ fontSize: 12, borderRadius: 999, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>Primary</span>
                    )}
                  </div>
                  <div className="text-muted small">{bank.holder_name}</div>
                  <div className="text-muted small">Shaba {bank.account_number || '—'}</div>
                  <div className="text-muted small">SWIFT {bank.swift || '—'}</div>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {!bank.is_primary && (
                  <Button type="button" size="sm" variant="secondary" onClick={() => makePrimary(bank)}>Make primary</Button>
                )}
                <Button type="button" size="sm" variant="secondary" onClick={() => setBankModal(bank)} aria-label="Edit bank">
                  <FaPen />
                </Button>
                <Button type="button" size="sm" variant="danger" onClick={() => setBankToDelete(bank)} aria-label="Delete bank">
                  <FaTrash />
                </Button>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col xl={5}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h5 className="fw-semibold mb-1">Request a withdrawal</h5>
              <p className="text-muted small">Available {formatAmount(wallet.amount)}{wallet.currency ? ` ${wallet.currency}` : ''}.</p>
              <Form onSubmit={requestWithdrawal}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    placeholder="500000"
                    isInvalid={Boolean(amountError)}
                    disabled={isRequesting}
                    onChange={(event) => { setAmount(event.target.value); setAmountError('') }}
                    style={fieldStyle}
                  />
                  {amountError && <p className="text-danger small mb-0 mt-1">{amountError}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bank</Form.Label>
                  <Form.Select
                    value={bankId}
                    onChange={(event) => { setBankId(event.target.value); setBankError('') }}
                    style={fieldStyle}
                    disabled={!banks.length || isRequesting}
                    isInvalid={Boolean(bankError)}
                  >
                    {!banks.length && <option value="">No banks yet</option>}
                    {banks.map((bank) => (
                      <option key={recordId(bank)} value={recordId(bank)}>
                        {bank.bank_name}{bank.is_primary ? ' · Primary' : ''} · {bank.account_number}
                      </option>
                    ))}
                  </Form.Select>
                  {bankError && <p className="text-danger small mb-0 mt-1">{bankError}</p>}
                </Form.Group>
                <Button type="submit" disabled={!banks.length || isRequesting}>
                  {isRequesting ? 'Requesting...' : 'Request withdrawal'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={7}>
          <Card className="h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div>
                  <h5 className="fw-semibold mb-1">Withdrawal requests</h5>
                  <p className="text-muted mb-0 small">Requests you have sent from this wallet.</p>
                </div>
                <FilterChips
                  options={WITHDRAWAL_STATUSES}
                  value={withdrawalStatus}
                  onChange={(value) => { setWithdrawalStatus(value); setWithdrawalPage(1) }}
                />
              </div>
              {withdrawalsBusy ? <ListSkeleton /> : withdrawals.rows.length === 0 ? (
                <EmptyNote>{withdrawalStatus ? 'No withdrawal requests match this status.' : 'No withdrawal requests yet.'}</EmptyNote>
              ) : withdrawals.rows.map((row, index) => {
                const bank = row.bank || banks.find((item) => String(recordId(item)) === String(row.bank_id))
                return (
                  <div key={recordId(row) || index} className="d-flex flex-wrap justify-content-between align-items-center gap-3 py-3" style={{ borderTop: '1px solid #eef2f7' }}>
                    <div>
                      <div className="fw-semibold">{formatAmount(row.amount)} {row.currency_symbol || row.currency || ''}</div>
                      <div className="text-muted small">{[bank?.bank_name, bank?.account_number].filter(Boolean).join(' · ') || 'Bank on file'}</div>
                      <div className="text-muted small">{[when(row.createdAt), row.reference_id].filter(Boolean).join(' · ')}</div>
                      {row.transaction_id && <div className="text-muted small">Transaction ID: {row.transaction_id}</div>}
                      {row.reason && <div className="text-muted small">Reason: {row.reason}</div>}
                      {fileHref(row.file) && (
                        <a className="small fw-semibold text-decoration-none" href={fileHref(row.file)} target="_blank" rel="noreferrer">
                          View payment proof
                        </a>
                      )}
                    </div>
                    <StatusPill status={row.status} />
                  </div>
                )
              })}
              {!withdrawalsBusy && (
              <Pager
                page={withdrawalPage}
                totalPages={withdrawals.totalPages}
                limit={withdrawalLimit}
                total={withdrawals.total}
                onPage={setWithdrawalPage}
                onLimit={(size) => { setWithdrawalLimit(size); setWithdrawalPage(1) }}
              />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4" style={cardStyle}>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h5 className="fw-semibold mb-1">Transactions</h5>
              <p className="text-muted mb-0 small">Referral credits and withdrawals on this wallet.</p>
            </div>
            <FilterChips
              options={TRANSACTION_FILTERS}
              value={transactionFilter}
              onChange={(value) => { setTransactionFilter(value); setTransactionPage(1) }}
            />
          </div>
          {transactionsBusy ? <ListSkeleton /> : transactions.rows.length === 0 ? (
            <EmptyNote>{transactionFilter === 'all' ? 'No transactions yet.' : 'No transactions match this filter.'}</EmptyNote>
          ) : transactions.rows.map((row, index) => (
            <div key={recordId(row) || row.transaction_id || index} className="d-flex flex-wrap justify-content-between align-items-center gap-3 py-3" style={{ borderTop: '1px solid #eef2f7' }}>
              <div>
                <div className="fw-semibold">{row.transaction_type || row.type || 'Transaction'}</div>
                <div className="text-muted small">{[row.description, when(row.createdAt), row.transaction_id].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="text-end">
                <div className="fw-semibold" style={{ color: row.type === 'Debit' ? '#b91c1c' : '#15803d' }}>
                  {row.type === 'Debit' ? '−' : '+'}{formatAmount(row.amount)} {row.currency_symbol || row.currency || ''}
                </div>
                <div className="mt-1"><StatusPill status={row.type} /></div>
              </div>
            </div>
          ))}
          {!transactionsBusy && (
          <Pager
            page={transactionPage}
            totalPages={transactions.totalPages}
            limit={transactionLimit}
            total={transactions.total}
            onPage={setTransactionPage}
            onLimit={(size) => { setTransactionLimit(size); setTransactionPage(1) }}
          />
          )}
        </Card.Body>
      </Card>

      <BankFormModal
        show={Boolean(bankModal)}
        bank={bankModal && recordId(bankModal) ? bankModal : null}
        isSaving={isAdding || isUpdating}
        onClose={() => setBankModal(null)}
        onSubmit={saveBank}
      />
      <DeleteBankModal
        bank={bankToDelete}
        isSaving={isDeleting}
        onClose={() => setBankToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
