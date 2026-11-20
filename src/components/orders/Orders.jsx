import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { OrdersDataTable } from "../../commondata/ordersdata";
import CommissionByOptometristDataTable from "../../commondata/commissionByOptometristDataTable";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default function Orders() {
  const summaryCards = [
    {
      id: 1,
      label: 'Total sales (orders)',
      value: '$0.00',
      icon: <MdOutlineAttachMoney size={22} />,
      iconBgClass: 'bg-secondary-transparent text-secondary',
    },
    {
      id: 2,
      label: 'Platform revenue',
      value: '$0.00',
      icon: <BsGraphUp size={22} />,
      iconBgClass: 'bg-primary-transparent text-primary',
    },
    {
      id: 3,
      label: 'Optometrist commissions',
      value: '$0.00',
      icon: <FaUser size={22} />,
      iconBgClass: 'bg-warning-transparent text-warning',
    },
  ]
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Orders"
                active="Orders"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <h4 className="fw-semibold">Revenue & Commissions</h4> */}
          {/* <h4 className="fw-semibold">Orders</h4> */}
          {/* <p className="mb-4">Referral-to-purchase: each order linked to a prescription records commission for the optometrist and platform fee. Percentages are set per plan and can be overridden per optometrist.</p>
          <Row className="justify-content-between mb-5">
            {summaryCards.map((card) => (
              <Col md={4} key={card.id}>
                <Card className="border-0 shadow-sm rounded-3 h-100">
                  <Card.Body className="d-flex align-items-center gap-3 py-3">
                    <div className={`rounded-3 p-2 flex-shrink-0 ${card.iconBgClass}`}>
                      {card.icon}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h5 className="mb-0 fw-bold number-font">{card.value}</h5>
                      <p className="mb-0 text-muted">{card.label}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card>
            <Card.Body className="data_table">
              <CommissionByOptometristDataTable />
            </Card.Body>
          </Card> */}
          <Card>
            <Card.Body className="data_table">
              <OrdersDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
