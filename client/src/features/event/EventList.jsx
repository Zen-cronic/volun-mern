import React from "react";
import { useGetEventsQuery } from "./eventsApiSlice";
import EventExcerpt from "./EventExcerpt";
import EventListLayout from "./EventListLayout";
import { Button, Container } from "react-bootstrap";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import useAuth from "../../hooks/useAuth";

const EventList = () => {
  const { role, isAdmin } = useAuth();
  const {
    data: events,
    isSuccess: isEventsSuccess,
    isLoading,
    isError,
    error,
  } = useGetEventsQuery("eventsList", {
    //15min
    pollingInterval: 900000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let tableBodyContent;

  if (isLoading) tableBodyContent = <p>Loading...</p>;

  if (isError) {
    tableBodyContent = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isEventsSuccess) {
    const { ids } = events;
    // console.log('all Events ids from useQUery:', ids);
    tableBodyContent = ids.map((eventId) => (
      <tr key={eventId}>
        <EventExcerpt key={eventId} eventId={eventId} />
      </tr>
    ));
  }

  const content = (
    <>
      {role === "ADMIN" && isAdmin ? (
        <Container className="my-2">
          <LinkContainer to={"/dash/events/new"}>
            <Button variant="warning">Add New Event</Button>
          </LinkContainer>
        </Container>
      ) : null}

      <EventListLayout tableBodyContent={tableBodyContent} />
    </>
  );
  return content;
};

export default EventList;
