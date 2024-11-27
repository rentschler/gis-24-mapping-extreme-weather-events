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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Overview</Nav.Link>
            <Nav.Link href="#pricing">Detailed Vis</Nav.Link>
          </Nav>
          <ExampleSideBar />
    </Container>
  </Navbar>  )
}

export default SimpleNavbar