import Header from '@/components/Header';
import LoginBar from '@/components/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { useState } from 'react';
import router from 'next/router';




function Registration(e: React.FormEvent) {
  const apiURL = "http://localhost:8080";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    //raw fetch for demonstration purposes, probably should use package instead
    const body = {
      email: email,
      username: username,
      password: password
    }
    await axios.post(`${apiURL}/api/v1/register`, body)
      .then(() => {
        router.push("/dashboard");
      })
      .catch(error => {
        alert("login failed");
      })
    };


  return (
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
    type="email"
    placeholder="Enter email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
    type="text"
    placeholder="Enter username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Re-enter password</Form.Label>
        <Form.Control type="password" placeholder="Re-Enter Password" />
        {/* TODO: just add a check if the password match */}
      </Form.Group>
      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default Registration;