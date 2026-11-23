import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { axisMoney, compact } from '../dashboard/format'

const MILLION = 1_000_000

const SAMPLE = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    earnings: [82, 96, 88, 110, 124, 74, 61],
    expenses: [28, 34, 31, 40, 46, 22, 18],
  },
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    earnings: [410, 468, 442, 505],
    expenses: [146, 168, 152, 181],
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    earnings: [420, 480, 510, 540, 580, 610, 590, 640, 620, 680, 630],
    expenses: [180, 210, 190, 240, 220, 260, 200, 250, 230, 270, 210],
  },
}

function sampleFor(period) {
  if (period === 'week' || period === 'month') return SAMPLE[period]
  return SAMPLE.year
}

function toRials(values) {
  return values.map((value) => value * MILLION)
}

export default function LedgerChart({ period }) {
  const sample = sampleFor(period)
  const earnings = toRials(sample.earnings)
  const expenses = toRials(sample.expenses)
  const earningsTotal = earnings.reduce((sum, value) => sum + value, 0)
  const expensesTotal = expenses.reduce((sum, value) => sum + value, 0)

  const options = useMemo(() => ({
    chart: {
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false },
      animations: { easing: 'easeinout', speed: 450 },
    },
    colors: ['#24306e', '#c2410c'],
    stroke: { curve: 'smooth', width: 2.5 },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 0.2, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 95] },
    },
    markers: { size: 0, strokeWidth: 0, hover: { size: 5 } },
    grid: { borderColor: '#eef2f7', strokeDashArray: 4, padding: { left: 8, right: 12, top: 0 } },
    xaxis: {
      categories: sample.labels,
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
  }), [sample.labels])

  const series = useMemo(() => ([
    { name: 'Earnings', data: earnings },
    { name: 'Expenses', data: expenses },
  ]), [earnings, expenses])

  return (
    <section className="sa-card mb-3">
      <div className="sa-card-pad">
        <div className="sa-section-head">
          <div>
            <h2>Ledger trend <span className="sa-sample">Sample</span></h2>
            <p>Sample figures for this view. Not from the live ledger yet.</p>
          </div>
        </div>
      </div>
      <Chart key={period} options={options} series={series} type="area" height={312} />
      <div className="sa-legend">
        <div className="sa-legend-row">
          <i className="sa-swatch processing" />
          <span>Earnings</span>
          <b>{compact(earningsTotal)} Rials</b>
        </div>
        <div className="sa-legend-row">
          <i className="sa-swatch pending" />
          <span>Expenses</span>
          <b>{compact(expensesTotal)} Rials</b>
        </div>
      </div>
    </section>
  )
}
