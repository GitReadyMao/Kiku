import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface UsernameFormProps {
  currentUsername: string;
  onUpdateUsername: (newUsername: string) => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ currentUsername, onUpdateUsername }) => {
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newUsername.trim() === "" || confirmUsername.trim() === "") {
      setError("Please fill in both fields.");
      return;
    }

    if (newUsername !== confirmUsername) {
      setError("Usernames do not match.");
      return;
    }

    onUpdateUsername(newUsername);
    setNewUsername("");
    setConfirmUsername("");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form onSubmit={handleUsernameChange} className="p-4 border rounded shadow bg-light">
          <h2 className="text-center mb-4">Change Username</h2>
            <Form.Group className="mb-3" controlId="formCurrentUsername">
              <Form.Label>Current Username</Form.Label>
              <Form.Control type="text" value={currentUsername} disabled />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewUsername">
              <Form.Label>New Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmUsername">
              <Form.Label>Re-enter New Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Re-enter new username"
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
              />
            </Form.Group>

            {error && <p className="text-danger fw-bold">{error}</p>}

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Change Username!
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UsernameForm;
