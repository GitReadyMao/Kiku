import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import RegistrationButton from './Registration';
import Login from './Login';


function ProfileBar() {
  return (
    <Navbar style={{ backgroundColor: '#ffb7c5' }} fixed="top">
      <Container>
        <Navbar.Brand href=" ">きく</Navbar.Brand>
        <Navbar.Toggle />
        <Nav className="ms-auto">

          <RegistrationButton />
          <Login />
        </Nav>

      </Container>
    </Navbar>
  );
}
export default ProfileBar;