const express = require("express");
const eventsControllers = require("../controllers/eventsControllers");
const { ROLES } = require("../config/roles");
const verifyRole = require("../middleware/verifyRole");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router
  .route("/")

  .get(eventsControllers.getAllEventsHandler)

  .post(verifyJWT, verifyRole(ROLES.ADMIN), eventsControllers.createNewEventHandler)
  .put(verifyJWT, verifyRole(ROLES.ADMIN), eventsControllers.updateEventInfo)
  .delete(verifyJWT, verifyRole(ROLES.ADMIN), eventsControllers.deleteEvent);

// event/refresh - taskscheduling

router.route("/:eventId").get(eventsControllers.getEventById);

//only admin
router
  .route("/volunteers")
  .post(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    eventsControllers.getSignedUpVolunteers
  );

router.route("/search").post(eventsControllers.searchEvents);
router.route("/sort").post(eventsControllers.sortEvents);
router.route("/filter").post(eventsControllers.filterEvents);

module.exports = router;
