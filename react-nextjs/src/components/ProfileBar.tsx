import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function ProfileBar() {
  return (
    <Navbar style={{ backgroundColor: '#ffb7c5' }} fixed="top">
      <Container>
        <Navbar.Brand style={{ fontFamily: "'Tsukuhou Shogo Mincho', serif", fontSize: 45 }} href="dashboard">きく</Navbar.Brand>
        <Navbar.Toggle />


        <NavDropdown title="Username" id="navbarScrollingDropdown">
          <NavDropdown.Item href="#Profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#Logout">
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
}

export default ProfileBar;