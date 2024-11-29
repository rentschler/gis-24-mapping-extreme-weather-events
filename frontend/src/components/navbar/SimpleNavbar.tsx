import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ExampleSideBar from '../offcanvas/ExampleSideBar';

const SimpleNavbar = () => {
  return (
    <Navbar bg="primary" expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="https://gitlab.inf.uni-konstanz.de/geographic-information-systems-ws-245/mapping-extreme-weather-events">GIS Project 07 - Extreme Weather Events</Navbar.Brand>
      <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Overview</Nav.Link>
            <Nav.Link href="#">Detailed Vis</Nav.Link>
          </Nav>
          <ExampleSideBar />
    </Container>
  </Navbar>  )
}

export default SimpleNavbar