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

module.exports = {
  getAllEvents,
  createNewEvent,
  getEventById,
  updateEventInfo,
  deleteEvent,

  getSignedUpVolunteers,
  searchEvents,
};
