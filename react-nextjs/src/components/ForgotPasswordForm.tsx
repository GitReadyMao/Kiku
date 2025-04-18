import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setTimeout(() => {
      setMessage("A password reset link has been sent to your email.");
    }, 1000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
    <Form onSubmit={handleResetPassword}>
      <h2 className="d-flex justify-content-center align-items-center">Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>

      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <Button variant="primary" type="submit">
        Send Reset Link
      </Button>
    </Form>
    </div>
  );
};

export default ForgotPasswordForm;
