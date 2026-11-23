import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { IoWalletOutline, IoReceiptOutline, IoPeopleOutline, IoTrendingUpOutline, IoTrendingDownOutline } from 'react-icons/io5'
import { FaUserMd } from 'react-icons/fa'
import { base, compact } from './format'

function Trend({ text, featured }) {
  const down = String(text).trim().startsWith('-')
  const Icon = down ? IoTrendingDownOutline : IoTrendingUpOutline
  return (
    <span className={`sa-delta${down ? ' down' : ''}${featured ? ' is-on-navy' : ''}`}>
      <Icon size={13} aria-hidden />
      {text}
    </span>
  )
}

export function Kpi({ featured, icon, label, value, unit, trend, hint, to }) {
  const body = (
    <>
      <div className="sa-kpi-top">
        <span className="sa-kpi-icon">{icon}</span>
        {trend ? <Trend text={trend} featured={featured} /> : <span />}
      </div>
      <p className="sa-kpi-label">{label}</p>
      <p className="sa-kpi-value">
        {value}
        {unit ? <span>{unit}</span> : null}
      </p>
      <p className="sa-kpi-sub">{hint}</p>
    </>
  )
  const className = `sa-kpi${featured ? ' is-featured' : ''}`
  if (!to) return <article className={className}>{body}</article>
  if (to.startsWith('#')) {
    return (
      <a
        href={to}
        className={className}
        onClick={(event) => {
          event.preventDefault()
          document.querySelector(to)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        {body}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {body}
    </Link>
  )
}

export default function KpiRow({ data }) {
  return (
    <Row className="g-3 mb-3">
      <Col xs={12} md={6} xl={3}>
        <Kpi
          featured
          icon={<IoWalletOutline size={18} />}
          label="Earnings"
          value={compact(data.earnings)}
          unit="Rials"
          trend={data.earningsTrend}
          hint="Money Vinova keeps"
          to={`${base}ledger`}
        />
      </Col>
      <Col xs={12} md={6} xl={3}>
        <Kpi
          icon={<IoReceiptOutline size={18} />}
          label="Orders"
          value={data.orders.toLocaleString('en-US')}
          trend={data.ordersTrend}
          hint="Orders placed"
          to={`${base}orders`}
        />
      </Col>
      <Col xs={12} md={6} xl={3}>
        <Kpi
          icon={<FaUserMd size={16} />}
          label="Optometrists"
          value={data.optometrists}
          trend={data.optometristTrend}
          hint={`${data.activeOptometrists} are active`}
          to={`${base}optometrist/enquiry`}
        />
      </Col>
      <Col xs={12} md={6} xl={3}>
        <Kpi
          icon={<IoPeopleOutline size={18} />}
          label="Affiliates"
          value={data.affiliates}
          hint={`${data.couponRequests} waiting for approval`}
          to={`${base}affiliate/coupon-request`}
        />
      </Col>
    </Row>
  )
}
