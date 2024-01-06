const { FILTER_OPTIONS } = require("../config/filterOptions");
const elemObjPropValIncludes = require("../helpers/elemObjPropValIncludes");
const filterArrSortLoose = require("../helpers/filterArrSortLoose");
const { filteredTagsSort } = require("../helpers/filterEventsHelper");
const filterNonDuplicate = require("../helpers/filterNonDuplicate");
const { findDuplicateEvent } = require("../helpers/findDuplicateEvent");
const includesSearchTerm = require("../helpers/includesSearchTerm");
const Event = require("../models/Event");

const getAllEvents = async () => {
  try {
    const allEvents = await Event.find().lean();

    return allEvents;
  } catch (error) {
    console.log("Get all events error: ", error);
  }
};

const createNewEvent = async (eventInfo) => {
  const duplicate = await findDuplicateEvent(eventInfo.eventName);

  if (duplicate) {
    return null;
  }

  const newEvent = await Event.create(eventInfo);

  return newEvent;
};

const getEventById = async (eventId) => {
  const existingEvent = await Event.findById(eventId).exec();

  if (!existingEvent) {
    return null;
  }

  return existingEvent;
};

const searchEvents = (allEvents, searchTerm) => {
  if (!Array.isArray(allEvents)) {
    throw new Error("Param Must be an array");
  }
  const matchingEvents = allEvents
    .filter((event) => {
      try {
        return (
          includesSearchTerm(event.eventName, searchTerm) ||
          includesSearchTerm(event.eventDescription, searchTerm)
        );
      } catch (error) {
        console.error("an error from searchEvents:", error.message);
        // console.log("an error from searchEvents:", error);
        return false; // Exclude this event from the results
      }
    })

    .map((event) => ({
      eventId: event._id,
    }));

  return matchingEvents;
};

const updateEventInfo = async (existingEvent, eventInfo) => {
  existingEvent.eventName = eventInfo.eventName;
  existingEvent.eventVenue = eventInfo.eventVenue;
  existingEvent.eventDates = eventInfo.eventDates;
  existingEvent.eventDescription = eventInfo.eventDescription;

  const existingAllShifts = existingEvent.shifts;

  eventInfo.shifts.map((returnedShift) => {
    //shiftId included from front
    const existingShift = existingAllShifts.find(
      (shift) => shift._id.toString() === returnedShift?.shiftId
    );

    // console.log(
    //   "existingShift found using returnedShfit from front: ",
    //   existingShift
    // );

    if (existingShift) {
      existingShift.shiftStart = new Date(returnedShift.shiftStart);
      existingShift.shiftEnd = new Date(returnedShift.shiftEnd);
      existingShift.shiftPositions = parseInt(returnedShift.shiftPositions);
    } else {
      existingEvent.shifts.push(returnedShift);
    }
  });

  const updatedEvent = await existingEvent.save();

  return updatedEvent;
};

const deleteEvent = async (eventId) => {
  const deletedEvent = await Event.findByIdAndDelete(eventId);

  return deletedEvent;
};

const getSignedUpVolunteers = async (shifts) => {
  if (!Array.isArray(shifts)) {
    throw new Error("shifts must be an array");
  }

  const shiftVolunteers = shifts.map((shift) => {
    return { shiftId: shift._id, volunteerIds: shift.signedUpVolunteers };
  });

  const allVolunIds = shifts
    .flatMap((shift) => shift.signedUpVolunteers)
    .map((volunId) => volunId.toString());

  const uniqueVolunteersIds = filterNonDuplicate(allVolunIds);

  const totalUniqueVolunteers = {
    uniqueVolunteersIds,
    count: uniqueVolunteersIds.length,
  };

  return { shiftVolunteers, totalUniqueVolunteers };
};

const filterEvents = (filterObj, resLocals) => {
  //any of thses could be [] OR undefined

  const filteredVenue = resLocals.filteredVenue;
  const filteredDate = resLocals.filteredDate;
  const filteredIsOpen = resLocals.filteredIsOpen;
  const filteredIsUpcoming = resLocals.filteredIsUpcoming;

  let filteredResultsByKey = {};
  let idsWithTags = [];

  // console.log("value of req.body for filterEvent: ", { ...filterObj });

  Object.keys(filterObj).forEach((filterKey) => {
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

  //provide filterTags
  filteredAllIds.forEach((id) => {
    Object.entries(filteredResultsByKey).forEach(([filterKey, result]) => {
      const [_, filterKeyVal] = Object.entries(filterObj).find(
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

        //if alr exists
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

  return {
    filteredResultsByKey,
    filteredAllIds,
    idsWithTags,
    sortedIdsWithTags,
  };
};

module.exports = {
  getAllEvents,
  createNewEvent,
  getEventById,
  updateEventInfo,
  deleteEvent,

  getSignedUpVolunteers,
  searchEvents,

  filterEvents,
};
