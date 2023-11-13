const express = require("express");
const usersControllers = require("../controllers/usersControllers");
const verifyRole = require("../middleware/verifyRole");
const { ROLES } = require("../config/roles");

const router = express.Router();

//for DashFooter user info w jwt-decode
router.route("/:id").get(usersControllers.getUserById);

router
  .route("/shifts/:volunId")
  .get(usersControllers.getUpcomingSignedUpShifts);

router
  .route("/")
  .get(verifyRole(ROLES.ADMIN), usersControllers.getAllVolunteers)
  .post(usersControllers.createNewVolunteer)

  .put(verifyRole(ROLES.VOLUNTEER), usersControllers.updateVolunteer)

  //sign up for events
  .patch(verifyRole(ROLES.VOLUNTEER), usersControllers.updateSignedUpShifts);

//delete ltr

router
  .route("/cancel")
  .patch(verifyRole(ROLES.VOLUNTEER), usersControllers.cancelSignedUpShifts);

router
  .route("/search")
  .post(verifyRole(ROLES.ADMIN), usersControllers.searchVolunteers);

router
  .route("/sort")

  .post(verifyRole(ROLES.ADMIN), usersControllers.sortVolunteers);

router.route("/volunteered").patch(usersControllers.updateVolunteeredShifts);

//ROLE.V
router
  .route("/check-buttons")
  .post(
    verifyRole(ROLES.VOLUNTEER),
    usersControllers.checkUpdatableAndCancelableShifts
  );

module.exports = router;
