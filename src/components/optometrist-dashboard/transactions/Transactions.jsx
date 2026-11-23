import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { ListFilters, ListTable, boundFilters, indexColumn, useListFilters } from '../../common/ListFilters'

const TYPE_OPTIONS = [
  { value: 'Debit', label: 'Debit' },
  { value: 'Credit', label: 'Credit' },
]
const TRANSACTION_TYPES = [
  { value: 'Plan', label: 'Plan' },
  { value: 'Withdrawal', label: 'Withdrawal' },
  { value: 'Referral', label: 'Referral' },
]
const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]
import { optometristAPIEndPoint, useGetOptometristTransactionsQuery } from '../../../redux/features/optometristAPIEndPoint'
import { useCsvDownload } from '../../../utils/fileDownload'

function readPage(response) {
  const payload = response?.data
  if (Array.isArray(payload)) return { rows: payload, total: payload.length, totalPages: 1 }
  if (!payload || typeof payload !== 'object') return { rows: [], total: 0, totalPages: 1 }
  const rows = ['data', 'transactions', 'items', 'rows']
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

function filled(value) {
  return value != null && String(value).trim() !== ''
}

function text(value) {
  return filled(value) ? String(value) : '—'
}

function amountLabel(value) {
  if (!filled(value) && value !== 0) return '—'
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString('en-US') : String(value)
}

function statusLabel(value) {
  const key = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (!key) return ''
  const labels = {
    completed: 'Completed',
    success: 'Completed',
    paid: 'Paid',
    pending: 'Pending',
    processing: 'Processing',
    failed: 'Failed',
    cancelled: 'Cancelled',
    canceled: 'Cancelled',
    refunded: 'Refunded',
  }
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusTone(value) {
  const key = String(value || '').trim().toLowerCase()
  if (key === 'completed' || key === 'success' || key === 'paid') {
    return { background: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
  }
  if (key === 'failed' || key === 'cancelled' || key === 'canceled') {
    return { background: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
  }
  if (key === 'refunded') {
    return { background: '#f8fafc', color: '#475569', border: '#e2e8f0' }
  }
  return { background: '#fffbeb', color: '#b45309', border: '#fde68a' }
}

function referenceIds(row) {
  const lines = [
    ['Withdrawal', row.withdrawal_id],
    ['Transaction', row.transaction_id],
    ['Order', row.order_id],
  ].filter(([, value]) => filled(value))
  if (!lines.length) return '—'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0', width: '100%', minWidth: 0 }}>
      {lines.map(([label, value]) => (
        <div key={label} style={{ minWidth: 0 }}>
          <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>{label}</div>
          <div style={{ color: '#0f172a', fontSize: 13, lineHeight: 1.4, overflowWrap: 'anywhere' }}>{String(value)}</div>
        </div>
      ))}
    </div>
  )
}

export default function Transactions() {
  const [searchParams] = useSearchParams()
  const filters = useListFilters(['type', 'transaction_type', 'status'], {
    type: searchParams.get('type') || '',
    transaction_type: searchParams.get('transaction_type') || '',
    status: searchParams.get('status') || '',
    fromDate: searchParams.get('fromDate') || '',
    toDate: searchParams.get('toDate') || '',
  })
  const { download: exportTransactions, exporting: isExporting } = useCsvDownload(
    optometristAPIEndPoint.endpoints.getOptometristTransactions,
    'Transactions downloaded',
  )
  const { data, isLoading, isFetching } = useGetOptometristTransactionsQuery(filters.query, { skip: filters.skip })
  const list = readPage(data)

  useEffect(() => {
    if (list.totalPages > 0 && filters.currentPage > list.totalPages) {
      filters.onPaginationModelChange({ page: list.totalPages - 1, pageSize: filters.pageSize })
    }
  }, [filters.currentPage, filters.pageSize, filters.onPaginationModelChange, list.totalPages])

  const columns = useMemo(() => [
    indexColumn(filters.currentPage, filters.pageSize),
    { id: 'transaction_type', label: 'Transaction type', width: 168, render: (row) => text(row.transaction_type) },
    {
      id: 'amount',
      label: 'Amount',
      width: 108,
      align: 'right',
      nowrap: true,
      numeric: true,
      render: (row) => {
        const debit = String(row.type || '').toLowerCase() === 'debit'
        return <span className="fw-semibold" style={{ color: debit ? '#b91c1c' : '#15803d' }}>{amountLabel(row.amount)}</span>
      },
    },
    {
      id: 'type',
      label: 'Type',
      width: 92,
      render: (row) => {
        if (!filled(row.type)) return '—'
        const debit = String(row.type).toLowerCase() === 'debit'
        return (
          <span className="px-2 py-1 fw-semibold" style={{ fontSize: 12, borderRadius: 999, background: debit ? '#fef2f2' : '#f0fdf4', color: debit ? '#b91c1c' : '#15803d', border: `1px solid ${debit ? '#fecaca' : '#bbf7d0'}` }}>
            {row.type}
          </span>
        )
      },
    },
    {
      id: 'status',
      label: 'Status',
      width: 124,
      render: (row) => {
        const label = statusLabel(row.status)
        if (!label) return '—'
        const tone = statusTone(row.status)
        return (
          <span className="px-2 py-1 fw-semibold text-nowrap" style={{ fontSize: 12, borderRadius: 999, background: tone.background, color: tone.color, border: `1px solid ${tone.border}` }}>
            {label}
          </span>
        )
      },
    },
    { id: 'references', label: 'IDs', minWidth: 220, flex: 1, render: referenceIds },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      flex: 1.2,
      render: (row) => <span style={{ display: 'block', lineHeight: 1.45, whiteSpace: 'normal' }}>{text(row.description)}</span>,
    },
    { id: 'date', label: 'Date', width: 210, nowrap: true, render: (row) => text(row.createdAt || row.created_at) },
  ], [filters.currentPage, filters.pageSize])

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <Row>
        <Col>
          <PageHeader titles="Transactions" active="Transactions" items={['Overview']} links={['/optometrist-dashboard/overview']} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <div className="e-table pb-5">
                <ListFilters
                  {...boundFilters(filters, {
                    placeholder: 'Description or ID',
                    onExport: () => {
                      if (filters.skip) return
                      exportTransactions(filters.query)
                    },
                    exporting: isExporting,
                    selects: [
                      {
                        label: 'Type',
                        value: filters.filters.type,
                        onChange: (value) => filters.setFilter('type', value),
                        empty: 'All types',
                        options: TYPE_OPTIONS,
                      },
                      {
                        label: 'Transaction',
                        value: filters.filters.transaction_type,
                        onChange: (value) => filters.setFilter('transaction_type', value),
                        empty: 'All transactions',
                        options: TRANSACTION_TYPES,
                      },
                      {
                        label: 'Status',
                        value: filters.filters.status,
                        onChange: (value) => filters.setFilter('status', value),
                        empty: 'All statuses',
                        options: STATUS_OPTIONS,
                      },
                    ],
                  })}
                />
                <ListTable
                  columns={columns}
                  rows={list.rows}
                  total={list.total}
                  page={filters.currentPage}
                  pageSize={filters.pageSize}
                  onPagination={filters.onPaginationModelChange}
                  emptyLabel={filters.hasFilters ? 'No transactions match these filters.' : 'No transactions yet.'}
                  getRowHeight={() => 'auto'}
                  columnHeaderHeight={52}
                  disableRowSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-cell': {
                      padding: '12px 16px',
                      fontSize: '0.92rem',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid #f1f4f9',
                      outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-row.Mui-selected': {
                      backgroundColor: 'transparent',
                    },
                    '& .MuiDataGrid-selectedRowCount': {
                      display: 'none',
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
