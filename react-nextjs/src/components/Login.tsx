import { useState } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import axios from "axios";
import getCookie from "@/util/cookies";
import { getCsrfToken } from "@/util/token";

export interface Login {
  className?: string | undefined;
}


const ExampleOffcanvas: React.FC<Login> = ({ className }) => {
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

    const apiClient = axios.create({
      baseURL: "http://localhost:8080",
      withCredentials: true,
    });

    await apiClient.post(`${apiURL}/api/v1/login`, body)
      .then(() => {
        router.push("/dashboard");
      })
      .catch(() => {
        alert("login failed");
      })
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

              <p className="mt-3">
                <a href="/ForgotPassword">Forgot password?</a>
              </p>

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