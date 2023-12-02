import React, { useState } from "react";
import { useLazyPostSortedEventsQuery } from "../eventsApiSlice";
import { Button, Form} from "react-bootstrap";
import findingQueryTypes from "../../../config/findingQueryTypes";
import useAuth from "../../../hooks/useAuth";
import usePublicOrPrivateNavigate from "../../../hooks/usePublicOrPrivateNavigate";

const EventSort = ({ setFindingQuery }) => {
  const [sortOption, setSortOption] = useState("");
  //true - asc
  const [ascOrDesc, setAscOrDesc] = useState(true);

  const [sortEvents, { isLoading }] = useLazyPostSortedEventsQuery();

  const navigateFn = usePublicOrPrivateNavigate();
  const onSortOptionsChange = (e) => {
    setSortOption(e.target.value);

    e.target.value === "open" ? setAscOrDesc(false) : setAscOrDesc(true);
  };

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
      <option value={"open"}>Open Positions (descending)</option>
    </Form.Select>
  );

  const handleSortSubmit = async () => {
    if (!canSort) {
      return;
    }

    try {
      const preferCacheValue = false;

      const sortOptionObject = { [sortOption]: ascOrDesc };
      // console.log("sortOption obj from front: ", sortOptionObject);

      const { data } = await sortEvents(sortOptionObject, preferCacheValue);

      navigateFn("/events/sort");

      setFindingQuery((prev) => ({
        ...prev,
        findingQueryType: findingQueryTypes.SORT,
        findingQueryVal: sortOption,
      }));

      // console.log("Sorted events data: ", data);
    } catch (error) {
      console.log("Sort error: ", error);
    }
  };
  const sortSubmitButton = (
    <Button onClick={handleSortSubmit} type="submit">
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
