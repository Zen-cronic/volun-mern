const convertLocalDateString = require("./convertLocalDateString");
const Event = require("../models/Event");
const hourMinFormat = require("./hourMinFormat");
const sortUpcomingEventsDates = require("./sortUpcomingEventsDates");

//filter by date
const filterEventsByDate = async (dateStr) => {
  const filterDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isDateValid = filterDateRegex.test(dateStr);

  if (!isDateValid) {
    throw new Error(
      "date string must be in format yyyy-MM-dd - filterEventsByDate"
    );
  }

  const convertedDateWithTime = new Date(dateStr + hourMinFormat());
  const currentlocalDateStr = convertLocalDateString(convertedDateWithTime);

  const matchingEvents = await Event.find()
    .lean()
    .exec()
    .then((events) =>
      events.filter((event) => {
        //split cuz time is not considered in the filter, only date
        const localEventDatesArrSplit = event.localEventDates.map(
          (dateStr) => dateStr.split(" ")[0]
        );

        const currentlocalDateStrSplit = currentlocalDateStr.split(" ")[0];

        // console.table('localEventDatesArrSplit from filterEventsHelper: ', localEventDatesArrSplit);

        if (localEventDatesArrSplit.includes(currentlocalDateStrSplit)) {
          return true;
        }

        return false;
      })
    )
    .then((events) => events.map((event) => event._id.toString()));

  return matchingEvents;
};

//filter by venue
const filterEventsByVenue = async (venueStr) => {
  const eventsByVenuesIds = await Event.find({ eventVenue: { $eq: venueStr } })
    .lean()
    .exec()
    .then((events) => events.map((event) => event._id.toString()));

  return eventsByVenuesIds;
};

//filter open
const filterEventsOpen = async (isOpen) => {
  if (!isOpen) {
    return Promise.resolve([]);
  }

  const events = await Event.find({ openPositions: { $gt: 0 } })
    .lean()
    .exec()
    .then((events) => events.map((event) => event._id.toString()));

  return events;
};

//filter upcoming (+ auto sorted)
const filterEventsUpcomingShifts = async (isUpcoming) => {
  //must be true
  if (!isUpcoming) {
    return Promise.resolve([]);
  }

  const allEvents = await Event.find().lean().exec();

  const sortedUpcomingEventsDates = sortUpcomingEventsDates(allEvents);

  const filteredEventIds = sortedUpcomingEventsDates.map((event) =>
    event?.eventId.toString()
  );

  // console.log('filtereedEventIds: ', filteredEventIds );
  console.log(
    "sortedUpcomingEventsDates from filterEventsHelper ",
    sortedUpcomingEventsDates
  );

  return filteredEventIds;
};

//similar to sortOrder - except .length property on the value found by index
//@Param shape: arr = [{eventId:... , filterTags: [...]}]

const filteredTagsSort = (arr) => {
  if (!Array.isArray(arr)) {
    throw new Error("Must be an array for sorting filtered tags");
  }

  const SORT_INDEX = "filterTags";
  const sortedArr = [...arr].sort((a, b) => {
    if (a[SORT_INDEX].length < b[SORT_INDEX].length) {
      return 1;
    } else if (a[SORT_INDEX].length > b[SORT_INDEX].length) {
      return -1;
    }
    return 0;
  });

  //    console.log('sortedEntries from filterTagsSort: ');
  //    sortedArr.map(entry => {
  //        console.log(entry);
  //    })
  return sortedArr;
};

module.exports = {
  filterEventsByDate,
  filterEventsByVenue,
  filterEventsOpen,
  filterEventsUpcomingShifts,
  filteredTagsSort,
};
