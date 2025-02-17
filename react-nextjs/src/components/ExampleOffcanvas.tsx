import { useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from 'react-bootstrap/Form';

export interface ExampleOffcanvasProps {
  className?: string | undefined;
}

const ExampleOffcanvas: React.FC<ExampleOffcanvasProps> = ({ className }) => {
  const [show, setShow] = useState(false);

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
          <Form>
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
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ExampleOffcanvas;
