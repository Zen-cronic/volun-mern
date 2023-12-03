const Event = require("../models/Event");

const findDuplicateEvent = async (eventName) => {
  const duplicate = await Event.findOne({ eventName: eventName })
    .collation({ locale: "en", strength: 2 })
    .exec();

  return duplicate;
};

module.exports = { findDuplicateEvent }
