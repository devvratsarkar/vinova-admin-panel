import { useEffect, useMemo } from 'react'
import Form from 'react-bootstrap/Form'

const fieldStyle = { borderColor: '#e8edf3', borderRadius: 10, fontSize: 13, background: '#fff' }

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

export default function DateRangeFields({ fromDate, toDate, onFromDate, onToDate, onError }) {
  const today = useMemo(() => localToday(), [])
  const error = rangeError(fromDate, toDate, today)
  const fromMax = toDate && toDate < today ? toDate : today
  const fromInvalid = Boolean(fromDate && (fromDate > today || (toDate && fromDate > toDate)))
  const toInvalid = Boolean(toDate && (toDate > today || (fromDate && toDate < fromDate)))

  useEffect(() => {
    onError?.(error)
  }, [error, onError])

  return (
    <>
      <div>
        <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>From</div>
        <Form.Control
          type="date"
          aria-label="From date"
          value={fromDate}
          max={fromMax}
          onChange={(event) => {
            const value = event.target.value
            onFromDate(value)
            if (!value) onToDate('')
          }}
          style={{ ...fieldStyle, borderColor: fromInvalid ? '#dc3545' : '#e8edf3' }}
        />
      </div>
      <div>
        <div className="text-muted mb-1" style={{ fontSize: 12, fontWeight: 600 }}>To</div>
        <Form.Control
          type="date"
          aria-label="To date"
          value={toDate}
          min={fromDate || undefined}
          max={today}
          disabled={!fromDate}
          onChange={(event) => onToDate(event.target.value)}
          style={{ ...fieldStyle, background: fromDate ? '#fff' : '#eef2f6', borderColor: toInvalid ? '#dc3545' : '#e8edf3' }}
        />
      </div>
    </>
  )
}
