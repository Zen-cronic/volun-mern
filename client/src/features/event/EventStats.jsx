import React from "react";
import { useParams } from "react-router-dom";
import {
  selectEventById,
  useGetSignedUpVolunteersQuery,
} from "./eventsApiSlice";
import { useSelector } from "react-redux";
import SingleVolunteerExcerpt from "../volun/SingleVolunteerExcerpt";
import { Col, Row } from "react-bootstrap";
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
              <label>Total Volunteers: {volunteerIds.length}</label>
            </Col>
          </Row>

          <br></br>
        </li>
      );
    });

    const allVolunteersForEvent = totalUniqueVolunteers.uniqueVolunteersIds.map(
      (volunId) => <SingleVolunteerExcerpt volunId={volunId} key={volunId} />
    );

    const totalVolunteersCount = totalUniqueVolunteers.count;

    content = (
      <>
        <ol> {shiftsVolunteerContent} </ol>
        <div>
          <p>ALl volunteers signed up</p>
          <ol>{allVolunteersForEvent}</ol>
        </div>

        <label>Total Volunteers: {totalVolunteersCount}</label>
      </>
    );
  } else if (isLoading) content = <div>Loading...</div>;
  else if (isError) content = <div>Error: {error}</div>;

  return content;
};

export default EventStats;
