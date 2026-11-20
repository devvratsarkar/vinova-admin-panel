import React from "react";
import { Button, Modal } from "react-bootstrap";
import productImage from "../../assets/images/dashboard/inventory.png";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import { useGetSingleCartQuery } from "../../redux/features/cartAPIEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";
import moment from "moment";

export default function ViewCart() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);

  const { data: singleData, isLoading } = useGetSingleCartQuery(data?._id);

  const viewCartData = singleData?.data || null;

  console.log("viewCartData", viewCartData?.user?.email)

  return (
    <>
      {isLoading && <Loader />}
      <Modal show={isOpen} size="xl" className="cart_modal">
        <Modal.Header className="">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Cart Details
          </Modal.Title>
          <Button
            onClick={() => dispatch(closeModal())}
            className="btn-close text-dark"
            variant=""
          >
            <i className="fe fe-x"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center border-bottom border-dark pb-4">
            <p className="text-start">
              Customer Name -{" "}
              {viewCartData?.user
                ? viewCartData.user.name
                  ? viewCartData.user.name
                  : viewCartData.user._id
                    ? "N/A"
                    : "Guest User"
                : "Guest User"}
            </p>
            <p className="text-start">
              Email - {viewCartData?.user?.email || "N/A"}
            </p>
            <p className="text-start">
              Phone No. -{" "}
              {viewCartData?.user?.phone_number
                ? viewCartData.user.phone_number
                : "N/A"}
            </p>
          </div>
          <p className="my-5 text-start fs-5 mb-0">Products</p>
          <table className="table text-nowrap text-md-nowrap mg-b-0">
            <thead className="border-bottom border-dark">
              <tr>
                <th className="text-start">Product Name</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Single Price</th>
                <th>Lens Price</th>
                <th>Filter Price</th>
                <th>Lens Thickness Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {viewCartData?.orderItems?.map((item, index) => (
                <tr className="border-bottom border-muted" key={index}>
                  <td>{item?.product?.name || "N/A"}</td>
                  <td>
                    <img
                      src={item?.product?.featured_image || productImage}
                      alt={item?.product?.name || "Product Image"}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{item?.quantity || 0}</td>
                  <td>
                    {/* {viewCartData?.currencyCode} */}
                    {" "}
                    {Number(item?.single_price || 0).toFixed(2)}
                  </td>
                  <td>
                    {/* {viewCartData?.currencyCode} */}
                    {" "}
                    {Number(item?.lens_price || 0).toFixed(2)}
                  </td>
                  <td>
                    {/* {viewCartData?.currencyCode} */}
                    {" "}
                    {Number(item?.filter_price || 0).toFixed(2)}
                  </td>
                  <td>
                    {/* {viewCartData?.currencyCode}   */}
                    {" "}
                    {Number(item?.lens_thickness_price || 0).toFixed(2)}
                  </td>
                  <td>
                    {/* {viewCartData?.currencyCode}x */}
                    {" "}
                    {Number(item?.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td>Sub Total</td>
                <td colSpan={6}></td>
                <td>
                  {viewCartData?.currencyCode}
                  {" "}
                  {Number(viewCartData?.sub_total || 0).toFixed(2)}
                </td>
              </tr> */}
              {viewCartData?.discount_amount > 0 && (
                <tr>
                  <td>Discount Amount</td>
                  <td colSpan={6}></td>
                  <td>
                    {/* {viewCartData?.currencyCode} */}
                    {" "}
                    {Number(viewCartData?.discount_amount || 0).toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="border-bottom border-muted">
                <td className="text-success">Grand Total</td>
                <td colSpan={6}></td>
                <td className="text-success">
                  {/* {viewCartData?.currencyCode} */}
                  {" "}
                  {Number(viewCartData?.total_amount || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
}