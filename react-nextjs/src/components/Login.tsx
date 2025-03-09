import { useState } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import axios from "axios";

export interface Login {
  className?: string | undefined;
}

const Login: React.FC<Login> = ({ className }) => {
  //apiURL for demonstration purposes, move to env?
  const apiURL = "http://localhost:8080";

  const [show, setShow] = useState(false); //For displaying the offcanvas
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Router used by Next.js, not react

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    //raw fetch for demonstration purposes, probably should use package instead
    const body = {
      username: username,
      password: password
    }
    await axios.post(`${apiURL}/api/v1/login`, body)
      .then(() => {
        router.push("/dashboard");
      })
      .catch(error => {
        alert("login failed");
      })
    // const response = await fetch(`${apiURL}/api/v1/login`, {
    //   method: 'POST',
    //   headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify({username, password})
    // }).then(() => {
    //   router.push("/dashboard");
    // })
    // Simulated authentication check
    // if (email === "123@123.com" && password === "123") {
    //   router.push("/dashboard");
    // } else {
    //   setError("Invalid email or password");
    // }
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
            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your username with anyone else.
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

export default Login;