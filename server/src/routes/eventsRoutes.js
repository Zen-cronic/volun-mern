const express = require("express");
const eventsControllers = require("../controllers/eventsControllers");
const { ROLES } = require("../config/roles");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

router
  .route("/")
  .get(eventsControllers.getAllEvents)

  .post(verifyRole(ROLES.ADMIN), eventsControllers.createNewEvent)
  .put(verifyRole(ROLES.ADMIN), eventsControllers.updateEventInfo)
  .delete(verifyRole(ROLES.ADMIN), eventsControllers.deleteEvent);

//delete ltr

// event/refresh - taskscheduling

router.route("/:eventId").get(eventsControllers.getEventById);

//only admin
router.route("/volunteers").post(verifyRole(ROLES.ADMIN),eventsControllers.getSignedUpVolunteers);

router.route("/search").post(verifyRole(ROLES.ADMIN),eventsControllers.searchEvents);

//combined sort
router.route("/sort").post(verifyRole(ROLES.ADMIN),eventsControllers.sortEvents);

//combined filter
router.route("/filter").post(verifyRole(ROLES.ADMIN),eventsControllers.filterEvents);

module.exports = router;
