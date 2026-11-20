import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import Loader from '../../../layouts/layoutcomponents/loader'
import Error from '../../../layouts/layoutcomponents/Error'
import { useGetAdminOptometristWithdrawalsQuery } from '../../../redux/features/optometristEnquiryAPIEndPoint'
import { ListFilters, ListTable, boundFilters, formatDate, indexColumn, readList, useListFilters } from '../../common/ListFilters'
import { catalogueSlice } from '../../../redux/services/catalogueSlice'
import { exportProps, useExportAction } from '../../../utils/fileDownload'
import WithdrawalReviewModal from './WithdrawalReviewModal'

const STATUSES = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Rejected', label: 'Rejected' },
]

function person(row) {
  const candidate = [row?.user, row?.optometrist].find((item) => item && typeof item === 'object')
  return candidate || {}
}

function amountText(row) {
  const amount = Number(row?.amount)
  const value = Number.isFinite(amount) ? amount.toLocaleString('en-US') : (row?.amount ?? '')
  return [row?.currency_symbol, value].filter(Boolean).join(' ')
}

function statusBadge(status) {
  const key = String(status || '').toLowerCase()
  const variant = key === 'completed' ? 'success' : key === 'rejected' || key === 'cancelled' ? 'danger' : 'warning'
  return <span className={`badge bg-${variant}`}>{status || '—'}</span>
}

export default function WithdrawalRequests() {
  const [searchParams] = useSearchParams()
  const list = useListFilters(['status'], { status: searchParams.get('status') || '' })
  const [selected, setSelected] = useState(null)
  const { data, isError, error, isLoading, isFetching } = useGetAdminOptometristWithdrawalsQuery(list.query, { skip: list.skip })
  const fileExport = useExportAction(catalogueSlice.endpoints.getAdminOptometristWithdrawals, 'OptometristWithdrawal', 'Withdrawal requests downloaded')
  const { rows, total } = readList(data)

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    {
      id: 'optometrist',
      label: 'Optometrist',
      minWidth: 200,
      flex: 1,
      render: (row) => {
        const account = person(row)
        const name = account.name || row?.optometrist_name || row?.name || '—'
        const contact = account.phone_number || account.email || ''
        return (
          <div className="py-1">
            <div>{name}</div>
            {contact && <div className="text-muted">{contact}</div>}
          </div>
        )
      },
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 140,
      flex: 0.7,
      render: (row) => amountText(row),
    },
    {
      id: 'bank',
      label: 'Bank',
      minWidth: 200,
      flex: 1,
      render: (row) => {
        const bank = row?.bank
        if (!bank) return row?.bank_id || ''
        return (
          <div className="py-1">
            <div>{bank.bank_name}</div>
            <div className="text-muted">{bank.account_number}</div>
          </div>
        )
      },
    },
    {
      id: 'reference',
      label: 'Reference',
      minWidth: 140,
      flex: 0.7,
      render: (row) => row?.reference_id || row?.transaction_id || '',
    },
    {
      id: 'status',
      label: 'Status',
      width: 130,
      render: (row) => statusBadge(row?.status),
    },
    {
      id: 'date',
      label: 'Requested',
      minWidth: 180,
      flex: 0.8,
      render: (row) => formatDate(row?.createdAt),
    },
    {
      id: 'action',
      label: 'Action',
      width: 90,
      align: 'center',
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper">
          <OverlayTrigger placement="top" overlay={<Tooltip>Review</Tooltip>}>
            <Button className="btn btn-icon btn-primary" onClick={() => setSelected(row)}>
              <i className="fe fe-eye"></i>
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize])

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Withdrawal Requests" active="Withdrawal Requests" items={['Home']} links={['/dashboard']} />
        </Col>
      </Row>
      <Row>
        <Card>
          <Card.Body className="data_table">
            {isError && <Error error_mes={error} />}
            <div className="e-table pb-5">
              <ListFilters
                {...boundFilters(list, {
                  placeholder: 'Name, email, phone, or reference',
                  ...exportProps(fileExport, list.query, list.skip),
                  selects: [
                    {
                      label: 'Status',
                      value: list.filters.status,
                      onChange: (value) => list.setFilter('status', value),
                      empty: 'All statuses',
                      options: STATUSES,
                    },
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
                emptyLabel="No withdrawal requests found"
                getRowHeight={() => 'auto'}
              />
            </div>
          </Card.Body>
        </Card>
      </Row>
      <WithdrawalReviewModal key={selected?.id || selected?._id || 'closed'} row={selected} onClose={() => setSelected(null)} />
    </>
  )
}
