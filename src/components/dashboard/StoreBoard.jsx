import { Link, useLocation } from 'react-router-dom'
import { IoStarOutline, IoMailOutline, IoBriefcaseOutline } from 'react-icons/io5'
import { FaUserMd } from 'react-icons/fa'
import { base, compact, statusCount } from './format'

function Fact({ label, value, to }) {
  const body = (
    <>
      <span>{label}</span>
      <strong>{value}</strong>
    </>
  )
  if (!to) return <div>{body}</div>
  return <Link to={to}>{body}</Link>
}

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

const STORE_ACTIVITY = [
  { title: 'Appointments', value: '48', unit: 'booked', note: 'Store visits booked by customers. Sample.' },
  { title: 'Prescriptions', value: '31', unit: 'saved', note: 'Uploaded or typed on the store. Sample.' },
  { title: 'Messages', value: '7', unit: 'open', note: 'Customer messages waiting for a reply. Sample.' },
]

export default function StoreBoard({ data }) {
  const { search } = useLocation()
  const lang = new URLSearchParams(search).get('lang')
  const orders = (params = {}) => {
    const query = new URLSearchParams({ ...(lang ? { lang } : {}), ...params })
    return `${base}orders?${query}`
  }

  return (
    <>
    <section className="sa-card sa-board">
      <div className="sa-board-grid">
        <div className="sa-board-col">
          <h2><Link to="/customer-list">Customers</Link></h2>
          <p className="sa-stat-lead">{data.totalCustomers.toLocaleString('en-US')}</p>
          <p className="sa-board-note">Accounts on the store</p>
          <div className="sa-board-rows">
            <Fact label="New this period" value={data.newCustomers.toLocaleString('en-US')} />
            <Fact label="Bought this period" value={data.customers.toLocaleString('en-US')} />
            <Fact label="Open carts" value={data.openCarts.toLocaleString('en-US')} to={`${base}cart`} />
            <Fact label="Wishlists" value={data.wishlists.toLocaleString('en-US')} to={`${base}wishlist`} />
          </div>
        </div>
        <div className="sa-board-col">
          <h2><Link to={orders()}>Orders</Link></h2>
          <Link to={orders({ status: 'pending' })} className="sa-stat-link">
            <p className="sa-stat-lead">{statusCount(data.status, 'Pending').toLocaleString('en-US')}</p>
            <p className="sa-board-note">Pending. Placed, not accepted yet.</p>
          </Link>
          <div className="sa-board-rows">
            <Fact label="Cancelled" value={statusCount(data.status, 'Cancelled').toLocaleString('en-US')} to={orders({ status: 'cancelled' })} />
            <Fact label="Home try-on" value={data.htoOrders.toLocaleString('en-US')} to={`${base}hto-orders`} />
            <Fact label="Rejected" value={data.rejectedOrders.toLocaleString('en-US')} to={orders({ status: 'rejected' })} />
            <Fact label="On hold" value={data.holdOrders.toLocaleString('en-US')} to={orders({ status: 'hold' })} />
            <Fact label="Unpaid" value={data.attention.unpaid.toLocaleString('en-US')} to={orders({ payment_status: 'Unpaid' })} />
            <Fact label="Disputes" value={data.attention.disputes.toLocaleString('en-US')} to="/dispute" />
          </div>
        </div>
        <div className="sa-board-col">
          <h2><Link to={`${base}coupons`}>Coupons</Link></h2>
          <p className="sa-stat-lead">{data.coupons.toLocaleString('en-US')}</p>
          <p className="sa-board-note">Codes customers can use</p>
          <div className="sa-board-rows">
            <Fact label="Active" value={data.activeCoupons.toLocaleString('en-US')} to={`${base}coupons`} />
            <Fact label="Times used" value={data.couponsUsed.toLocaleString('en-US')} to={`${base}coupons`} />
          </div>
        </div>
        <div className="sa-board-col">
          <h2><Link to={`${base}catalogue/frames`}>Catalogue</Link></h2>
          <p className="sa-stat-lead">{(data.frames + data.contactLenses + data.accessories).toLocaleString('en-US')}</p>
          <p className="sa-board-note">Products live in the store</p>
          <div className="sa-board-rows">
            <Fact label="Frames" value={data.frames.toLocaleString('en-US')} to={`${base}catalogue/frames`} />
            <Fact label="Contact lenses" value={data.contactLenses.toLocaleString('en-US')} to={`${base}catalogue/contact-lenses`} />
            <Fact label="Accessories" value={data.accessories.toLocaleString('en-US')} to={`${base}catalogue/accessories`} />
          </div>
        </div>
      </div>
      <div className="sa-books-head" id="sa-income">
        <div>
          <h2>Super Admin income</h2>
          <p>Money Vinova keeps. These three add up to the total.</p>
        </div>
        <strong>{shownMoney(data.earnings)} Rials</strong>
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
      </div>
      <div className="sa-books-head">
        <div>
          <h2>Expenses</h2>
          <p>Paid back, given away, or owed. Not Vinova earnings.</p>
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
          title="Withdrawals waiting"
          value={shownCount(data.withdrawalCount)}
          unit="requests"
          note={`${shownMoney(data.attention?.withdrawals)} Rials they asked to be paid`}
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
          value="NA"
          unit="requests"
          note="Not available yet"
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
          note={`${shownCount(data.discountCount)} discounts given. Store coupons. Not earnings.`}
        />
        <MoneyCell
          to={`${base}optometrist/memberships-plans`}
          title="Optometrist discounts"
          value={shownMoney(data.optometristDiscount)}
          unit="Rials"
          note={`${shownCount(data.optometristDiscountUses)} times optometrist coupons applied. Give %. Not earnings.`}
        />
        <MoneyCell
          to={`${base}affiliate/coupon-request`}
          title="Affiliate discounts"
          value={shownMoney(data.affiliateDiscount)}
          unit="Rials"
          note={`${shownCount(data.affiliateDiscountUses)} times affiliate coupons applied. Give %. Not earnings.`}
        />
      </div>
    </section>
    <section className="sa-card sa-board sa-board-alerts">
      <div className="sa-board-extra">
        <Link to="/reviews">
          <span className="sa-alert-icon"><IoStarOutline size={16} /></span>
          <span>
            <strong>{data.reviewsPending.toLocaleString('en-US')}</strong>
            <em>Reviews to check</em>
          </span>
        </Link>
        <Link to="/contact-enquiries">
          <span className="sa-alert-icon"><IoMailOutline size={16} /></span>
          <span>
            <strong>{data.contactEnquiries.toLocaleString('en-US')}</strong>
            <em>Contact enquiries</em>
          </span>
        </Link>
        <Link to="/job-application-enquiries">
          <span className="sa-alert-icon"><IoBriefcaseOutline size={16} /></span>
          <span>
            <strong>{data.jobApplications.toLocaleString('en-US')}</strong>
            <em>Job applications</em>
          </span>
        </Link>
        <Link to={`${base}optometrist/enquiry`}>
          <span className="sa-alert-icon"><FaUserMd size={15} /></span>
          <span>
            <strong>{data.attention.applications.toLocaleString('en-US')}</strong>
            <em>Optometrist requests</em>
          </span>
        </Link>
      </div>
    </section>
    <section className="sa-card sa-board">
      <div className="sa-books-head">
        <div>
          <h2>Store activity <span className="sa-sample">Sample</span></h2>
          <p>On the storefront, and not in the dashboard totals yet.</p>
        </div>
      </div>
      <div className="sa-board-money sa-books-activity">
        {STORE_ACTIVITY.map((item) => (
          <MoneyCell key={item.title} {...item} />
        ))}
        <MoneyCell
          to={`${base}stocks/inventory`}
          title="Low stock"
          value={shownCount(data.attention?.lowStock)}
          unit="products"
          note="Products at or under the stock line."
        />
      </div>
    </section>
    </>
  )
}
