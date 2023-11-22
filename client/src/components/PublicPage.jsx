import { Badge, Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const PublicPage = () => {
  const content = (
    <Container className="d-flex justify-content-center py-4">
      <Card
        className="p-3 d-flex flex-column align-items-center justify-content-center bg-light w-75 "
        style={{ height: "50vh" }}
      >
        <h1 className="text-center mb-4">Welcome to VolunteersHub!</h1>
        <p className="text-center mb-4">
          This space is for student volunteers at ...
        </p>
        <div className="d-flex mb-3">
          <Button as={Link} variant="primary" to="/login" className=" me-3">
            Sign In
          </Button>
          <Badge className="me-3" bg="info" pill>
            or
          </Badge>
          <Button as={Link} variant="primary" to="/register">
            Register
          </Button>
        </div>

        <div className="d-flex">
          <Button as={Link} variant="warning" to="/events">Check out events!</Button>
        </div>
      </Card>
    </Container>
  );
  return content
};
export default PublicPage;
