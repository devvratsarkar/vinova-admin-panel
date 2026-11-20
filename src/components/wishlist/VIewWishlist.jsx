import React from "react";
import { Button, Modal, Table, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";

const getUserName = (data) => {
  if (typeof data?.user === "object" && data?.user !== null) {
    return data.user.name || "N/A";
  }
  return data?.user || "Guest";
};

const getUserEmail = (data) => {
  if (typeof data?.user === "object" && data?.user !== null) {
    return data.user.email || "N/A";
  }
  return "N/A";
};

export default function ViewWishlist() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const product = data?.product;
  const inventory = product?.Inventory || [];

  return (
    <Modal show={isOpen} size="lg" centered scrollable>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title className="w-100 text-center">💖 Wishlist Details</Modal.Title>
        <Button
          onClick={() => dispatch(closeModal())}
          className="btn-close btn-close-white"
          variant=""
        ></Button>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <section className="mb-4">
          <h5 className="border-bottom pb-2">👤 User Information</h5>
          <Table bordered responsive>
            <tbody>
              <tr>
                <td><strong>Name</strong></td>
                <td>{getUserName(data)}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>{getUserEmail(data)}</td>
              </tr>
              {data?.guest_user && (
                <tr>
                  <td><strong>Guest ID</strong></td>
                  <td>{data.guest_user}</td>
                </tr>
              )}
              {typeof data?.user === "object" && data?.user !== null && (
                <>
                  <tr>
                    <td><strong>Phone</strong></td>
                    <td>{data.user.phone_number || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>
                      <Badge bg={data.user.status ? "success" : "secondary"}>
                        {data.user.status ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td><strong>Wishlist ID</strong></td>
                <td>{data?.id || "N/A"}</td>
              </tr>
            </tbody>
          </Table>
        </section>

        <section className="mb-4">
          <h5 className="border-bottom pb-2">📦 Product Information</h5>
          <Table bordered responsive>
            <tbody>
              <tr>
                <td><strong>Product Name</strong></td>
                <td>{product?.name || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Type</strong></td>
                <td>{data?.type || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Short Description</strong></td>
                <td dangerouslySetInnerHTML={{ __html: product?.short_desc || product?.short_description || "N/A" }} />
              </tr>
              <tr>
                <td><strong>Gender</strong></td>
                <td>{product?.gender || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Material</strong></td>
                <td>{product?.material || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Added to Wishlist</strong></td>
                <td>{data?.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}</td>
              </tr>
            </tbody>
          </Table>
        </section>

        <section>
          <h5 className="border-bottom pb-2">💰 Inventory / Pricing</h5>
          {inventory.length > 0 ? (
            <Table bordered responsive striped hover>
              <thead>
                <tr>
                  <th>Variant</th>
                  <th>Size</th>
                  <th>Selling Price</th>
                  <th>MRP</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>{item.variant || "N/A"}</td>
                    <td>{item.size || "N/A"}</td>
                    <td>₹{item.selling_price}</td>
                    <td>₹{item.mrp}</td>
                    <td>{item.stock_quantity ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No inventory information available.</p>
          )}
        </section>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
