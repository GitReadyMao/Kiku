import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import RegistrationButton from './Registration';
import Login from './Login';


function LoginBar() {
  return (
    <Navbar style={{ backgroundColor: '#ffb7c5' }} fixed="top">
      <Container>
        <Navbar.Brand style={{ fontFamily: "'Tsukuhou Shogo Mincho', serif", fontSize: 45 }} href="/">きく</Navbar.Brand>
        <Navbar.Toggle />
        <Nav className="ms-auto">
          <div className='me-2'>
            <RegistrationButton />
          </div>
          <Login />
        </Nav>

      </Container>
    </Navbar>
  );
}
export default LoginBar;