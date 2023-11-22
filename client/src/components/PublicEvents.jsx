import React from "react";
import EventHeader from "../features/event/EventHeader";
import EventList from "../features/event/EventList";
import useAuth from "../hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import EventPage from "../features/event/EventPage";
import SearchedEventsList from "../features/event/search/SearchedEventsList";
import SortedEventsList from "../features/event/sort/SortedEventsList";
import FilteredEventList from "../features/event/filter/FilteredEventList";

const PublicEvents = () => {
  const authData = useAuth();
  const content = (
    <>
      <EventHeader />
      <Routes>
        <Route index={true} element={<EventList />} />
        <Route path=":eventId" element={<EventPage />} />
        <Route path="search" element={<SearchedEventsList />} />
        <Route path="sort" element={<SortedEventsList />} />
        <Route path="filter" element={<FilteredEventList />} />
      </Routes>
    </>
  );

  console.log("guest info: ", authData);
  return content;
};

export default PublicEvents;
