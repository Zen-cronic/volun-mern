import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Button, ButtonGroup, Container } from "react-bootstrap";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const { role, volunId } = useAuth();
  const content = (
    <Container className="my-3 d-flex flex-column align-items-center justify-content-center">
      <h1>Welcome to VolunteersHub!</h1>

      <p>{today}</p>

      <ButtonGroup vertical>
        <Button
          as={Link}
          to="/dash/events"
          variant="primary"
          className="button-grp-margin"
        >
          View All Events
        </Button>
        {role === "ADMIN" && (
          <Button
            as={Link}
            to="/dash/volunteers"
            variant="primary"
            className="button-grp-margin"
          >
            View Volunteers List
          </Button>
        )}
        {role === "VOLUNTEER" && (
          <Button
            as={Link}
            to={`/dash/volunteers/${volunId}`}
            className="button-grp-margin"
          >
            See your volun info
          </Button>
        )}
      </ButtonGroup>
    </Container>
  );

  return content;
};
export default Welcome;
