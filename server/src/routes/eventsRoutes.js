
const express = require('express');
const eventsControllers = require('../controllers/eventsControllers');

const router = express.Router()

router.route('/')
    .post(eventsControllers.createNewEvent)
    .get(eventsControllers.getAllEvents)
    .patch(eventsControllers.addShiftToEvent)


    //delete ltr

// event/refresh - taskscheduling


//only admin
router.route('/volunteers')
    .post(eventsControllers.getSignedUpVolunteers)
    
router.route('/search')
    .post( eventsControllers.searchEvents)

router.route('/dates')
    .get(eventsControllers.getAllEventsDates)
    
//combined sort
router.route('/sort')
    .post(eventsControllers.sortEvents)

//combined filter
router.route("/filter")
    .post(eventsControllers.filterEvents)

module.exports =router;
