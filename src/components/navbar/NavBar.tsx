import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const NavBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">My App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/1">Action 1</NavDropdown.Item>
            <NavDropdown.Item href="#action/2">Action 2</NavDropdown.Item>
            <NavDropdown.Item href="#action/3">Action 3</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        {/* You can add additional elements like buttons, user info, etc. here */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
