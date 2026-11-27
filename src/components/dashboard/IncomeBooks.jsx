import { Link, useLocation } from 'react-router-dom'
import { base, compact } from './format'

function shownCount(value) {
  if (value === null || value === undefined || value === '') return 'NA'
  return Number(value).toLocaleString('en-US')
}

function shownMoney(value) {
  if (value === null || value === undefined || value === '') return 'NA'
  return compact(value)
}

function MoneyCell({ to, title, value, unit, note }) {
  const body = (
    <>
      <p>{title}</p>
      <strong>
        {value}
        {unit ? <span>{unit}</span> : null}
      </strong>
      <em>{note}</em>
    </>
  )
  if (!to) return <div>{body}</div>
  return <Link to={to}>{body}</Link>
}


export default function IncomeBooks({ data }) {
  const { search } = useLocation()
  const lang = new URLSearchParams(search).get('lang')
  const orders = (params = {}) => {
    const query = new URLSearchParams({ ...(lang ? { lang } : {}), ...params })
    return `${base}orders?${query}`
  }

  return (
    <>
      <div className="sa-books-head" id="sa-income">
        <div>
          <h2>Super Admin income</h2>
          <p>Money Vinova keeps.</p>
        </div>
      </div>
      <div className="sa-board-money sa-books-income">
        <MoneyCell
          to={orders()}
          title="Product sales"
          value={shownMoney(data.sales)}
          unit="Rials"
          note="Glasses, lenses, and accessories, after coupons."
        />
        <MoneyCell
          to={`${base}optometrist/memberships-plans`}
          title="Plan fees"
          value={shownMoney(data.membership)}
          unit="Rials"
          note="What optometrists pay for their plan."
        />
        <MoneyCell
          to={`${base}optometrist/memberships-plans`}
          title="Platform fee"
          value={shownMoney(data.platformFee)}
          unit="Rials"
          note="Vinova’s share of optometrist orders."
        />
        <MoneyCell
          to={`#`}
          title="Booking fees"
          value="NA"
          unit="Rials"
          note="Optometrist appointment booking fees."
        />
      </div>
      {/* Optometrist expenses */}
      <div className="sa-books-head">
        <div>
          <h2>Optometrist expenses</h2>
          <p>Paid back or owed to optometrists. Not Vinova earnings.</p>
        </div>
      </div>
      <div className="sa-board-money sa-books-opt-expenses">
          <MoneyCell
          title="Booking fees"
          value="NA"
          unit="Rials"
          note="NA appointments settled. Optometrist earnings from booking plans."
        />
        <MoneyCell
          to={`${base}optometrist/memberships-plans`}
          title="Optometrist commission"
          value={shownMoney(data.optometristCommission)}
          unit="Rials"
          note="Optometrist Take %. Not Vinova earnings."
        />
        <MoneyCell
          to={`${base}optometrist/withdrawal-request?status=Pending`}
          title="Optometrist withdrawal requests"
          value={shownCount(data.optometristWithdrawalCount)}
          unit="requests"
          note={`${shownMoney(data.optometristWithdrawals)} Rials optometrists asked to be paid`}
        />
        <MoneyCell
          to={`${base}optometrist/memberships-plans`}
          title="Optometrist discounts"
          value={shownMoney(data.optometristDiscount)}
          unit="Rials"
          note={`${shownCount(data.optometristDiscountUses)} times optometrist coupons applied. Give %. Not earnings.`}
        />
      </div>

      {/* Other expenses */}
      <div className="sa-books-head">
        <div>
          <h2>Other expenses</h2>
          <p>Refunds, discounts, and other deductions. Not Vinova earnings.</p>
        </div>
      </div>
      <div className="sa-board-money sa-books-expenses">
        <MoneyCell
          to={`${base}affiliate/withdrawal-request`}
          title="Affiliate commission"
          value={shownMoney(data.affiliateCommission)}
          unit="Rials"
          note="Affiliate Take %. Not Vinova earnings."
        />
        <MoneyCell
          to={`${base}affiliate/withdrawal-request?status=Pending`}
          title="Affiliate withdrawals waiting"
          value={shownCount(data.withdrawalCount)}
          unit="requests"
          note={`${shownMoney(data.attention?.withdrawals)} Rials affiliates asked to be paid`}
        />
        <MoneyCell
          to={`${base}affiliate/coupon-request`}
          title="Affiliate discounts"
          value={shownMoney(data.affiliateDiscount)}
          unit="Rials"
          note={`${shownCount(data.affiliateDiscountUses)} times affiliate coupons applied. Give %. Not earnings.`}
        />
      </div>
      <div className="sa-board-money sa-books-discounts">
        <MoneyCell
          to={orders({ status: 'refunded' })}
          title="Order payment refund"
          value={shownCount(data.refundCount)}
          unit="refunds"
          note={`${shownMoney(data.refunds)} Rials refunded on orders.`}
        />
        <MoneyCell
          to={`${base}coupons`}
          title="Coupon discounts"
          value={shownMoney(data.couponDiscount)}
          unit="Rials"
          note={`${shownCount(data.discountCount)} times store coupons applied. Not earnings.`}
        />
      </div>
    </>
  )
}
