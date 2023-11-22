import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectEventById } from "./eventsApiSlice";
import useAuth from "../../hooks/useAuth";
import { Container, Row, Col, Button, ListGroup, Modal } from "react-bootstrap";
import convertEventDisplayDate from "../../helpers/convertEventDisplayDate";
import EventShiftTable from "./EventShiftTable";
import DeleteEvent from "./DeleteEvent";
import useModal from "../../hooks/useModal";

const EventPage = () => {
  const { eventId } = useParams();

  const navigate = useNavigate();

  const { role, isAdmin, volunId } = useAuth();

  const signUpModal = useModal();

  //vs getEventByIdQuery
  const event = useSelector((state) => selectEventById(state, eventId));

  const handleEditEvent = () => {
    // fulll url needed
    navigate(`/dash/events/${eventId}/edit`);
  };

  const handleViewSignedUpVolunteers = async () => {
    navigate(`/dash/events/${eventId}/stats`);
  };

  let content;

  if (event) {
    const eventDates = event.localEventDates.map((date, idx) => {
      const displayDate = convertEventDisplayDate(
        date.split(" ")[0].concat("T00:00")
      );

      return (
        <ListGroup.Item as="li" className="w-25 border-2" key={idx}>
          {displayDate}
        </ListGroup.Item>
      );
    });

    const adminContent =
      isAdmin && role === "ADMIN" ? (
        <Container className="d-flex flex-column justify-content-center">
          <Row className="my-2 ">
            <Col>
              <Button type="button" onClick={handleEditEvent}>
                Edit Event - add shift, etc
              </Button>
            </Col>

            <Col>
              <DeleteEvent eventId={eventId} />
            </Col>
            <Col>
              <Button type="button" onClick={handleViewSignedUpVolunteers}>
                See signed-up volunteers
              </Button>
            </Col>
          </Row>
        </Container>
      ) : null;

    const publicContent =
      !role && !volunId ? (
        <Container className="text-center">
          <Button type="button" onClick={signUpModal.showModal}>
            Sign up!
          </Button>

          <Modal show={signUpModal.isDisplayed} onHide={signUpModal.hideModal}>
            <Modal.Header closeButton>
              <Modal.Title>Sign up?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Register or login to start volunteering!</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={signUpModal.hideModal}>
                Back
              </Button>

              <Button as={Link} variant="primary" to="/login">
                Sign In
              </Button>

              <Button as={Link} variant="primary" to="/register">
                Register
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      ) : null;

    content = (
      <Container fluid className="py-2 ">
        <Row>
          <Col>
            <h1>{event.eventName}</h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <p className="excerpt">
              Event Description: {event.eventDescription}
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <p>Event VEnue: {event.eventVenue}</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <label>Event Dates: </label>
            <ListGroup as="ol" numbered>
              {eventDates}
            </ListGroup>
          </Col>
        </Row>

        <Row className=" d-flex flex-column justify-content-center">
          <Col>
            <label>Event Shifts: </label>
            <EventShiftTable shifts={event.shifts} eventId={eventId} />
          </Col>
        </Row>

        {adminContent}
        {publicContent}
      </Container>
    );
  }
  return content;
};

export default EventPage;
