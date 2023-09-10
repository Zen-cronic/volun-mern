
const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const verifyRole = require('../middleware/verifyRole');
const { ROLES } = require('../config/roles');

const router = express.Router()

router.route('/')
   .get(
    // verifyRole(ROLES.ADMIN),
     usersControllers.getAllVolunteers)
    .post(usersControllers.createNewVolunteer)
  
    .put(usersControllers.updateVolunteer)
    
    //sign up for events
    .patch(usersControllers.updateSignedUpShifts)

    //delete ltr

router.route('/search')
    .post(usersControllers.searchVolunteers)

router.route('/sort/az')
    
    .get(usersControllers.sortVolunteersAlphabetically)
    

router.route('/sort/shiftscount')
    
    .get(usersControllers.sortVolunteersByShiftsCount)
    

// router.route('/refresh')
//     .patch(usersControllers.refreshSignedUpEvents)

router.route('/volunteered')
    .patch(usersControllers.updateVolunteeredShifts)
module.exports =router;
