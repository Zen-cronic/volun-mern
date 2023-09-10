
const express = require('express');
const eventsControllers = require('../controllers/eventsControllers')

const router = express.Router()

router.route('/')
    .post(eventsControllers.createNewEvent)
    .get(eventsControllers.getAllEvents)
    .patch(eventsControllers.addShiftToEvent)
//ad hoc route /events/open - ltr filter category
// router.route('/open')
//     .get(eventsControllers.getOpenEvents)

    //delete ltr

// event/refresh - taskscheduling
// router.route('/refresh')
//     .patch(eventsControllers.updateEventVolunteersCount)

router.route('/eventvoluns')
    .get(eventsControllers.getSignedUpVolunteers)
    
router.route('/search')
    .post( eventsControllers.searchEvents)


router.route('/filter')
    .post(eventsControllers.filterEvents)

router.route('/dates')
    .get(eventsControllers.getAllEventsDates)
    

// router.route('/sort/az')
    
//     .get(eventsControllers.sortEventsAlphabetically)
    
// router.route('/sort/soonest')
    
//     .get(eventsControllers.sortEventsBySoonest)
    
// router.route('/sort/open')
    
//     .get(eventsControllers.sortEventsByOpen)

//combine sort
router.route('/sort')
    .get(eventsControllers.sortEvents)

module.exports =router;
