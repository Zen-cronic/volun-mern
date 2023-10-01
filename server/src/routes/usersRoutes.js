
const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const verifyRole = require('../middleware/verifyRole');
const { ROLES } = require('../config/roles');

const router = express.Router()

// router.route('/userId/:id').
//     get(usersControllers.getUser)

//for DashFooter user info w jwt-decode
router.route('/:id')
    .get(usersControllers.getUser)



// router.param('id', usersControllers.getUser)

// router.route()
// router.param('id', async(req,res, next, id)=> {

//     console.log('/users:id router reached');
//     const existingUser = await User.findById(id).lean().select({password: 0}).exec()

//     if(!existingUser){
//         res.status(400).json({message: "User DNE for get"})

//     }

//     res.json({existingUser})

// })

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

// router.route('/sort/az')
    
//     .get(usersControllers.sortVolunteersAlphabetically)
    
// router.route('/sort/hours')
//     .get(usersControllers.sortVolunteersByHours)

// router.route('/sort/shiftscount')
    
//     .get(usersControllers.sortVolunteersByShiftsCount)
    

// router.route('/refresh')
//     .patch(usersControllers.refreshSignedUpEvents)

router.route('/volunteered')
    .patch(usersControllers.updateVolunteeredShifts)

module.exports =router;
