import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import GetUsername from './Username';
import axios from 'axios';
import router from 'next/router';
import { getCsrfToken } from '@/util/token';

function ProfileBar() {
  const handlelogout = async () => {
    const apiClient = axios.create({
      baseURL: "http://localhost:8080",
      withCredentials: true,
    });

    const body = {}
    await apiClient.post(`/api/v1/logout`, body, {
      headers: {
        'X-CSRF-Token': getCsrfToken() //Must be added for every API
      }
    })
      .then(() => {
        router.push("/");
      })
      .catch(() => {
        alert("logout failed");
      })
  };

  return (
    <Navbar style={{ backgroundColor: '#ffb7c5' }} fixed="top">
      <Container>
        <Navbar.Brand style={{ fontFamily: "'Tsukuhou Shogo Mincho', serif", fontSize: 45 }} href="/dashboard">きく</Navbar.Brand>
        <Navbar.Toggle />
        <Nav className="me-auto">
          <Nav.Link href="/Leaderboards">Leaderboards</Nav.Link>
        </Nav>
        <NavDropdown title={GetUsername()} id="navbarScrollingDropdown">
          <NavDropdown.Item href="/Profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handlelogout}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
}

export default ProfileBar;