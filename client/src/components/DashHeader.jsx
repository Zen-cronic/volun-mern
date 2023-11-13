import React, { useEffect } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Logout from "./Logout";
// emulate Public Header

const DashHeader = () => {
  const content = (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container className="mx-auto">
          <LinkContainer to={"/dash"}>
            <Navbar.Brand> VolunteerHub Home</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Logout />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
  return content;
};

export default DashHeader;
