import React from "react";
// import { useLazyPostFilteredEventsQuery } from './eventsApiSlice'
import EventExcerpt from "../EventExcerpt";
import { useSelector } from "react-redux";
import { selectFilteredEvents } from "../eventsSlice";
import EventListLayout from "../EventListLayout";
import { Container, Table } from "react-bootstrap";
import checkIsFilteredEventsPage from "./checkIsFilteredEventsPage";

//rmove async!
const FilteredEventList = () => {
  const filteredEvents = useSelector(selectFilteredEvents);

  console.log("filteredEvents from eventSlice w selector: ", filteredEvents);

  if(!checkIsFilteredEventsPage(window.location.pathname)){

    return null
  }
  // checkIsFilteredEventsPage(window.location.href)

  const tableBodyContent = filteredEvents.map((event) => {
   
    const {eventId, filterTags} = event

    return (

      <tr key={eventId}>
       
        <EventExcerpt key={eventId} eventId={eventId} filterTags={filterTags}/>
        
      </tr>
    );
  });

  const content = (
    <Container className="my-2 px-3">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">Event Name</th>
            <th scope="col">Venue</th>
            <th scope="col">Description</th>
            <th scope="col">When?</th>
            <th scope="col">Filter categories</th>
          </tr>
        </thead>

        <tbody>{tableBodyContent}</tbody>
      </Table>
    </Container>
  );

  return content;
};

export default FilteredEventList;
