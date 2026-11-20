import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import { formatDate } from "../common/ListFilters";

function customerName(row) {
  return row?.user_id?.name || row?.customer_name || (row?.guest_user ? "Guest" : "N/A");
}

function statusClass(status) {
  const normalized = (status ?? "").toString().toLowerCase();
  if (normalized === "approved" || normalized === "success") return "bg-success";
  if (normalized === "rejected") return "bg-danger";
  if (normalized === "pending") return "bg-warning text-dark";
  return "bg-secondary";
}

export default function ViewReviewModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const close = () => dispatch(closeModal());

  return (
    <Modal show={isOpen} onHide={close} size="lg">
      <Modal.Header className="bg-primary">
        <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-white w-100 text-center">
          Review Details
        </Modal.Title>
        <Button onClick={close} className="btn-close text-white" variant="">
          <i className="fe fe-x"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        {data && (
          <Table striped bordered hover responsive className="mb-0">
            <tbody>
              <tr>
                <td className="fw-bold" style={{ width: 160 }}>Product</td>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {data?.product_id?.featured_image ? (
                      <img src={data.product_id.featured_image} alt={data?.product_id?.name || "Product"} height={56} />
                    ) : null}
                    <span>{data?.product_id?.name || "N/A"}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Customer</td>
                <td>{customerName(data)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Rating</td>
                <td>
                  <Box>
                    <Rating name="read-only" size="small" value={data?.star_rating || 0} readOnly />
                  </Box>
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Review</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{data?.text || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Status</td>
                <td>
                  <span className={`badge rounded-pill ${statusClass(data?.status)}`}>{data?.status || "N/A"}</span>
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Type</td>
                <td>{data?.type || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Created At</td>
                <td>{formatDate(data?.createdAt) || "N/A"}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
