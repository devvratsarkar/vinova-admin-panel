import { Link, useLocation } from 'react-router-dom'
import { IoStarOutline, IoMailOutline, IoBriefcaseOutline } from 'react-icons/io5'
import { FaUserMd } from 'react-icons/fa'
import { base, statusCount } from './format'

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
    </>
  )
}
