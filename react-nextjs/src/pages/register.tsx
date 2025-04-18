import LoginBar from '@/components/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { useState } from 'react';
import router from 'next/router';

function Registration() {
  const apiURL = "http://localhost:8080";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const body = {
      email: email,
      username: username,
      password: password
    };
    
    await axios.post(`${apiURL}/api/v1/register`, body)
      .then(() => {
        router.push("/");
      })
      .catch(error => {
        alert("login failed");
      });
  };

  return (
    <>
    <LoginBar />
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Re-enter password</Form.Label>
          <Form.Control type="password" placeholder="Re-Enter Password" />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </div></>
  );
}

export default Registration;
