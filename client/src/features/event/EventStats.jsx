import React from "react";
import { useParams } from "react-router-dom";
import {
  selectEventById,
  useGetSignedUpVolunteersQuery,
} from "./eventsApiSlice";
import { useSelector } from "react-redux";
import SingleVolunteerExcerpt from "../volun/SingleVolunteerExcerpt";
import { Col, Container, Row } from "react-bootstrap";
import EventShiftTable from "./EventShiftTable";
import VolunteersListLayout from "../volun/VolunteersListLayout";

//call EnvetShift for each shift PLUS the stats
const EventStats = () => {
  const { eventId } = useParams();
  const event = useSelector((state) => selectEventById(state, eventId));

  const {
    data: signedUpVolunteers,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetSignedUpVolunteersQuery(eventId);

  let content;

  if (isSuccess && event) {
    const { shiftVolunteers, totalUniqueVolunteers } = signedUpVolunteers;

    const shiftsVolunteerContent = shiftVolunteers?.map((shiftVolunObj) => {
      const { shiftId, volunteerIds } = shiftVolunObj;

      const shiftInfo = event.shifts.find((shift) => {
        return shift._id.toString() === shiftId;
      });

      const shifts = [shiftInfo];

      const volunteersTableBodyContent = volunteerIds.map((volunId) => (
        <tr key={volunId}>
          <SingleVolunteerExcerpt key={volunId} volunId={volunId} />
        </tr>
      ));

      return (
        <li key={shiftId}>
          <Row>
            <Col>
              <label>Shift: </label>
              <EventShiftTable shifts={shifts} eventId={eventId} />
            </Col>

            <Col>
              <label>Volunteers: </label>
              <VolunteersListLayout
                tableBodyContent={volunteersTableBodyContent}
              />
            </Col>

            <Col lg={2}>
              <label 
              className="total_volunteers_label"
               
              >
                Total Volunteers: {volunteerIds.length}
              </label>
            </Col>
          </Row>

          <br></br>
        </li>
      );
    });

    const allVolunteersTableBodyContent =
      totalUniqueVolunteers.uniqueVolunteersIds.map((volunId) => (
        <tr key={volunId}>
          <SingleVolunteerExcerpt key={volunId} volunId={volunId} />
        </tr>
      ));

    const allVolunteersContent = (
      <VolunteersListLayout tableBodyContent={allVolunteersTableBodyContent} />
    );

    const totalVolunteersCount = totalUniqueVolunteers.count;

    content = (
      <Container fluid className="py-2">
        <Row>
          <Col>
            <ol> {shiftsVolunteerContent} </ol>
          </Col>
        </Row>

        <Row>
          <Col>
            <label htmlFor="table_labels">ALl volunteers signed up</label>
            <ol>{allVolunteersContent}</ol>
          </Col>
        </Row>

        <Row>
          <Col>
            <label className="total_volunteers_label">Total unique Volunteers for {event.eventName}: {totalVolunteersCount}</label>
          </Col>
        </Row>
      </Container>
    );
  } else if (isLoading && !event) {
    content = <div>Loading...</div>;
  } else if (isError && !event) {
    content = <div>Error: {error}</div>;
  }

  return content;
};

export default EventStats;
