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
  const duplicate = await Event.findOne({ eventName: eventInfo.eventName })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (duplicate) {
    return null;
  }

  const newEvent = await Event.create(eventInfo);

  return newEvent;
};

const getEventById = async(id) => {


}
module.exports = {
  getAllEvents,
  createNewEvent,
  getEventById
};
