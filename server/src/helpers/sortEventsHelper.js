const { SORT_OBJECT } = require("../config/sortOptions");
const Event = require("../models/Event");
const { getAllEvents } = require("../service/eventsService");
const sortOrder = require("./sortOrder");

const sortEventsHelper = async (sortOption, orderBool) => {
  // let sortIndex = Object.values(SORT_INDEX).find(sortIndex => (Object.values(SORT_OPTIONS) === sortOption))

  if (typeof orderBool !== "boolean") {
    throw new Error(
      "Sort val must be a boolean for either ascending or descending"
    );
  }

  const sortOptionObj = Object.values(SORT_OBJECT).find(
    (opt) => opt.sortOption === sortOption
  );

  if (!sortOptionObj) {
    throw new Error(
      "sortOption val must be one of the pre-defined sort options val"
    );
  }

  const { sortIndex } = sortOptionObj;

  const events = await getAllEvents();

  const allSortedEvents = sortOrder(events, sortIndex, orderBool);

  return allSortedEvents;
};
module.exports = {
  sortEventsHelper,
};
