
const express = require('express');
const eventsControllers = require('../controllers/eventsControllers');

const router = express.Router()

router.route('/')
    .post(eventsControllers.createNewEvent)
    .get(eventsControllers.getAllEvents)
    .put(eventsControllers.updateEventInfo)
    .delete(eventsControllers.deleteEvent)

    //delete ltr

// event/refresh - taskscheduling

router.route('/:eventId')
    .get(eventsControllers.getEventById)

//only admin
router.route('/volunteers')
    .post(eventsControllers.getSignedUpVolunteers)
    
router.route('/search')
    .post( eventsControllers.searchEvents)

//combined sort
router.route('/sort')
    .post(eventsControllers.sortEvents)

//combined filter
router.route("/filter")
    .post(eventsControllers.filterEvents)

module.exports =router;
