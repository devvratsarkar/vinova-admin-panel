import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MuiDataTable from '../common/MuiDataTable'
import { avatarStyle, base, compact, initials } from './format'

function PersonCell({ name, detail }) {
  return (
    <div className="sa-person">
      <span className="sa-avatar" style={avatarStyle(name)}>{initials(name)}</span>
      <span>
        {name}
        <small>{detail}</small>
      </span>
    </div>
  )
}

function RankCell({ index }) {
  return <span className={`sa-rank${index < 3 ? ' top' : ''}`}>{index + 1}</span>
}

const productColumns = [
  {
    id: 'product',
    label: 'Product',
    field: 'name',
    minWidth: 190,
    flex: 1.6,
    render: (product) => <span className="sa-product-name">{product.name}</span>,
  },
  {
    id: 'category',
    label: 'Category',
    field: 'category',
    minWidth: 120,
    sx: { color: '#64748b' },
  },
  {
    id: 'units',
    label: 'Units',
    numeric: true,
    minWidth: 80,
    flex: 0.7,
    render: (product) => product.units.toLocaleString('en-US'),
  },
  {
    id: 'revenue',
    label: 'Revenue',
    numeric: true,
    nowrap: true,
    minWidth: 140,
    render: (product) => `${compact(product.revenue)} Rials`,
  },
  {
    id: 'share',
    label: 'Share',
    minWidth: 110,
    flex: 0.8,
    render: (product) => (
      <div className="sa-meter" aria-hidden><i style={{ width: `${product.share}%` }} /></div>
    ),
  },
]

const optometristColumns = [
  {
    id: 'rank',
    label: '#',
    width: 54,
    render: (_person, index) => <RankCell index={index} />,
  },
  {
    id: 'practice',
    label: 'Practice',
    field: 'name',
    minWidth: 190,
    flex: 1.6,
    render: (person) => <PersonCell name={person.name} detail={person.city} />,
  },
  {
    id: 'visits',
    label: 'Visits',
    numeric: true,
    field: 'appointments',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    numeric: true,
    nowrap: true,
    render: (person) => compact(person.revenue),
  },
]

const affiliateColumns = [
  {
    id: 'rank',
    label: '#',
    width: 54,
    render: (_person, index) => <RankCell index={index} />,
  },
  {
    id: 'affiliate',
    label: 'Affiliate',
    field: 'name',
    minWidth: 180,
    flex: 1.5,
    render: (person) => <PersonCell name={person.name} detail={person.city} />,
  },
  {
    id: 'uses',
    label: 'Uses',
    numeric: true,
    render: (person) => person.uses.toLocaleString('en-US'),
  },
  {
    id: 'discount',
    label: 'Discount given',
    numeric: true,
    nowrap: true,
    render: (person) => `${compact(person.discount)} Rials`,
  },
  {
    id: 'commission',
    label: 'Commission',
    numeric: true,
    nowrap: true,
    render: (person) => `${compact(person.commission)} Rials`,
  },
]

export default function Rankings({ data }) {
  return (
    <>
      <Row className="g-3">
        <Col xl={7}>
          <section className="sa-card">
            <div className="sa-card-pad">
              <div className="sa-section-head">
                <div>
                  <h2>Top products</h2>
                  <p>Units and revenue across frames, lenses, and accessories</p>
                </div>
              </div>
            </div>
            <MuiDataTable
              compact
              columns={productColumns}
              data={data.products}
              getRowKey={(product) => product.name}
            />
          </section>
        </Col>
        <Col xl={5}>
          <section className="sa-card">
            <div className="sa-card-pad">
              <div className="sa-section-head">
                <div>
                  <h2>Top optometrists</h2>
                  <p>By appointments and collected revenue</p>
                </div>
              </div>
            </div>
            <MuiDataTable
              compact
              columns={optometristColumns}
              data={data.optometristBoard}
              getRowKey={(person) => person.name}
            />
          </section>
        </Col>
      </Row>
      <Row className="g-3 mt-0">
        <Col xs={12}>
          <section className="sa-card">
            <div className="sa-card-pad">
              <div className="sa-section-head">
                <div>
                  <h2>Top affiliates</h2>
                  <p>By coupon uses. Give is the customer discount. Take is their commission.</p>
                </div>
                <Link className="sa-link" to={`${base}affiliate/coupon-request`}>View requests</Link>
              </div>
            </div>
            <MuiDataTable
              columns={affiliateColumns}
              data={data.affiliateBoard}
              getRowKey={(person) => person.name}
            />
          </section>
        </Col>
      </Row>
    </>
  )
}
