import React, { useState } from "react";
import { useLazyPostSortedEventsQuery } from "../eventsApiSlice";
import { useNavigate } from "react-router";
import { Button, Form } from "react-bootstrap";
import findingQueryTypes from "../../../config/findingQueryTypes";

const EventSort = ({ setFindingQuery }) => {
  const [sortOption, setSortOption] = useState("");
  const [sortEvents, { isLoading }] = useLazyPostSortedEventsQuery();
  const navigate = useNavigate();

  const onSortOptionsChange = (e) => setSortOption(e.target.value);

  const canSort = Boolean(sortOption) && !isLoading;

  const sortOptionsSelect = (
    <Form.Select
      value={sortOption}
      name="sortSelect"
      onChange={onSortOptionsChange}
    >
      <option value={""}></option>
      <option value={"soonest"}>Soonest (Excludes Past events)</option>
      <option value={"event_az"}>Alphabetically</option>
      <option value={"open"}>Open Positions</option>
      {/* <option value={'newest'}>External</option> */}
    </Form.Select>
  );

  const handleSortSubmit = async () => {

    if(!canSort){
        return
    }
    try {
      const preferCacheValue = true;
      // const {data} = await sortEvents({[sortOption]: true}, preferCacheValue)
      const { data } = await sortEvents(sortOption, preferCacheValue);
      navigate("/dash/events/sort");

      setFindingQuery((prev) => ({
        ...prev,
        findingQueryType: findingQueryTypes.SORT,
        findingQueryVal: sortOption,
      }));

      console.log("Sorted events data: ", data);
    } catch (error) {
      console.log("Sort error: ", error);
    }
  };
  const sortSubmitButton = (
    <Button onClick={handleSortSubmit}  type="submit">
      Sort {sortOption}
    </Button>
  );

  return (
    <>
      {sortOptionsSelect}
      {sortSubmitButton}
    </>
  );
};

export default EventSort;
