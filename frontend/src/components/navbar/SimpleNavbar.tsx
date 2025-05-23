import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import AppearingSidebar from '../offcanvas/AppearingSidebar.tsx';

const MyNavbar = () => {

  return (
    <Navbar
      bg="primary"
      expand="lg"
      className="bg-body-tertiary"
      collapseOnSelect
    >
      <Container fluid>
        <Navbar.Brand >
          GIS Project
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand >
          Extreme Weather Events
        </Navbar.Brand>
          {/* <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Overview</Nav.Link>
            <Nav.Link href="https://gitlab.inf.uni-konstanz.de/geographic-information-systems-ws-245/mapping-extreme-weather-events">Gitlab</Nav.Link>
          </Nav> */}
        </Navbar.Collapse>
        <AppearingSidebar />
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
