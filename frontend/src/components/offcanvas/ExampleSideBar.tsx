import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import FilterOptions from '../filterOptions/FilterOptions';
import SettingsPage from '../../pages/settings/SettingsPage';

function ExampleSideBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-light" onClick={handleShow}>
        Options
      </Button>

      <Offcanvas show={show} onHide={handleClose}  placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
         {/* <FilterOptions></FilterOptions> */}
         <SettingsPage></SettingsPage>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default ExampleSideBar;