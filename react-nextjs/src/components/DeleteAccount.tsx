import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";

const DeleteAccount: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleDelete = () => {
        setError("");
    };

    return (
        <div>
            <hr />
            <h3>Delete Account</h3>
            <p style={{ color: "red" }}>
                ⚠⚠⚠ Warning: This action is permanent and cannot be undone! ⚠⚠⚠
            </p>

            <Button variant="danger" onClick={() => setShowModal(true)}>
                Delete My Account
            </Button>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
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
        </div>
    );
};

export default DeleteAccount;
