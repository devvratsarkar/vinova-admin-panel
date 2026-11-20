import { useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { axisMoney, base, compact } from './format'

export default function EarningsCharts({ data, period }) {
  const chartOptions = useMemo(() => ({
    chart: {
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false },
      animations: { easing: 'easeinout', speed: 450 },
    },
    colors: ['#24306e'],
    stroke: { curve: 'smooth', width: 2.5 },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 0.2, opacityFrom: 0.28, opacityTo: 0.02, stops: [0, 95] },
    },
    markers: { size: 0, strokeWidth: 0, hover: { size: 5 } },
    grid: { borderColor: '#eef2f7', strokeDashArray: 4, padding: { left: 8, right: 12, top: 0 } },
    xaxis: {
      categories: data.labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } },
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '11px' },
        formatter: (value) => axisMoney(value),
      },
    },
    legend: { show: false },
    tooltip: {
      y: { formatter: (value) => `${Number(value).toLocaleString('en-US')} Rials` },
    },
  }), [data.labels])

  const chartSeries = useMemo(() => ([
    { name: 'Earnings', data: data.earningsSeries },
  ]), [data.earningsSeries])

  const donutOptions = useMemo(() => ({
    labels: data.status.map((item) => item.label),
    colors: ['#0f766e', '#24306e', '#c2410c', '#94a3b8'],
    stroke: { width: 2, colors: ['#fff'] },
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '74%',
          labels: {
            show: true,
            name: { fontSize: '12px', color: '#64748b', offsetY: 18 },
            value: {
              fontSize: '22px',
              fontWeight: 700,
              color: '#0f172a',
              offsetY: -18,
              formatter: (value) => Number(value).toLocaleString('en-US'),
            },
            total: {
              show: true,
              label: 'Fulfilled',
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748b',
              formatter: () => `${data.fulfillment}%`,
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (value) => `${Number(value).toLocaleString('en-US')} orders` } },
  }), [data.fulfillment, data.status])

  return (
    <Row className="g-3 mb-3">
      <Col xl={8}>
        <section className="sa-card">
          <div className="sa-card-pad">
            <div className="sa-section-head">
              <div>
                <h2>Earnings</h2>
                <p>{data.range}. Money Vinova keeps.</p>
              </div>
            </div>
          </div>
          <Chart key={`${period}-${data.range}`} options={chartOptions} series={chartSeries} type="area" height={312} />
          <div className="sa-foot-stats">
            <div>
              <span>Avg. order value</span>
              <strong>{compact(data.aov)} Rials</strong>
            </div>
            <div>
              <span>Bought</span>
              <strong>{data.customers.toLocaleString('en-US')}</strong>
            </div>
            <div>
              <span>New customers</span>
              <strong>{data.newCustomers.toLocaleString('en-US')}</strong>
            </div>
            <div>
              <span>Returning</span>
              <strong>{data.returning}%</strong>
            </div>
          </div>
        </section>
      </Col>
      <Col xl={4}>
        <section className="sa-card">
          <div className="sa-card-pad">
            <div className="sa-section-head">
              <div>
                <h2>Order health</h2>
                <p>{data.fulfillment}% of orders fulfilled</p>
              </div>
              <Link className="sa-link" to={`${base}orders`}>View orders</Link>
            </div>
          </div>
          <Chart options={donutOptions} series={data.status.map((item) => item.value)} type="donut" height={232} />
          <div className="sa-legend">
            {data.status.map((item) => (
              <div key={item.label} className="sa-legend-row">
                <i className={`sa-swatch ${item.tone}`} />
                <span>{item.label}</span>
                <b>{item.value.toLocaleString('en-US')}</b>
              </div>
            ))}
          </div>
        </section>
      </Col>
    </Row>
  )
}
