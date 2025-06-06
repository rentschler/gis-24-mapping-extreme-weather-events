import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import SettingsPage from '../../pages/settings/SettingsPage';


function AppearingSidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-light" onClick={handleShow}>
        Options
      </Button>

      <Offcanvas show={show} onHide={handleClose}  placement="end" backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Query Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
         <SettingsPage onHide={handleClose}></SettingsPage>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AppearingSidebar;