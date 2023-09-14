
const express = require('express');
const eventsControllers = require('../controllers/eventsControllers');
const asyncHandler = require('express-async-handler');
const { FILTER_OPTIONS } = require('../config/filterOptions');
const { filterEventsByVenue, filterEventsOpen, filterEventsByDate, filteredTagsSort } = require('../helpers/filterEventsHelper');
const filterArrSortLoose = require('../helpers/filterArrSortLoose');
const objKeysIncludes = require('../helpers/objKeysIncludes');

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


// router.route('/filter')
//     .post(eventsControllers.filterEvents)
    
router.route("/filter")

    //venue filter
    .post(

        asyncHandler(async(req,res,next)=> {


        // if(!Object.keys(req.body).includes(FILTER_OPTIONS.VENUE)){
        if(!objKeysIncludes(req.body,FILTER_OPTIONS.VENUE ) ){

            return next()
        }

        const {venue} = req.body
        res.locals.filteredVenue = await filterEventsByVenue(venue)

        next()
    }),
    
        asyncHandler(async(req,res, next)=>{

        if(!objKeysIncludes(req.body,FILTER_OPTIONS.DATE ) ){
            return next()
        }

        const {date} = req.body
        res.locals.filteredDate = await filterEventsByDate(date)
        
        next()
    }),

        asyncHandler(async(req,res, next)=>{

        if(!objKeysIncludes(req.body, FILTER_OPTIONS.IS_OPEN) ){

            return next()
        }

        const {isOpen} = req.body
        res.locals.filteredIsOpen= await filterEventsOpen(isOpen)

        next()
    }),

         asyncHandler(async(req,res)=>{

      
        //either of thses could be [] OR undefined
        const filteredVenue = res.locals.filteredVenue
        const filteredDate = res.locals.filteredDate
        const filteredIsOpen = res.locals.filteredIsOpen 

        let filteredResultsByKey = {}
        let idsWithTags = {}

        Object.keys(req.body).map((async(filterKey) => {

            switch (filterKey) {
                case FILTER_OPTIONS.DATE:
                    
                    // filteredResultsByKey[filterKey] = filteredDate
                    filteredResultsByKey = {...filteredResultsByKey, [filterKey]: filteredDate}
                    break;
            
                case FILTER_OPTIONS.IS_OPEN:

                    // filteredResultsByKey[filterKey] = filteredIsOpen
                    filteredResultsByKey = {...filteredResultsByKey, [filterKey]: filteredIsOpen}


                    break;

                case FILTER_OPTIONS.VENUE:
                    // filteredResultsByKey[filterKey] = filteredVenue
                    filteredResultsByKey = {...filteredResultsByKey, [filterKey]: filteredVenue}


                    break;
                default:
                    break;
            }

        }))


        const filteredAllIds = filterArrSortLoose(Object.values(filteredResultsByKey))
        
        filteredAllIds.forEach(id => {

            Object.entries(filteredResultsByKey).forEach(([filterKey, result]) => {

                if(result.includes(id) ) {

                    
                    // const isPropAlrExists = objKeysIncludes(idsWithTags, filterKey)
                    const isPropAlrExists = objKeysIncludes(idsWithTags, id)

                 
                    if(isPropAlrExists){

                        
                        idsWithTags = {...idsWithTags, [id]: [...idsWithTags[id], filterKey]}
                    }

                    else{

                        idsWithTags = {...idsWithTags, [id]: [filterKey]}
                        // idsWithTags[id] =[filterKey]
                    }
                }
            })
        })

        const sortedIdsWithTags = filteredTagsSort(idsWithTags)


        res.status(200).json({filteredResultsByKey, 
            filteredAllIds,
             idsWithTags,
            sortedIdsWithTags})

    })


    )

router.route('/dates')
    .get(eventsControllers.getAllEventsDates)
    

//combine sort
router.route('/sort')
    .get(eventsControllers.sortEvents)

module.exports =router;
