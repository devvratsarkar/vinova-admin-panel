import { Link } from 'react-router-dom'
import { base, compact, share } from './format'

export default function EarningsMix({ data }) {
  const parts = [
    {
      label: 'Product sales',
      amount: data.sales,
      note: 'Glasses, lenses, and accessories, after coupons',
      color: '#24306e',
      to: `${base}orders`,
    },
    {
      label: 'Plan fees',
      amount: data.membership,
      note: 'What optometrists pay for their plan',
      color: '#0f766e',
      to: `${base}optometrist/memberships-plans`,
    },
    {
      label: 'Platform fee',
      amount: data.platformFee,
      note: 'Vinova’s share of optometrist orders',
      color: '#8b95e8',
      to: `${base}optometrist/memberships-plans`,
    },
  ]

  return (
    <section className="sa-card sa-mix">
      <div className="sa-card-pad">
        <div className="sa-section-head">
          <div>
            <h2>Where earnings come from</h2>
            <p>These three add up to {compact(data.earnings)} Rials.</p>
          </div>
        </div>
        <div className="sa-mix-bar" aria-hidden>
          {parts.map((part) => (
            <i key={part.label} style={{ flex: part.amount, background: part.color }} />
          ))}
        </div>
      </div>
      <div className="sa-mix-parts">
        {parts.map((part) => (
          <Link key={part.label} to={part.to}>
            <span className="sa-mix-label">
              <i className="sa-pip" style={{ background: part.color }} />
              {part.label}
              <em>{share(part.amount, data.earnings)}</em>
            </span>
            <strong>{compact(part.amount)} Rials</strong>
            <span>{part.note}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
