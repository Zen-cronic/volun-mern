import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useLazyPostSearchedEventsQuery,
} from "../eventsApiSlice";
import { Button, Form } from "react-bootstrap";
import findingQueryTypes from "../../../config/findingQueryTypes";
import usePublicOrPrivateNavigate from "../../../hooks/usePublicOrPrivateNavigate";

const EventSearchBar = ({  setFindingQuery }) => {


  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams ? searchParams.get("q") : null
  );

  const [searchEvent] = useLazyPostSearchedEventsQuery();
  const navigateFn = usePublicOrPrivateNavigate()

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchQuery) {
      setSearchParams("");
      return null;
    }
    const encodedSearchQuery = encodeURI(searchQuery || "");
    try {
      const preferCacheValue = false;
      const { data } = await searchEvent(searchQuery, preferCacheValue);

     
      navigateFn(`/events/search?q=${encodedSearchQuery}`)

      setFindingQuery((prev) => ({
        ...prev,
        findingQueryType: findingQueryTypes.SEARCH,
        findingQueryVal: searchQuery,
      }));
    

      console.log("Searched events data: ", data);
    } catch (error) {
      console.error("events search error: ", error);
    }
  };
  const searchBar = (
    <Form onSubmit={handleSearchSubmit}>
      <Form.Control
        type="text"
        value={searchQuery ?? ""}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="search for events"
      />

      <Button type="submit">Search</Button>
    </Form>
  );
  return searchBar;
};

export default EventSearchBar;
