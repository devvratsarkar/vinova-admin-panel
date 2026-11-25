import Chart from 'react-apexcharts'
import { axisMoney, compact } from '../dashboard/format'

export default function LedgerChart({ data, period }) {
  const options = {
    chart: { toolbar: { show: false }, fontFamily: 'inherit', zoom: { enabled: false } },
    colors: ['#24306e', '#c2410c'],
    stroke: { curve: 'smooth', width: 2.5 },
    dataLabels: { enabled: false },
    fill: { type: 'gradient', gradient: { shadeIntensity: 0.2, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 95] } },
    markers: { size: 0, hover: { size: 5 } },
    grid: { borderColor: '#eef2f7', strokeDashArray: 4 },
    xaxis: {
      categories: data.labels || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } },
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: axisMoney } },
    legend: { show: false },
    tooltip: { y: { formatter: (value) => `${Number(value).toLocaleString('en-US')} Rials` } },
  }

  return (
    <section className="sa-card mb-3">
      <div className="sa-card-pad">
        <div className="sa-section-head">
          <div>
            <h2>Ledger trend</h2>
            <p>{data.range}. Earnings and expenses over time.</p>
          </div>
        </div>
      </div>
      <Chart
        key={`${period}-${data.range}`}
        options={options}
        series={[
          { name: 'Earnings', data: data.earningsSeries || [] },
          { name: 'Expenses', data: data.expensesSeries || [] },
        ]}
        type="area"
        height={312}
      />
      <div className="sa-legend">
        <div className="sa-legend-row">
          <i className="sa-swatch processing" />
          <span>Earnings</span>
          <b>{compact(data.earnings)} Rials</b>
        </div>
        <div className="sa-legend-row">
          <i className="sa-swatch pending" />
          <span>Expenses</span>
          <b>{compact(data.totalExpenses)} Rials</b>
        </div>
      </div>
    </section>
  )
}
