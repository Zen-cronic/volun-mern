const asyncHandler = require("express-async-handler");
const requiredInputChecker = require("../helpers/requiredInputChecker");

const {
  filterEventsByVenue,
  filterEventsByDate,
  filterEventsOpen,
  filteredTagsSort,
  filterEventsUpcomingShifts,
} = require("../helpers/filterEventsHelper");

const {
  sortEventsHelper,
  sortEventsByEventDate,
} = require("../helpers/sortEventsHelper");
const objKeysIncludes = require("../helpers/objKeysIncludes");

const { FILTER_OPTIONS } = require("../config/filterOptions");
const { SORT_OBJECT } = require("../config/sortOptions");
const filterArrSortLoose = require("../helpers/filterArrSortLoose");
const sortUpcomingEventsDates = require("../helpers/sortUpcomingEventsDates");
const elemObjPropValIncludes = require("../helpers/elemObjPropValIncludes");
const {
  getAllEvents,
  createNewEvent,
  getEventById,
  searchEvents,
  updateEventInfo,
  deleteEvent,
  getSignedUpVolunteers,
} = require("../service/eventsService");
const { findDuplicateEvent } = require("../helpers/findDuplicateEvent");

const createNewEventHandler = asyncHandler(async (req, res) => {
  const { eventName, eventVenue, eventDates, eventDescription, shifts } =
    req.body;

  if (requiredInputChecker(req.body)) {
    return res.status(400).json({ message: "All fields required" });
  }

  const newEvent = await createNewEvent(req.body);

  if (!newEvent) {
    return res.status(409).json({ message: "Event already exists" });
  }
  res.json({ newEvent });
});

const getAllEventsHandler = asyncHandler(async (req, res) => {
  const events = await getAllEvents();

  if (!events?.length) {
    return res.status(400).json({ message: "No events exist" });
  }

  res.json({ events });
});

const getEventByIdHandler = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (requiredInputChecker(req.body)) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingEvent = await getEventById(eventId);

  if (!existingEvent) {
    return res.status(404).json({ message: "Event Does Not Exist" });
  }

  return res.json({ existingEvent });
});

//search events
const searchEventsHandler = asyncHandler(async (req, res) => {
  // /search/?q=:query
  const { q } = req.query;

  const allEvents = await getAllEvents();

  const matchingEvents = searchEvents(allEvents, q);

  return res.status(200).json({ searchTerm: q, matchingEvents });
});

const sortEvents = [
  asyncHandler(async (req, res, next) => {
    //only 1 sort option at a time
    const [[sortOption, orderBool]] = Object.entries(req.body);

    // console.log(sortOption, orderBool);
    if (sortOption === SORT_OBJECT.SOONEST.sortOption) {
      return next();
    }

    const sortedEvents = await sortEventsHelper(sortOption, orderBool).then(
      (events) =>
        events.map((event) => ({
          eventId: event._id,
          eventName: event.eventName,
        }))
    );

    return res.json({ sortedEvents });
  }),

  //sort by soonest shift date
  asyncHandler(async (req, res) => {
    const allEvents = await getAllEvents();

    //recursion logic
    const sortedUpcomingEventsDates = sortUpcomingEventsDates(allEvents);

    const sortedEvents = sortEventsByEventDate(sortedUpcomingEventsDates);

    return res.status(200).json({
      sortedUpcomingEventsDates,
      sortedEvents,
    });
  }),
];

const updateEventInfoHandler = asyncHandler(async (req, res) => {
  const {
    eventId,
    eventName,
    eventVenue,
    eventDates,
    eventDescription,
    shifts,
  } = req.body;

  if (requiredInputChecker(req.body)) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingEvent = await getEventById(eventId);

  if (!existingEvent) {
    return res.status(400).json({ message: "Event DNE for PUT event info" });
  }

  const duplicate = await findDuplicateEvent();

  if (duplicate && duplicate._id.toString() !== existingEvent._id.toString()) {
    return res.status(409).json({
      message: "The renamed eventName already exists",
      duplicateEvent: duplicate,
    });
  }

  const updatedEvent = await updateEventInfo(existingEvent, req.body);

  console.log("updatedEvent: ", updatedEvent);
  return res.status(200).json({ updatedEvent });
});

//ltr notify signed up
const deleteEventHandler = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "eventId required for delete" });
  }

  const existingEvent = await getEventById(eventId);

  if (!existingEvent) {
    return res.status(400).json({ message: "Event DNE for DELETE event" });
  }

  const deletedEvent = await deleteEvent(eventId);

  const message = `Event: '${deletedEvent.eventName}' deleted`;

  return res.status(200).json({ message });
});

const getSignedUpVolunteersHandler = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) {
    return res
      .status(400)
      .json({ message: "eventId required for viewing signed up volunteers" });
  }

  const existingEvent = await getEventById(eventId);

  if (!existingEvent) {
    return res
      .status(400)
      .json({ message: "event DNE to get the signedUP voluns" });
  }

  const { shiftVolunteers, totalUniqueVolunteers } =
    await getSignedUpVolunteers(existingEvent.shifts);

  res.json({ shiftVolunteers, totalUniqueVolunteers });
});

const filterEvents = [
  //venue filter
  asyncHandler(async (req, res, next) => {
    if (!objKeysIncludes(req.body, FILTER_OPTIONS.VENUE)) {
      return next();
    }

    const { venue } = req.body;
    res.locals.filteredVenue = await filterEventsByVenue(venue);

    next();
  }),

  //date filter
  asyncHandler(async (req, res, next) => {
    if (!objKeysIncludes(req.body, FILTER_OPTIONS.DATE)) {
      return next();
    }

    const { date } = req.body;
    console.log("filterDate: ", date);
    res.locals.filteredDate = await filterEventsByDate(date);

    next();
  }),

  //isOpen filter
  asyncHandler(async (req, res, next) => {
    if (!objKeysIncludes(req.body, FILTER_OPTIONS.IS_OPEN)) {
      return next();
    }

    const { isOpen } = req.body;
    res.locals.filteredIsOpen = await filterEventsOpen(isOpen);

    next();
  }),

  //isUpcomingShifts filter
  asyncHandler(async (req, res, next) => {
    if (!objKeysIncludes(req.body, FILTER_OPTIONS.IS_UPCOMING)) {
      return next();
    }

    const { isUpcoming } = req.body;
    res.locals.filteredIsUpcoming = await filterEventsUpcomingShifts(
      isUpcoming
    );

    next();
  }),

  //sorted filter
  asyncHandler(async (req, res) => {
    //any of thses could be [] OR undefined
    const filteredVenue = res.locals.filteredVenue;
    const filteredDate = res.locals.filteredDate;
    const filteredIsOpen = res.locals.filteredIsOpen;
    const filteredIsUpcoming = res.locals.filteredIsUpcoming;

    let filteredResultsByKey = {};
    let idsWithTags = [];

    console.log("value of req.body for filterEvent: ", { ...req.body });

    Object.keys(req.body).map((filterKey) => {
      switch (filterKey) {
        case FILTER_OPTIONS.DATE:
          filteredResultsByKey = {
            ...filteredResultsByKey,
            [filterKey]: filteredDate,
          };
          break;

        case FILTER_OPTIONS.IS_OPEN:
          filteredResultsByKey = {
            ...filteredResultsByKey,
            [filterKey]: filteredIsOpen,
          };

          break;

        case FILTER_OPTIONS.VENUE:
          // filteredResultsByKey[filterKey] = filteredVenue

          filteredResultsByKey = {
            ...filteredResultsByKey,
            [filterKey]: filteredVenue,
          };

          break;

        case FILTER_OPTIONS.IS_UPCOMING:
          filteredResultsByKey = {
            ...filteredResultsByKey,
            [filterKey]: filteredIsUpcoming,
          };

        default:
          break;
      }
    });

    const filteredAllIds = filterArrSortLoose(
      Object.values(filteredResultsByKey)
    );

    filteredAllIds.forEach((id) => {
      Object.entries(filteredResultsByKey).forEach(([filterKey, result]) => {
        const [_, filterKeyVal] = Object.entries(req.body).find(
          ([key, _]) => key === filterKey
        );

        // console.log("filterKeyVal of each eventId: ", filterKeyVal);

        if (result.includes(id)) {
          // const isEventIdAlrExists = elemObjIncludes(idsWithTags, id);
          const isEventIdAlrExists = elemObjPropValIncludes(
            idsWithTags,
            "eventId",
            id
          );

          if (isEventIdAlrExists !== -1) {
            const bufferArr = idsWithTags.map((event) => {
              if (event.eventId === id) {
                // event = {...event, filterTags: [...event.filterTags, filterKey]}

                event = {
                  ...event,
                  filterTags: [
                    ...event.filterTags,
                    { [filterKey]: filterKeyVal },
                  ],
                };
              }

              return event;
            });

            idsWithTags = bufferArr;
          } else {
            idsWithTags.push({
              eventId: id,
              filterTags: [{ [filterKey]: filterKeyVal }],
            });
          }
        }
      });
    });

    const sortedIdsWithTags = filteredTagsSort(idsWithTags);

    // console.log('idsWIthTags: ',idsWithTags);
    // console.log("sortedIdsWithTags: ", sortedIdsWithTags);

    res.status(200).json({
      filteredResultsByKey,
      filteredAllIds,
      idsWithTags,
      sortedIdsWithTags,
    });
  }),
];

module.exports = {
  createNewEventHandler,
  getAllEventsHandler,
  updateEventInfoHandler,
  deleteEventHandler,
  getEventByIdHandler,

  searchEventsHandler,
  sortEventsHandler,
  filterEvents,

  getSignedUpVolunteersHandler,
};
