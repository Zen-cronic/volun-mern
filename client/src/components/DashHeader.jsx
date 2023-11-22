import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Logout from "./Logout";
import { FaHome } from "react-icons/fa";

const DashHeader = () => {
  const content = (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container className="mx-auto py-3">
          <LinkContainer to={"/dash"}>
            <Navbar.Brand> VolunteerHub Home</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto header-nav">
              <LinkContainer to={"/dash"}>
                <Nav.Link><FaHome/> Home</Nav.Link>
              </LinkContainer>
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
