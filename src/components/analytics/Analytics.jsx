import { useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import Chart from 'react-apexcharts'
import { IoEyeOutline, IoFlashOutline, IoPeopleOutline, IoPulseOutline, IoStatsChartOutline, IoSwapHorizontalOutline } from 'react-icons/io5'
import Loader from '../../layouts/layoutcomponents/loader'
import { useGetAnalyticsQuery } from '../../redux/features/dashboardEndPoint'
import '../dashboard/dashboard.css'
import './analytics.css'

function count(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return Math.round(number).toLocaleString('en-US')
}

function percent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0%'
  const ratio = number <= 1 ? number * 100 : number
  return `${ratio.toFixed(1).replace(/\.0$/, '')}%`
}

function dayLabel(raw) {
  const text = String(raw || '')
  if (!/^\d{8}$/.test(text)) return text
  const date = new Date(Number(text.slice(0, 4)), Number(text.slice(4, 6)) - 1, Number(text.slice(6, 8)))
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function errorText(error) {
  if (!error) return ''
  if (typeof error === 'string') return error
  return error?.data?.message || error?.message || error?.error || ''
}

function Kpi({ featured, icon, label, value, hint }) {
  return (
    <article className={`sa-kpi${featured ? ' is-featured' : ''}`}>
      <div className="sa-kpi-top">
        <span className="sa-kpi-icon">{icon}</span>
        <span />
      </div>
      <p className="sa-kpi-label">{label}</p>
      <p className="sa-kpi-value">{value}</p>
      <p className="sa-kpi-sub">{hint}</p>
    </article>
  )
}

function MetricList({ items, labelKey, empty }) {
  const max = Math.max(...items.map((item) => Number(item.value) || 0), 0)
  if (!items.length) return <p className="ga-empty">{empty}</p>
  return (
    <div className="ga-card-body sa-panel-list">
      {items.map((item) => {
        const label = item[labelKey] || '—'
        const share = max ? Math.round(((Number(item.value) || 0) / max) * 100) : 0
        return (
          <div className="sa-panel-row" key={`${label}-${item.value}`}>
            <span className="ga-channel">
              <b title={label}>{label}</b>
              <span className="sa-meter ga-meter" aria-hidden><i style={{ width: `${share}%` }} /></span>
            </span>
            <strong>{count(item.value)}</strong>
          </div>
        )
      })}
    </div>
  )
}

export default function Analytics() {
  const { data: response, isLoading, isFetching, isError, error } = useGetAnalyticsQuery()
  const data = response?.data || {}
  const summary = data.summary || {}
  const timeseries = Array.isArray(data.timeseries) ? data.timeseries : []
  const channels = Array.isArray(data.channels) ? data.channels : []
  const topPages = Array.isArray(data.topPages) ? data.topPages : []
  const countries = Array.isArray(data.countries) ? data.countries : []
  const realtime = data.realtime || {}

  const chartOptions = useMemo(() => ({
    chart: {
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false },
      animations: { easing: 'easeinout', speed: 450 },
    },
    colors: ['#24306e', '#0f766e'],
    stroke: { curve: 'smooth', width: 2.5 },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 0.2, opacityFrom: 0.28, opacityTo: 0.02, stops: [0, 95] },
    },
    grid: { borderColor: '#eef2f7', strokeDashArray: 4, padding: { left: 8, right: 12, top: 0 } },
    xaxis: {
      categories: timeseries.map((point) => dayLabel(point.date)),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        hideOverlappingLabels: true,
        style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '11px' },
        formatter: (value) => count(value),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontWeight: 600,
      labels: { colors: '#64748b' },
    },
    tooltip: {
      y: { formatter: (value) => count(value) },
    },
  }), [timeseries])

  const chartSeries = useMemo(() => ([
    { name: 'Active users', data: timeseries.map((point) => Number(point.activeUsers) || 0) },
    { name: 'Sessions', data: timeseries.map((point) => Number(point.sessions) || 0) },
  ]), [timeseries])

  return (
    <div className="sa-dash">
      {(isLoading || isFetching) && <Loader />}
      <header className="sa-top">
        <div>
          <div className="sa-kicker">
            <span className="sa-kicker-dot" />
            Site traffic
          </div>
          <h1>Analytics</h1>
          <p>Active users, sessions, pages, and where visitors come from.</p>
        </div>
      </header>

      {isError || response?.success === false ? (
        <div className="ga-error">{errorText(error) || response?.message || 'Analytics could not be loaded.'}</div>
      ) : null}

      <Row className="g-3 mb-3">
        <Col xs={12} md={6} xl={4}>
          <Kpi
            featured
            icon={<IoPulseOutline size={18} />}
            label="Active now"
            value={count(realtime.activeUsers)}
            hint="On the site right now"
          />
        </Col>
        <Col xs={12} md={6} xl={4}>
          <Kpi
            icon={<IoPeopleOutline size={18} />}
            label="Active users"
            value={count(summary.activeUsers)}
            hint="In this report"
          />
        </Col>
        <Col xs={12} md={6} xl={4}>
          <Kpi
            icon={<IoStatsChartOutline size={18} />}
            label="Sessions"
            value={count(summary.sessions)}
            hint="Visits in this report"
          />
        </Col>
        <Col xs={12} md={6} xl={4}>
          <Kpi
            icon={<IoEyeOutline size={18} />}
            label="Page views"
            value={count(summary.screenPageViews)}
            hint="Screens viewed"
          />
        </Col>
        <Col xs={12} md={6} xl={4}>
          <Kpi
            icon={<IoFlashOutline size={18} />}
            label="Events"
            value={count(summary.eventCount)}
            hint="Actions recorded"
          />
        </Col>
        <Col xs={12} md={6} xl={4}>
          <Kpi
            icon={<IoSwapHorizontalOutline size={18} />}
            label="Bounce rate"
            value={percent(summary.bounceRate)}
            hint="Visits that left after one page"
          />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col xs={12}>
          <section className="sa-card">
            <div className="sa-card-pad">
              <div className="sa-section-head">
                <div>
                  <h2>Traffic</h2>
                  <p>Active users and sessions by day.</p>
                </div>
              </div>
            </div>
            {timeseries.length ? (
              <Chart options={chartOptions} series={chartSeries} type="area" height={312} />
            ) : (
              <p className="ga-empty">No traffic in this report.</p>
            )}
          </section>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col xl={6}>
          <section className="sa-card">
            <div className="sa-card-pad">
              <div className="sa-section-head">
                <div>
                  <h2>Channels</h2>
                  <p>Sessions by how visitors arrived.</p>
                </div>
              </div>
            </div>
            <MetricList items={channels} labelKey="name" empty="No channel data." />
          </section>
        </Col>
        <Col xl={6}>
          <section className="sa-card">
            <div className="sa-card-pad">
              <div className="sa-section-head">
                <div>
                  <h2>Countries</h2>
                  <p>Active users by country.</p>
                </div>
              </div>
            </div>
            <MetricList items={countries} labelKey="country" empty="No country data." />
          </section>
        </Col>
      </Row>

      <section className="sa-card">
        <div className="sa-card-pad">
          <div className="sa-section-head">
            <div>
              <h2>Top pages</h2>
              <p>Pages with the most views.</p>
            </div>
          </div>
        </div>
        <MetricList items={topPages} labelKey="path" empty="No page data." />
      </section>
    </div>
  )
}
