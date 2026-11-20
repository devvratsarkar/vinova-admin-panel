import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";

export default function ViewCustomer() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);

  // Format date helper function
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : "N/A";
  };

  return (
    <div>
      <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
        <Modal.Header className="bg-primary">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-white w-100 text-center">
            Customer Details
          </Modal.Title>
          <Button
            onClick={() => dispatch(closeModal())}
            className="btn-close text-white"
            variant=""
          >
            <i className="fe fe-x"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          {data && (
            <Table striped bordered hover responsive className="mb-0">
              <tbody>
                <tr>
                  <td className="fw-bold">Name</td>
                  <td>{data.name || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Username</td>
                  <td>{data.username || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Email</td>
                  <td>{data.email || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Phone Number</td>
                  <td>{data.phone_number || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Role</td>
                  <td>{data.role?.name || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Status</td>
                  <td>
                    <span className={data.status ? "text-success" : "text-danger"}>
                      {data.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Verified</td>
                  <td>
                    <span className={data.is_verified ? "text-success" : "text-warning"}>
                      {data.is_verified ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Vendor Status</td>
                  <td>
                    <span className={data.is_vendor ? "text-success" : "text-muted"}>
                      {data.is_vendor ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Vendor Verification</td>
                  <td>
                    <span className={data.vendor_verification ? "text-success" : "text-warning"}>
                      {data.vendor_verification ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => dispatch(closeModal())}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}