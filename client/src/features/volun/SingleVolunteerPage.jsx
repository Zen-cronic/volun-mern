import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUpcomingSignedUpShiftsQuery,
  useGetUserByIdQuery,
} from "./volunteersApiSlice";
import EventExcerpt from "../event/EventExcerpt";
import { Button, Container, Row, Col } from "react-bootstrap";
import EventShiftTable from "../event/EventShiftTable";
import EventListLayout from "../event/EventListLayout";
import { selectEventsEntities } from "../event/eventsApiSlice";
import { useSelector } from "react-redux";

//only volun
const SingleVolunteerPage = () => {
  const { volunId } = useParams();

  const {
    data: user,
    isSuccess: isUserDataSuccess,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(volunId);

  const { data: upcomingShiftsData, isSuccess: isUpcomingShiftsSuccess } =
    useGetUpcomingSignedUpShiftsQuery(volunId);

  const events = useSelector(selectEventsEntities);

  const navigate = useNavigate();

  const handleEditEvent = () => {
    navigate(`/dash/volunteers/${volunId}/edit`);
  };

  const handleSignUpForMore = () => {
    navigate(`/dash/events`);
  };

  let content;

  if (isUserDataSuccess && isUpcomingShiftsSuccess && events) {
    const { entities } = user;

    const { upcomingShifts } = upcomingShiftsData;
    const volunteer = entities[volunId];

    const upcomingShiftsArr = upcomingShifts.map((shiftEvent, idx) => {
      const { eventId, signedUpShifts: shifts } = shiftEvent;
      // const eventId = shiftEvent.eventId
      // const shifts = shiftEvent.signedUpShifts

      const eventTableBodyContent = (
        <tr key={eventId}>
          <EventExcerpt eventId={eventId} key={eventId} />
        </tr>
      );

      return (
        <li key={idx}>
          <Row>
            <Col>
              <EventListLayout tableBodyContent={eventTableBodyContent} />
            </Col>
            <Col>
              <EventShiftTable shifts={shifts} eventId={eventId} />
            </Col>
          </Row>

          <br></br>
        </li>
      );
    });

    //access shift._id of each event and find for shiftId in volunteer.volunteeredShifts
    //reUse implemetnation in back - getUpcomingSignedUpShifts

    //this approach makes {shiftDuration} redundant as shiftInfo is found

    const eventsArr = Object.values(events);

    // console.log('eventsArr: ', eventsArr);
    const volunteeredShiftsArrWithEvent = volunteer.volunteeredShifts.map(
      (shiftObj) => {
        const { shiftId, shiftDuration } = shiftObj;

        const includedEvent = eventsArr?.find((event) => {
          const foundEvent = event.shifts.find(
            (shift) => shift._id.toString() === shiftId
          );

          return foundEvent;
        });

        //dependent array method
        const includedShiftInfo = includedEvent.shifts.find(
          (shift) => shift._id.toString() === shiftId
        );

        const shifts = [includedShiftInfo];
        // const {eventName} = includedEvent

        const eventId = includedEvent?._id;

        const eventTableBodyContent = (
          <tr key={eventId}>
            <EventExcerpt eventId={eventId} key={eventId} />
          </tr>
        );
        return (
          <li key={shiftId}>
            <Row>
              <Col>
                <EventListLayout tableBodyContent={eventTableBodyContent} />
              </Col>
              <Col>
                <EventShiftTable shifts={shifts} eventId={eventId} />
              </Col>
            </Row>

            <br></br>
          </li>
        );
      }
    );

    //rough code, algo write, reUse algo

    content = (
      <Container fluid className="py-2">
        <Row>
          <Col>
            <p>Your name: {volunteer.username}</p>
          </Col>
          <Col>
            <p>your student id: {volunteer.userId}</p>
          </Col>

          <Col>
            <p>totalVolunteeredHours: {volunteer.totalVolunteeredHours}</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>
              Your upcoming shifts:
              <Button
                type="button"
                onClick={handleSignUpForMore}
                className=" m-2"
              >
                Sign up for more!
              </Button>
            </h4>

            <ol>{upcomingShiftsArr}</ol>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>
              Volunteered Shifts:
              <Button
                type="button"
                onClick={handleSignUpForMore}
                className=" m-2"
              >
                Sign up for more!
              </Button>
            </h4>
            <ol>{volunteeredShiftsArrWithEvent} </ol>
          </Col>
        </Row>

        <br></br>

        <Row>
          <Col>
            <Button type="button" onClick={handleEditEvent}>
              Edit Your info
            </Button>
          </Col>
        </Row>
      </Container>
    );
  } else if (isLoading) {
    content = <p>Loading... user info</p>;
  } else if (isError) {
    content = <p>Error... {error}</p>;
  }

  return content;
};

export default SingleVolunteerPage;
