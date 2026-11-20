import { Col, Row } from 'react-bootstrap'
import { compact } from './format'

export default function SnapshotRow({ data }) {
  return (
    <Row className="g-3 mb-3">
      <Col xl={6}>
        <section className="sa-card">
          <div className="sa-card-pad" style={{ paddingBottom: 18 }}>
            <div className="sa-section-head">
              <div>
                <h2>Sales mix</h2>
                <p>Share of catalogue sales</p>
              </div>
            </div>
            {data.catalogue.map((item) => (
              <div key={item.name} className="sa-bar">
                <div className="sa-bar-meta">
                  <span>{item.name}</span>
                  <span>{item.share}%</span>
                </div>
                <div className="sa-track"><i style={{ width: `${item.share}%` }} /></div>
                <small>{compact(item.amount)} Rials</small>
              </div>
            ))}
          </div>
        </section>
      </Col>
      <Col xl={6}>
        <section className="sa-card">
          <div className="sa-card-pad" style={{ paddingBottom: 18 }}>
            <div className="sa-section-head">
              <div>
                <h2>Storefronts</h2>
                <p>Earnings split, shown in Rials</p>
              </div>
            </div>
            {data.storefronts.map((item) => (
              <div key={item.code} className="sa-store">
                <img src={item.flag} alt="" width={28} height={20} />
                <div className="sa-store-body">
                  <div className="sa-store-meta">
                    <span>{item.name}</span>
                    <span>{item.share}%</span>
                  </div>
                  <div className="sa-track"><i style={{ width: `${item.share}%` }} /></div>
                  <small>{compact(item.amount)} Rials · {(Array.isArray(item.orders) ? item.orders.length : Number(item.orders) || 0).toLocaleString('en-US')} orders</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Col>
    </Row>
  )
}
