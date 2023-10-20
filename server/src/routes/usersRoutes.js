
const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const verifyRole = require('../middleware/verifyRole');
const { ROLES } = require('../config/roles');

const router = express.Router()

// router.route('/userId/:id').
//     get(usersControllers.getUser)

//for DashFooter user info w jwt-decode
router.route('/:id')
    .get(usersControllers.getUserById)



// router.param('id', usersControllers.getUser)



router.route('/shifts/:volunId')
    .get(usersControllers.getUpcomingSignedUpShifts)

router.route('/')
   .get(
    verifyRole(ROLES.ADMIN),
     usersControllers.getAllVolunteers)
    .post(usersControllers.createNewVolunteer)
  
    //ROLE.V
    .put(usersControllers.updateVolunteer)
    
    //sign up for events
    .patch(verifyRole(ROLES.VOLUNTEER),usersControllers.updateSignedUpShifts)

    //delete ltr

router.route('/cancel')
    .patch(verifyRole(ROLES.VOLUNTEER), usersControllers.cancelSignedUpShifts)

    
router.route('/search')
    .post(
        
    verifyRole(ROLES.ADMIN),
    usersControllers.searchVolunteers)


router.route('/sort')
    
    .post(verifyRole(ROLES.ADMIN),
        usersControllers.sortVolunteers)


router.route('/volunteered')
    .patch(usersControllers.updateVolunteeredShifts)

router.route('/check-buttons')
    .post(usersControllers.checkUpdatableAndCancelableShifts)

module.exports =router;
