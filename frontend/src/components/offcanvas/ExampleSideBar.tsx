import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

function ExampleSideBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-dark" onClick={handleShow}>
        Options
      </Button>

      <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          I will not close if you click outside of me.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default ExampleSideBar;