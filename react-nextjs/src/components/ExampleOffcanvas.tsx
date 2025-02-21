import { useState } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";

export interface ExampleOffcanvasProps {
  className?: string | undefined;
}

const ExampleOffcanvas: React.FC<ExampleOffcanvasProps> = ({ className }) => {
  const [show, setShow] = useState(false); //For displaying the offcanvas
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Router used by Next.js, not reacct

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simulated authentication check
    if (email === "123@123.com" && password === "123") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Button onClick={() => setShow((s) => !s)} className={className}>
        Login
      </Button>
      <Offcanvas placement="end" show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h5">Login</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleLogin}>    {/* This form handles getting the entered email and password and passing it into handleLogin*/}
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Keep me logged in" />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ExampleOffcanvas;


/* 
<Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Keep me logged in" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form> */