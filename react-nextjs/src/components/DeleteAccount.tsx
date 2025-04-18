import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

const DeleteAccount: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  apiClient.interceptors.request.use((config) => {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_token"))?.split("=")[1];
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  });

  const handleDelete = async () => {
      await apiClient.delete("/api/v1/user")
      .then(() => {
        router.push("/");
      })
      .catch(error => {
        alert("delete failed");
      })
  };
  

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <div className="p-4 border rounded shadow bg-light text-center">
            <h3>Delete Account</h3>
            <p className="text-danger fw-bold">
              ⚠⚠⚠ Warning: This action is permanent and cannot be undone! ⚠⚠⚠
            </p>

            <Button variant="danger" onClick={() => setShowModal(true)}>
              Delete My Account
            </Button>
          </div>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          {error && <p className="text-danger fw-bold">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteAccount;
