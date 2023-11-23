import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const PublicFooter = () => {

  const content = (
    <footer className=" bg-black text-white position-relative bottom-0 w-100  h-auto">
      <Container className=" pt-4 text-center">
        <Row className="py-2">
          <Col>
            {/* <Button as={Link} to='/dash' variant='warning' > */}
            <Button as={Link} to="/" variant="warning">
              Home
            </Button>
          </Col>

        

          <Col>
            <p> Copyright &copy; KZH 2023</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
  return content;
};

export default PublicFooter;
