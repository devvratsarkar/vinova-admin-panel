import { useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { IoWalletOutline, IoCashOutline, IoTimeOutline } from 'react-icons/io5'
import { useGetDashboardQuery } from '../../redux/features/dashboardEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import DashboardHeader from '../dashboard/DashboardHeader'
import IncomeBooks from '../dashboard/IncomeBooks'
import LedgerChart from './LedgerChart'
import { Kpi } from '../dashboard/KpiRow'
import { compact } from '../dashboard/format'
import '../dashboard/dashboard.css'

function localToday() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function rangeError(from, to, today) {
  if (from && from > today) return 'From date cannot be after today.'
  if (to && to > today) return 'To date cannot be after today.'
  if (from && to && from > to) return 'To date must be on or after the From date.'
  if ((from && !to) || (!from && to)) return 'Choose both a From date and a To date.'
  return ''
}

export default function Ledger() {
  const [period, setPeriod] = useState('year')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const today = useMemo(() => localToday(), [])
  const dateError = period === 'custom' ? rangeError(fromDate, toDate, today) : ''
  const customReady = period !== 'custom' || (!dateError && fromDate && toDate)
  const queryArg = period === 'custom' ? { period, fromDate, toDate } : { period }
  const { data: response, isLoading, isFetching } = useGetDashboardQuery(queryArg, {
    skip: !customReady,
  })
  const data = response?.data
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    [],
  )

  return (
    <div className="sa-dash">
      {(isLoading || isFetching) && <Loader />}
      <DashboardHeader
        title="Ledger"
        data={data}
        todayLabel={todayLabel}
        period={period}
        onPeriod={setPeriod}
        fromDate={fromDate}
        toDate={toDate}
        today={today}
        dateError={dateError}
        onFromDate={setFromDate}
        onToDate={setToDate}
      />
      {data && (
        <>
          <Row className="g-3 mb-3">
            <Col xs={12} md={6} xl={4}>
              <Kpi
                featured
                icon={<IoWalletOutline size={18} />}
                label="Earnings"
                value={compact(data.earnings)}
                unit="Rials"
                trend={data.earningsTrend}
                hint="Money Vinova keeps"
              />
            </Col>
            <Col xs={12} md={6} xl={4}>
              <Kpi
                icon={<IoCashOutline size={18} />}
                label="Total expenses"
                value="NA"
                hint="Commissions, refunds, and discounts"
              />
            </Col>
            <Col xs={12} md={6} xl={4}>
              <Kpi
                icon={<IoTimeOutline size={18} />}
                label="Pending expenses"
                value="NA"
                hint="To pay for withdrawal"
              />
            </Col>
          </Row>
          <section className="sa-card sa-board">
            <IncomeBooks data={data} />
          </section>
          <LedgerChart period={period} />
        </>
      )}
    </div>
  )
}
