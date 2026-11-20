import React from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { MdShoppingCart } from "react-icons/md";
import TooltipComponent from '../../commondata/TooltipComponent';
import { useGetAllOrdersQuery, useGetSingleOrderQuery, useMarkAsPaidMutation } from '../../redux/features/ordersAPIEndPoint';
import { useParams } from 'react-router-dom';
import Loader from '../../layouts/layoutcomponents/loader';
import { isPrescriptionPending, PrescriptionDetailCard, PrescriptionLaterChip, PrescriptionPendingBanner } from './PrescriptionLaterStatus';

export default function OrderDetailsData({ formik, singleOrder, showOrderEdit }) {
    const [markAsPaid, { isLoading }] = useMarkAsPaidMutation();
    const { id } = useParams();
    const { refetch } = useGetSingleOrderQuery(id);
    const { refetch: reFetchAll } = useGetAllOrdersQuery()

    const currencySymbol = singleOrder?.currency;
    const exchange_rate = singleOrder?.exchange_rate || 1;

    // Subtotal
    const subTotalWithoutExchangeRate =
        Array.isArray(singleOrder?.orderItems)
            ? singleOrder.orderItems.reduce((acc, item) => acc + (item?.total || 0), 0)
            : 0;

    const subTotal = subTotalWithoutExchangeRate * exchange_rate;
    const shipping_amount = (singleOrder?.shipping_amount || 0) * exchange_rate;
    const tax_amount = (singleOrder?.tax_amount || 0);
    const coupon_discount = (singleOrder?.coupon_discount || 0) * exchange_rate;
    const total_amount_paid = singleOrder?.total_amount || 0;

    const couponDiscountPercent = subTotal > 0 ? ((coupon_discount / subTotal) * 100).toFixed(2) : 0;
    const taxPercent = subTotal > 0 ? ((tax_amount / subTotal) * 100).toFixed(2) : 0;
    const hasPendingPrescription = Array.isArray(singleOrder?.orderItems)
        ? singleOrder.orderItems.some((item) => isPrescriptionPending(item))
        : false;
    const pendingPrescriptionCount = Array.isArray(singleOrder?.orderItems)
        ? singleOrder.orderItems.filter((item) => isPrescriptionPending(item)).length
        : 0;

    const getExtraChargesTooltip = (item) => {
        const parts = [];

        // LENS
        if (item?.lens?.name) {
            const isFree = item?.lens?.isFreeForAll || item?.lens_price === 0;
            const priceText = isFree ? ("Free") : `${currencySymbol}${item.lens_price * exchange_rate}`;
            parts.push(`<li><strong>${item.lens.name}</strong>: ${priceText}</li>`);
        }

        // FILTER + COLOR
        if (item?.filter?.name) {
            let filterText = item.filter.name;

            if (item?.color?.name) {
                filterText += ` with ${item.color.name} color`;
            }

            const filterBasePrice = item?.filter?.isFree ? 0 : (item?.filter_price || 0);
            const colorPrice = item?.color ? (item?.color?.price || 0) : 0;
            console.log('colorPrice', colorPrice);

            const total = filterBasePrice + colorPrice;

            const priceText = total === 0
                ? ("Free")
                : `${currencySymbol}${filterBasePrice * exchange_rate}${colorPrice ? ` + ${currencySymbol}${colorPrice * exchange_rate}` : ""}`;

            parts.push(`<li><strong>${filterText}</strong>: ${priceText}</li>`);
        }

        // LENS SIZE
        if (item?.lensSize?.name) {
            const isFree = item?.lensSize?.isFree || item?.lens_thickness_price === 0;
            const priceText = isFree ? ("Free") : `${currencySymbol}${item?.lens_thickness_price * exchange_rate}`;

            parts.push(`<li><strong>${item.lensSize.name}</strong>: ${priceText}</li>`);
        }

        return parts.length
            ? `<ul class="list-disc text-start ps-4 space-y-1">${parts.join("")}</ul>`
            : ("No extra charges");
    };

    const handleMarkAsPayment = async () => {
        try {
            const res = await markAsPaid({ orderId: singleOrder?._id });
            if (res?.data?.http_status_code === 200 || res?.data?.http_status_code === 200) {
                reFetchAll();
                refetch();
            }
        } catch (error) {
            console.log(`error during mark as paid - ${error}`);
        }
    }
    return (
        <>
            {isLoading && <Loader />}
            <Card>
                <Card.Body className="order_details_data">

                    {/* ORDER HEADER */}
                    <Row className="row_border row_bg gy-3 align-items-center">
                        <Col xs={12} lg={6}>
                            <MdShoppingCart className="fs-5" />
                            <span className='fw-bolder ms-1'>Order Id</span> - {singleOrder?.order_number}
                        </Col>

                        {showOrderEdit && (
                            <Col xs={12} lg={6} className="text-lg-end">
                                Status -
                                <select
                                    className="row_border mb-0 p-0 px-1 ms-2"
                                    name='status'
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
                        )}
                    </Row>

                    {/* PAYMENT STATUS */}
                    <Row className="row_border row_bg mt-3">
                        <Col xs={6}>
                            <span className='fw-bolder'>Payment Status</span> -{" "}
                            <span className="text-green">
                                {singleOrder?.payment_status === "Pending" ? "Failed" : singleOrder?.payment_status}
                            </span>
                        </Col>
                        <Col xs={6} className='text-end'>
                            {singleOrder?.payment_status === 'Unpaid' && <Button type="button" onClick={() => handleMarkAsPayment()}>Mark as Paid</Button>}
                        </Col>
                    </Row>

                    {hasPendingPrescription && (
                        <PrescriptionPendingBanner count={pendingPrescriptionCount} />
                    )}

                    {/* REASON BOX */}
                    {(formik.values.status === "rejected" || formik.values.status === "hold" || formik.values.status === "cancelled") && (
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
                                {singleOrder?.orderItems?.map((item, index) => {
                                    const inventoryPrice = (item?.variant?.selling_price || 0) * exchange_rate;
                                    const lensPrice = item?.lens?.isFreeForAll ? 0 : (item?.lens_price || 0) * exchange_rate;
                                    const filterPrice = item?.filter?.isFree ? 0 : (item?.filter_price || 0) * exchange_rate;
                                    const colorPrice = (item?.color?.price || 0) * exchange_rate;
                                    const sizePrice = item?.lensSize?.isFree ? 0 : (item?.lens_thickness_price || 0) * exchange_rate;

                                    const extraCharges = lensPrice + filterPrice + colorPrice + sizePrice;
                                    const totalSingleProductPrice = item?.total * exchange_rate;

                                    return (
                                        <>
                                            <tr key={index}>
                                                <td className="text-break">
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span>{item?.product?.name}</span>
                                                        {isPrescriptionPending(item) && <PrescriptionLaterChip />}
                                                    </div>
                                                </td>

                                                <td>
                                                    <img
                                                        src={item?.product?.featured_image}
                                                        alt={item?.product?.name}
                                                        className="img-fluid rounded"
                                                        style={{ width: "70px", height: "70px", objectFit: "contain" }}
                                                    />
                                                </td>

                                                <td>{item?.quantity}</td>
                                                <td>{currencySymbol}{inventoryPrice.toFixed(2)}</td>

                                                <td className="text-break">
                                                    {currencySymbol}{extraCharges}
                                                    {/* <TooltipComponent content={getExtraChargesTooltip(item)} /> */}
                                                    <TooltipComponent content={getExtraChargesTooltip(item)} position="left" />
                                                </td>

                                                <td>{currencySymbol}{totalSingleProductPrice.toFixed(2)}</td>
                                            </tr>
                                            {item?.prescription && (
                                                <tr>
                                                    <td colSpan={6} className="prescription-detail-cell">
                                                        <PrescriptionDetailCard later={isPrescriptionPending(item)}>

                                                        {/* MANUAL PRESCRIPTION */}
                                                        {item?.prescription?.manual && (
                                                            <div className="border bg-white px-3 mb-3">

                                                                {/* Table Header */}
                                                                <div className="row fw-semibold bg-light border-bottom py-2">
                                                                    <div className="col-3">Rx</div>
                                                                    <div className="col-3">SPH</div>
                                                                    <div className="col-3">CYL</div>
                                                                    <div className="col-3">AXIS</div>
                                                                </div>

                                                                {/* OD Row */}
                                                                <div className="row border-bottom py-2">
                                                                    <div className="col-3 fw-medium">O.D</div>
                                                                    <div className="col-3">{item?.prescription?.manual?.prescription?.right_eye_od?.sph}</div>
                                                                    <div className="col-3">{item?.prescription?.manual?.prescription?.right_eye_od?.cyl}</div>
                                                                    <div className="col-3">{item?.prescription?.manual?.prescription?.right_eye_od?.axis}</div>
                                                                </div>

                                                                {/* OS Row */}
                                                                <div className="row border-bottom py-2">
                                                                    <div className="col-3 fw-medium">O.S</div>
                                                                    <div className="col-3">{item?.prescription?.manual?.prescription?.left_eye_os?.sph}</div>
                                                                    <div className="col-3">{item?.prescription?.manual?.prescription?.left_eye_os?.cyl}</div>
                                                                    <div className="col-3">{item?.prescription?.manual?.prescription?.left_eye_os?.axis}</div>
                                                                </div>

                                                                {/* ADD */}
                                                                <div className="row border-bottom py-2">
                                                                    <div className="col-6 fw-medium">ADD</div>
                                                                    <div className="col-6 text-end">
                                                                        {item?.prescription?.manual?.prescription?.add}
                                                                    </div>
                                                                </div>

                                                                {/* PD 1 */}
                                                                <div className="row py-2">
                                                                    <div className="col-6 fw-medium">PD 1</div>
                                                                    <div className="col-6 text-end">
                                                                        {item?.prescription?.manual?.pupillary_distance?.values?.pd_value_1}
                                                                    </div>
                                                                </div>

                                                                {/* PD 2 (optional) */}
                                                                {item?.prescription?.manual?.pupillary_distance?.number_of_values === "2" && (
                                                                    <div className="row border-top py-2">
                                                                        <div className="col-6 fw-medium">PD 2</div>
                                                                        <div className="col-6 text-end">
                                                                            {item?.prescription?.manual?.pupillary_distance?.values?.pd_value_2}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            </div>
                                                        )}

                                                        {/* FILE PRESCRIPTION */}
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

                                        </>
                                    );
                                })}

                                {/* SUMMARY ROWS */}
                                <tr>
                                    <td>Subtotal</td>
                                    <td colSpan="5" className="text-end">
                                        {currencySymbol} {subTotal.toFixed(2)}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Shipping Charges</td>
                                    <td colSpan="5" className="text-end">
                                        +{currencySymbol} {shipping_amount}
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        Coupon Discount{' '}
                                        <span className="text-muted fw-normal">
                                            ({[singleOrder?.coupon_code, `${couponDiscountPercent}%`].filter(Boolean).join(', ')})
                                        </span>
                                    </td>
                                    <td colSpan="5" className="text-end">
                                        -{currencySymbol} {coupon_discount?.toFixed(2)}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Tax <span className="text-muted fw-normal">({taxPercent}%)</span></td>
                                    <td colSpan="5" className="text-end">
                                        +{currencySymbol} {tax_amount}
                                    </td>
                                </tr>

                                <tr className="border-top fw-bold">
                                    <td>Gross Total</td>
                                    <td colSpan="5" className="text-end">
                                        {currencySymbol} {total_amount_paid}
                                    </td>
                                </tr>

                            </tbody>
                        </Table>
                    </div>

                </Card.Body>
            </Card>
        </>
    );
}
