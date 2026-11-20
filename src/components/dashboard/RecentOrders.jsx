import { Link } from 'react-router-dom'
import MuiDataTable from '../common/MuiDataTable'
import { avatarStyle, base, initials, orderAmount } from './format'

const columns = [
  {
    id: 'order',
    label: 'Order ID',
    field: 'id',
    minWidth: 96,
    flex: 0.8,
    render: (order) => (
      <Link className="sa-id" to={`/order-detail/${order.id}`}>
        {order.order_number ?? order.id}
      </Link>
    ),
  },
  {
    id: 'customer',
    label: 'Customer',
    minWidth: 200,
    flex: 1.6,
    render: (order) => {
      const name = String(order.customer || '').trim()
      const phone = String(order.customer_phone || '').trim()
      const label = name || phone || '—'
      const mark = name ? initials(name) : (phone.replace(/\D/g, '').slice(0, 2) || '—')
      return (
        <div className="sa-person">
          <span className="sa-avatar" style={avatarStyle(label)}>{mark}</span>
          <span>
            {label}
            {name && phone ? <small>{phone}</small> : null}
          </span>
        </div>
      )
    },
  },
  {
    id: 'amount',
    label: 'Amount',
    numeric: true,
    nowrap: true,
    minWidth: 168,
    flex: 1.2,
    render: (order) => orderAmount(order),
  },
  {
    id: 'when',
    label: 'When',
    nowrap: true,
    minWidth: 84,
    flex: 0.7,
    sx: { color: '#64748b' },
    field: 'when',
  },
  {
    id: 'payment',
    label: 'Payment',
    minWidth: 108,
    flex: 0.9,
    render: (order) => <span className={`sa-pill ${order.payment.toLowerCase()}`}>{order.payment}</span>,
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 118,
    flex: 0.9,
    render: (order) => <span className={`sa-pill ${order.status.toLowerCase()}`}>{order.status}</span>,
  },
]

export default function RecentOrders({ orders }) {
  return (
    <section className="sa-card mb-3">
      <div className="sa-card-pad">
        <div className="sa-section-head">
          <div>
            <h2>Recent orders</h2>
            <p>Latest checkouts across all storefronts</p>
          </div>
          <Link className="sa-link" to={`${base}orders`}>View all</Link>
        </div>
      </div>
      <MuiDataTable columns={columns} data={orders} getRowKey={(order) => order.id} />
    </section>
  )
}
