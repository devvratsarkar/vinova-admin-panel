import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetDashboardQuery } from '../../redux/features/dashboardEndPoint'
import { setPermissions } from '../../redux/slices/authSlice'
import Loader from '../../layouts/layoutcomponents/loader'
import DashboardHeader from './DashboardHeader'
import KpiRow from './KpiRow'
import EarningsMix from './EarningsMix'
import StoreBoard from './StoreBoard'
import EarningsCharts from './EarningsCharts'
import SnapshotRow from './SnapshotRow'
import RecentOrders from './RecentOrders'
import Rankings from './Rankings'
import './dashboard.css'

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

export default function Dashboard() {
  const [period, setPeriod] = useState('year')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const today = useMemo(() => localToday(), [])
  const dateError = period === 'custom' ? rangeError(fromDate, toDate, today) : ''
  const customReady = period !== 'custom' || (!dateError && fromDate && toDate)
  const queryArg = period === 'custom' ? { period, fromDate, toDate } : { period }
  const dispatch = useDispatch()
  const { data: response, isLoading, isFetching } = useGetDashboardQuery(queryArg, {
    skip: !customReady,
  })
  const data = response?.data
  const profilePermissions = data?.userPermissions || response?.userPermissions

  useEffect(() => {
    if (profilePermissions) dispatch(setPermissions(profilePermissions))
  }, [profilePermissions, dispatch])
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    [],
  )

  return (
    <div className="sa-dash">
      {(isLoading || isFetching) && <Loader />}
      <DashboardHeader
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
          <KpiRow data={data} />
          <EarningsMix data={data} />
          <StoreBoard data={data} />
          <RecentOrders orders={data.ordersList || []} />
          <EarningsCharts data={data} period={period} />
          <SnapshotRow data={data} />
          <Rankings data={data} />
        </>
      )}
    </div>
  )
}
