import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { FaDownload } from 'react-icons/fa'
import toast from 'react-hot-toast'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import { ListFilters, ListTable, boundFilters, indexColumn, useListFilters } from '../../common/ListFilters'
import { optometristAPIEndPoint, useGetOptometristPlanHistoryQuery, useLazyGetOptometristPlanInvoiceQuery } from '../../../redux/features/optometristAPIEndPoint'
import { useCsvDownload } from '../../../utils/fileDownload'

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
]
const PERIOD_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
]

const cardStyle = {
  border: '1px solid #e8edf3',
  borderRadius: 12,
  boxShadow: 'none',
  background: '#fff',
}

function text(value) {
  return value == null ? '' : String(value).trim()
}

function titleCase(value) {
  const raw = text(value).replace(/[_-]+/g, ' ')
  if (!raw) return ''
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

function money(value) {
  if (value !== 0 && !value) return ''
  const amount = Number(value)
  return Number.isFinite(amount) ? amount.toLocaleString('en-US') : text(value)
}

function readPage(response) {
  const payload = response?.data
  const list = Array.isArray(payload)
    ? payload
    : ['data', 'history', 'items', 'rows'].map((key) => payload?.[key]).find((value) => Array.isArray(value)) || []
  const pagination = !Array.isArray(payload) && payload?.pagination && typeof payload.pagination === 'object' ? payload.pagination : payload
  const total = Number(pagination?.total)
  const totalPages = Number(pagination?.totalPages)
  return {
    rows: list.map(readRow),
    total: Number.isFinite(total) ? total : list.length,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  }
}

function readRow(row) {
  const plan = row?.plan && typeof row.plan === 'object' ? row.plan : {}
  const status = text(row?.status)
  return {
    id: text(row?._id),
    transactionId: text(row?.transaction_id),
    plan: text(row?.plan_name || plan.name),
    period: titleCase(row?.plan_type),
    amount: money(row?.amount),
    currency: text(row?.currency_code),
    method: titleCase(row?.payment_method),
    status: titleCase(status),
    statusKey: status.toLowerCase(),
    purchasedBy: titleCase(row?.purchased_by),
    source: titleCase(row?.source),
    description: text(row?.description),
    createdAt: text(row?.createdAt),
    updatedAt: text(row?.updatedAt),
  }
}

async function invoiceMessage(file) {
  if (file instanceof Blob) {
    try {
      const body = JSON.parse(await file.text())
      return text(body?.message)
    } catch {
      return ''
    }
  }
  return text(file?.message)
}

function statusStyle(status) {
  if (status === 'success' || status === 'completed' || status === 'paid') {
    return { background: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
  }
  if (status === 'failed') {
    return { background: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
  }
  return { background: '#fffbeb', color: '#b45309', border: '#fde68a' }
}

export default function PlanHistory() {
  const filters = useListFilters(['status', 'plan_type'])
  const { download: exportHistory, exporting: isExporting } = useCsvDownload(
    optometristAPIEndPoint.endpoints.getOptometristPlanHistory,
    'Plan history downloaded',
  )
  const { data, isLoading, isFetching } = useGetOptometristPlanHistoryQuery(filters.query, { skip: filters.skip })
  const [downloadInvoice] = useLazyGetOptometristPlanInvoiceQuery()
  const [downloadingId, setDownloadingId] = useState('')
  const list = readPage(data)

  useEffect(() => {
    if (list.totalPages > 0 && filters.currentPage > list.totalPages) {
      filters.onPaginationModelChange({ page: list.totalPages - 1, pageSize: filters.pageSize })
    }
  }, [filters.currentPage, filters.pageSize, filters.onPaginationModelChange, list.totalPages])

  const saveInvoice = async (id) => {
    if (!id || downloadingId) return
    setDownloadingId(id)
    try {
      const file = await downloadInvoice(id).unwrap()
      const blob = file instanceof Blob ? file : null
      if (!blob || blob.type.includes('json')) {
        const message = await invoiceMessage(file)
        if (message) toast.error(message)
        return
      }
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `plan-invoice-${id}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch {
      // Failed responses are toasted from the optometrist base query using the API message.
    } finally {
      setDownloadingId('')
    }
  }

  const columns = useMemo(() => [
    indexColumn(filters.currentPage, filters.pageSize),
    { id: 'plan', label: 'Plan', minWidth: 140, flex: 1, render: (row) => row.plan || 'Plan payment' },
    { id: 'period', label: 'Billing', width: 110, render: (row) => row.period || '—' },
    {
      id: 'amount',
      label: 'Amount',
      width: 150,
      align: 'right',
      nowrap: true,
      render: (row) => <span className="fw-semibold">{[row.amount, row.currency].filter(Boolean).join(' ') || '—'}</span>,
    },
    {
      id: 'status',
      label: 'Status',
      width: 124,
      render: (row) => {
        if (!row.status) return '—'
        const tone = statusStyle(row.statusKey)
        return (
          <span className="px-2 py-1 fw-semibold text-nowrap" style={{ fontSize: 12, borderRadius: 999, background: tone.background, color: tone.color, border: `1px solid ${tone.border}` }}>
            {row.status}
          </span>
        )
      },
    },
    { id: 'method', label: 'Method', width: 110, render: (row) => row.method || '—' },
    { id: 'purchasedBy', label: 'Purchased by', width: 130, render: (row) => row.purchasedBy || '—' },
    { id: 'source', label: 'Source', width: 110, render: (row) => row.source || '—' },
    { id: 'transactionId', label: 'Transaction', minWidth: 220, flex: 1, render: (row) => <span style={{ overflowWrap: 'anywhere' }}>{row.transactionId || '—'}</span> },
    {
      id: 'description',
      label: 'Description',
      minWidth: 220,
      flex: 1.2,
      render: (row) => <span style={{ display: 'block', lineHeight: 1.45, whiteSpace: 'normal' }}>{row.description || '—'}</span>,
    },
    { id: 'createdAt', label: 'Created', width: 210, nowrap: true, render: (row) => row.createdAt || '—' },
    {
      id: 'invoice',
      label: 'Invoice',
      width: 130,
      sortable: false,
      render: (row) => (
        <button
          type="button"
          disabled={!row.id || downloadingId === row.id}
          onClick={() => saveInvoice(row.id)}
          style={{ height: 32, padding: '0 12px', border: 0, borderRadius: 8, background: '#293896', color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          <FaDownload className="me-1" />
          {downloadingId === row.id ? 'Downloading...' : 'Invoice'}
        </button>
      ),
    },
  ], [filters.currentPage, filters.pageSize, downloadingId])

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <Row>
        <Col>
          <PageHeader titles="Plan history" active="Plan history" items={['Overview']} links={['/optometrist-dashboard/overview']} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Card style={cardStyle}>
            <Card.Body className="data_table">
              <div className="e-table pb-5">
                <ListFilters
                  {...boundFilters(filters, {
                    placeholder: 'Plan or transaction ID',
                    onExport: () => { if (!filters.skip) exportHistory(filters.query) },
                    exporting: isExporting,
                    selects: [
                      {
                        label: 'Status',
                        value: filters.filters.status,
                        onChange: (value) => filters.setFilter('status', value),
                        empty: 'All statuses',
                        options: STATUS_OPTIONS,
                      },
                      {
                        label: 'Billing',
                        value: filters.filters.plan_type,
                        onChange: (value) => filters.setFilter('plan_type', value),
                        empty: 'All billing',
                        options: PERIOD_OPTIONS,
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
                  getRowKey={(row) => row.id}
                  emptyLabel={filters.hasFilters ? 'No plan payments match these filters.' : 'No plan payments yet.'}
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
