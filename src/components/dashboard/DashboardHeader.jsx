import { PERIODS } from './dashboardData'

export default function DashboardHeader({
  data,
  todayLabel,
  period,
  onPeriod,
  fromDate,
  toDate,
  today,
  dateError,
  onFromDate,
  onToDate,
  title = 'Dashboard',
}) {
  const fromMax = toDate && toDate < today ? toDate : today

  const fromInvalid = Boolean(fromDate && (fromDate > today || (toDate && fromDate > toDate)))
  const toInvalid = Boolean(toDate && (toDate > today || (fromDate && toDate < fromDate)))

  function clearFilters() {
    onPeriod('year')
    onFromDate('')
    onToDate('')
  }

  return (
    <>
      <header className="sa-top">
        <div>
          <div className="sa-kicker">
            <span className="sa-kicker-dot" />
            Super Admin
          </div>
          <h1>{title}</h1>
          <p>
            {[data?.range, 'Iran, UAE, and UK', todayLabel].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="sa-periods" role="tablist" aria-label="Date range">
          {PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={period === item.id}
              className={period === item.id ? 'is-on' : undefined}
              onClick={() => onPeriod(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      {period === 'custom' && (
        <div className="sa-custom">
          <div className="sa-custom-row">
            <label>
              <span>From</span>
              <input
                type="date"
                value={fromDate}
                max={fromMax}
                className={fromInvalid ? 'is-invalid' : undefined}
                onChange={(event) => onFromDate(event.target.value)}
              />
            </label>
            <label>
              <span>To</span>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                max={today}
                disabled={!fromDate}
                className={toInvalid ? 'is-invalid' : undefined}
                onChange={(event) => onToDate(event.target.value)}
              />
            </label>
            <button type="button" className="sa-clear-btn" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
          {dateError && <p className="sa-custom-error fw-normal">{dateError}</p>}
        </div>
      )}
    </>
  )
}
