const express = require("express");

const {
  createNewEventHandler,
  getAllEventsHandler,
  updateEventInfoHandler,
  deleteEventHandler,
  getEventByIdHandler,
  searchEventsHandler,

  sortEventsHandler,
  filterEvents,

  getSignedUpVolunteersHandler,
} = require("../controllers/eventsControllers");

const { ROLES } = require("../config/roles");
const verifyRole = require("../middleware/verifyRole");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router
  .route("/")

  .get(getAllEventsHandler)

  .post(verifyJWT, verifyRole(ROLES.ADMIN), createNewEventHandler)
  .put(verifyJWT, verifyRole(ROLES.ADMIN), updateEventInfoHandler)
  .delete(verifyJWT, verifyRole(ROLES.ADMIN), deleteEventHandler);

// event/refresh - taskscheduling

router.route("/:eventId").get(getEventByIdHandler);

//only admin
router
  .route("/volunteers")
  .post(verifyJWT, verifyRole(ROLES.ADMIN), getSignedUpVolunteersHandler);

router.route("/search").post(searchEventsHandler);
router.route("/sort").post(sortEventsHandler);
router.route("/filter").post(filterEvents);

module.exports = router;
