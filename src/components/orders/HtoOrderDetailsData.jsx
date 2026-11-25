import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { MdShoppingCart } from "react-icons/md";
import TooltipComponent from "../../commondata/TooltipComponent";
import { isPrescriptionPending, PrescriptionDetailCard, PrescriptionLaterChip, PrescriptionPendingBanner } from "./PrescriptionLaterStatus";

function capitalizeFirstLetter(word) {
  return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
}

const getOrderStatusLabel = (status) => {
  const labels = {
    pending: "Order Placed",
    accepted: "Order Accepted",
    processed: "Order Processed",
    packed: "Order Packed",
    dispatched: "Order Dispatched",
    delivered: "Order Delivered",
  };
  return labels[status] || capitalizeFirstLetter(status);
};

export default function HtoOrderDetailsData({ singleOrder, showOrderEdit, formik }) {
  const currencySymbol = singleOrder?.currency || "";
  const exchange_rate = singleOrder?.exchange_rate || 1;

  const subTotalWithoutExchangeRate = Array.isArray(singleOrder?.orderItems)
    ? singleOrder.orderItems.reduce((acc, item) => acc + (item?.total || 0), 0)
    : 0;

  const subTotal = subTotalWithoutExchangeRate * exchange_rate;
  const shipping_amount = singleOrder?.shipping_amount ?? 0;
  const tax_amount = singleOrder?.tax_amount || 0;
  const total_amount_paid = singleOrder?.total_amount || 0;

  const taxPercent = total_amount_paid > 0 ? ((tax_amount / total_amount_paid) * 100).toFixed(1) : 0;

  const totalProductsInCart = singleOrder?.item_count ?? singleOrder?.orderItems?.length ?? 0;
  const hasPendingPrescription = Array.isArray(singleOrder?.orderItems)
    ? singleOrder.orderItems.some((item) => isPrescriptionPending(item))
    : false;
  const pendingPrescriptionCount = Array.isArray(singleOrder?.orderItems)
    ? singleOrder.orderItems.filter((item) => isPrescriptionPending(item)).length
    : 0;

  const highestTotalPrice = Array.isArray(singleOrder?.orderItems) && singleOrder.orderItems.length
    ? Math.max(...singleOrder.orderItems.map((item) => item?.total ?? 0))
    : 0;
  const depositedPayment = highestTotalPrice * exchange_rate;

  const formatAmount = (value) =>
    (Number(value) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getExtraChargesTooltip = (item) => {
    const parts = [];

    if (item?.lens?.name) {
      const isFree = item?.lens?.isFreeForAll || item?.lens_price === 0;
      const priceText = isFree ? "Free" : `${currencySymbol}${item.lens_price * exchange_rate}`;
      parts.push(`<li><strong>${item.lens.name}</strong>: ${priceText}</li>`);
    }

    if (item?.filter?.name) {
      let filterText = item.filter.name;

      if (item?.color?.name) {
        filterText += ` with ${item.color.name} color`;
      }

      const filterBasePrice = item?.filter?.isFree ? 0 : (item?.filter_price || 0);
      const colorPrice = item?.color ? (item?.color?.price || 0) : 0;

      const total = filterBasePrice + colorPrice;

      const priceText = total === 0
        ? "Free"
        : `${currencySymbol}${filterBasePrice * exchange_rate}${colorPrice ? ` + ${currencySymbol}${colorPrice * exchange_rate}` : ""}`;

      parts.push(`<li><strong>${filterText}</strong>: ${priceText}</li>`);
    }

    if (item?.lensSize?.name) {
      const isFree = item?.lensSize?.isFree || item?.lens_thickness_price === 0;
      const priceText = isFree ? "Free" : `${currencySymbol}${item?.lens_thickness_price * exchange_rate}`;

      parts.push(`<li><strong>${item.lensSize.name}</strong>: ${priceText}</li>`);
    }

    return parts.length
      ? `<ul class="list-disc text-start ps-4 space-y-1">${parts.join("")}</ul>`
      : "No extra charges";
  };

  return (
    <Card>
      <Card.Body className="order_details_data">
        {/* ORDER HEADER */}
        <Row className="row_border row_bg gy-3 align-items-center">
          <Col xs={12} lg={6}>
            <MdShoppingCart className="fs-5" />
            <span className="fw-bolder ms-1">Order Id</span> - {singleOrder?.order_number || singleOrder?.id || singleOrder?._id || "N/A"}
          </Col>

          {showOrderEdit && formik ? (
            <Col xs={12} lg={6} className="text-lg-end">
              Status -
              <select
                className="row_border mb-0 p-0 px-1 ms-2"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="pending">Order Placed</option>
                <option value="accepted">Order Accepted</option>
                <option value="processed">Order Processed</option>
                <option value="packed">Order Packed</option>
                <option value="dispatched">Order Dispatched</option>
                <option value="delivered">Order Delivered</option>
                <option value="rejected">Rejected</option>
                <option value="hold">Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {formik.errors.status && formik.touched.status && (
                <p className="error">{formik.errors.status}</p>
              )}
            </Col>
          ) : (
            <Col xs={12} lg={6} className="text-lg-end">
              <span className="fw-bolder">Status</span> -{" "}
              {singleOrder?.status ? getOrderStatusLabel(singleOrder.status) : "N/A"}
            </Col>
          )}
        </Row>

        {/* PAYMENT STATUS */}
        <Row className="row_border row_bg mt-3">
          <Col xs={12}>
            <span className="fw-bolder">Payment Status</span> -{" "}
            <span className="text-green">
              {singleOrder?.payment_status === "Pending" ? "Failed" : (singleOrder?.payment_status || "N/A")}
            </span>
          </Col>
        </Row>

        {hasPendingPrescription && (
          <PrescriptionPendingBanner count={pendingPrescriptionCount} />
        )}

        {/* REASON BOX */}
        {formik && (formik.values.status === "rejected" || formik.values.status === "hold" || formik.values.status === "cancelled") && (
          <Row className="my-3">
            <label>Reason For Rejection/Hold/Cancelation</label>
            <textarea
              className="row_border"
              name="remarks"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.remarks}
            ></textarea>

            {formik.errors.remarks && formik.touched.remarks && (
              <p className="error">{formik.errors.remarks}</p>
            )}
          </Row>
        )}

        {/* TABLE WRAPPER FOR RESPONSIVE SCROLL */}
        <div className="table-responsive mt-4">
          <Table className="border-bottom align-middle text-nowrap">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Image</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Extra Charges</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {singleOrder?.orderItems?.length > 0 ? (
                singleOrder.orderItems.map((item, index) => {
                  const inventoryPrice = (item?.variant?.selling_price || 0) * exchange_rate;
                  const lensPrice = item?.lens?.isFreeForAll ? 0 : (item?.lens_price || 0) * exchange_rate;
                  const filterPrice = item?.filter?.isFree ? 0 : (item?.filter_price || 0) * exchange_rate;
                  const colorPrice = (item?.color?.price || 0) * exchange_rate;
                  const sizePrice = item?.lensSize?.isFree ? 0 : (item?.lens_thickness_price || 0) * exchange_rate;

                  const extraCharges = lensPrice + filterPrice + colorPrice + sizePrice;
                  const totalSingleProductPrice = (item?.total || 0) * exchange_rate;

                  return (
                    <React.Fragment key={item?._id || item?.id || index}>
                    <tr>
                      <td className="text-break">
                        <div className="d-flex flex-column align-items-start gap-2">
                          <span>{item?.product?.name || "N/A"}</span>
                          {isPrescriptionPending(item) && <PrescriptionLaterChip />}
                        </div>
                      </td>

                      <td>
                        {item?.product?.featured_image ? (
                          <img
                            src={item?.variant?.image?.[0] || item?.product?.featured_image}
                            alt={item?.product?.name}
                            className="img-fluid rounded"
                            style={{ width: "70px", height: "70px", objectFit: "contain" }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td>{item?.quantity || 1}</td>
                      <td>{currencySymbol}{inventoryPrice.toFixed(2)}</td>

                      <td className="text-break">
                        {currencySymbol}{extraCharges}
                        <TooltipComponent content={getExtraChargesTooltip(item)} position="left" />
                      </td>

                      <td>{currencySymbol}{totalSingleProductPrice.toFixed(2)}</td>
                    </tr>
                    {item?.prescription && (
                      <tr>
                        <td colSpan={6} className="prescription-detail-cell">
                          <PrescriptionDetailCard later={isPrescriptionPending(item)}>
                          {item?.prescription?.file && (
                            <div className="prescription-file-thumb">
                              <img
                                src={item?.prescription?.file}
                                alt="Prescription"
                              />
                              <a
                                href={item?.prescription?.file}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i className="bi bi-eye fs-6 text-primary"></i>
                              </a>
                            </div>
                          )}
                          </PrescriptionDetailCard>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* BILLING SUMMARY */}
        <div className="billing_summary mt-4">
          <h6 className="text-end text-primary fw-bold mb-4">Billing Summary</h6>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Total Products In The Shopping Cart</span>
            <span>{totalProductsInCart}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Total Items (MRP)</span>
            <span className="text-green text-decoration-line-through">
              {currencySymbol} {formatAmount(subTotal)}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="d-flex align-items-center gap-1">
              Deposited Payment (MRP)
              <TooltipComponent
                content="The payment amount is calculated based on the highest price of the item."
                position="right"
              />
            </span>
            <span className="text-green">
              {currencySymbol} {formatAmount(depositedPayment)}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Shipping Cost</span>
            <span>{currencySymbol} {formatAmount(shipping_amount)}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>
              Tax Amount <span className="text-muted">({taxPercent}%)</span>
            </span>
            <span>{currencySymbol} {formatAmount(tax_amount)}</span>
          </div>

          <hr className="border-top" style={{ borderStyle: "dashed" }} />

          <div className="d-flex justify-content-between align-items-center fw-bold mb-3">
            <span>Total Amount Paid</span>
            <span>{currencySymbol} {formatAmount(total_amount_paid)}</span>
          </div>

          <hr className="border-top" style={{ borderStyle: "dashed" }} />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Payment Mode</span>
            <span>{singleOrder?.payment_method || "N/A"}</span>
          </div>

          <hr className="border-top" style={{ borderStyle: "dashed" }} />

        </div>
      </Card.Body>
    </Card>
  );
}
