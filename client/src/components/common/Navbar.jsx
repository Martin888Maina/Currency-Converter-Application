import { NavLink } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';

export default function Navbar() {
  return (
    <BsNavbar bg="white" expand="md" className="shadow-sm border-bottom" sticky="top">
      <Container>
        <BsNavbar.Brand as={NavLink} to="/" className="fw-bold text-primary fs-5">
          CurrencyConverter
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto gap-1">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/converter">
              Converter
            </Nav.Link>
            <Nav.Link as={NavLink} to="/history">
              History
            </Nav.Link>
            <Nav.Link as={NavLink} to="/charts">
              Charts
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
