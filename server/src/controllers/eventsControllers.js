const asyncHandler = require("express-async-handler");

const Event = require("../models/Event");
const requiredInputChecker = require("../helpers/requiredInputChecker");
const includesSearchTerm = require('../helpers/includesSearchTerm')
const { filterEventsByVenue, filterEventsByDate, filterEventsOpen, filteredTagsSort, filterEventsUpcomingShifts } = require("../helpers/filterEventsHelper");
const { sortEventsHelper } = require("../helpers/sortEventsHelper");
const filterNonDuplicate = require("../helpers/filterNonDuplicate");
const { closestTo, isAfter,  isEqual, compareAsc } = require("date-fns");
const objKeysIncludes = require("../helpers/objKeysIncludes");

const { FILTER_OPTIONS } = require("../config/filterOptions");
const { SORT_OBJECT } = require("../config/sortOptions");
const elemObjIncludes = require("../helpers/elemObjIncludes");
const filterArrSortLoose = require("../helpers/filterArrSortLoose");
const sortUpcomingEventsDates = require("../helpers/sortUpcomingEventsDates");

const createNewEvent = asyncHandler(async(req,res)=>{

    //set localTime
    const {eventName, eventVenue,
        eventDates, eventDescription, shifts} = req.body

    
    if(requiredInputChecker(req.body)){
        return res.status(400).json({message: "All fields required"})
    }

    //NOT findById
    const duplicate = await Event.findOne({eventName}).lean().exec()

    if(duplicate){

        return res.status(400).json({message: "Alreday added event"})
    }

        
    const newEvent = new Event({...req.body})

        //handled by middleware validators 
    // newEvent.localEventDate = convertLocalDateString(newEvent.eventDate)

    await newEvent.save()
    //run middleware validators before saving

    //data.newVolunteer in front from queryFulfilled or unwrap()
    res.json({newEvent})
})

const getAllEvents = asyncHandler(async(req,res)=>{


    const events = await Event.find().lean()

    if(!events?.length){
        return res.status(400).json({message: "No events exist"})

    }

    //an arry of volunteers obj || {volunteers}
    res.json({events})

    

})





//search events
const searchEvents = asyncHandler(async(req,res)=>{

    // /search/?q=:query
    const {q} = req.query

    //this only returns exact matches
    // const allEvents = await Event.find({eventName: {$in: q}})

    const allEvents = await Event.find().lean()

    // console.log(typeof q);
    const matchingEvents = allEvents.filter(event => 

        includesSearchTerm(event.eventName, q) 
        ||
        includesSearchTerm(event.eventDescription, q)

    )
    //only "eventId" needed to look for each event in front
       .map(event=>( {eventId: event._id, eventName: event.eventName, eventDescription: event.eventDescription}))
        
    res.json({searchTerm: q, matchingEvents})




})

 



//get events date - to see what type of date is returned from mongoDB
const getAllEventsDates = asyncHandler(async(req,res)=> {


    const allEventsDates = await Event.find()
        .then(events => (

            events.map(event => (
                event.localEventDates
            ))
        ))
       
    res.json({allEventsDates})

    
})


//combine event sort 
const sortEvents = [
    asyncHandler(async(req,res, next) => {

        //only 1 sort option at a time
        const [[sortOption, orderBool]] = Object.entries(req.body)

        if(typeof orderBool !== 'boolean'){

            throw new Error('Sort val must be a boolean for either ascending or descending')
        }

        //sort by aplhabetically, or open positions
        if(sortOption === SORT_OBJECT.SOONEST.sortOption){
            console.log('next() to handle sort event dates');
            return next()
        }
        const sortedEvents = await sortEventsHelper(sortOption, orderBool)

        //serizlisation
                .then(events => (events.map(event =>( {eventId: event._id, eventName: event.eventName}))))

        res.json({sortedEvents})
}),


    //sort by soonest shift date
    asyncHandler(async(req,res)=> {



        const allEvents = await Event.find().lean().exec()

        //with recursion helper 

        // const sortUpcomingEventDatesFx = (event, datesArr, invalidArr =[]) => {

        //     const currentDate =new Date(Date.now())

        //     // const cmpDatesArray = datesArr.filter(date => invalidArr.includes(date)? false : true)
        //     const cmpDatesArray = datesArr.filter(date => (

        //         invalidArr.some(invalidDate => isEqual(invalidDate, date))
        //         ?
        //         false
        //         :
        //         true
        //     ))

        //     console.log('cmpDatesArray: ', cmpDatesArray);
        //     const closestToCurrentDate = closestTo(currentDate, cmpDatesArray)

        //     console.log("clossestToCurrentDate: ", closestToCurrentDate);

        //     //ether condi alone works
        //     if(
        //         closestToCurrentDate ===  undefined 
        //         ||
        //         !cmpDatesArray?.length 
        //         ){

        //         return []
        //     }

        //     if(isAfter(closestToCurrentDate, currentDate)){

        //                 console.log(closestToCurrentDate, " is after ", currentDate);
        //             //  return [{eventDate: closestToCurrentDate, eventName: event?.eventName, eventId: event?._id
        //             // //  return [{eventDate: closestToCurrentDate

        //             //     // eventId: event._id, eventName: event.eventName
        //             // }]

        //         return [{eventDate: closestToCurrentDate, eventName: event?.eventName,eventId: event?._id}]

        //     }



        //     // console.log('reched HERE - b4 next fx call');


        //     invalidArr.push(closestToCurrentDate)
        //     return sortUpcomingEventDatesFx(event, datesArr, invalidArr)

        //     // console.log('reched HERE - after fx called');

        // }

        // const sortedUpcomingEventsDates = allEvents.flatMap(event => {

        //     const result = sortUpcomingEventDatesFx(event, event.eventDates)

        //     console.log("result: ", result);

        //     return result
        // } )

        const sortedUpcomingEventsDates = sortUpcomingEventsDates(allEvents)

        const sortedEvents = [...sortedUpcomingEventsDates].sort((a,b) => compareAsc(a?.eventDate, b?.eventDate))

      
        res.json({
            
            sortedUpcomingEventsDates, 
        
            sortedEvents
        })



})
]

//[] keep the _id of shifts as before
const updateEventInfo = asyncHandler(async(req,res)=>{

    const {eventId, eventName, eventVenue,
        eventDates, eventDescription, shifts} = req.body

    if(requiredInputChecker(req.body)){
        return res.status(400).json({message: "All fields required"})
    }

    const existingEvent = await Event.findById(eventId).exec()

    if(!existingEvent){
        return res.status(400).json({message: "Event DNE for PUT event info"})
    }

    //eventName canNOT be the same as an exisintgEvent - ltr more rigorous srh algo
    const duplicate = await Event.findOne({eventName}).lean().exec()

    if(duplicate && duplicate._id.toString() !== existingEvent.id){

        return res.status(409).json({message: "The renamed eventName already exists", duplicateEvent: duplicate})
    }

 
    //algorize this
    // existingEvent.eventName = eventName
    // existingEvent.eventVenue = eventVenue
    // existingEvent.eventDates = eventDates
    // existingEvent.eventDescription = eventDescription
    // existingEvent.shifts = shifts

    
    //NOT a pojo, use toObject() to access keys/vals
    Object.keys(req.body).map((key) => {

        //updating shifts handled elsewhere
        if(key === 'shifts'){
            return null
        }
        const matchingEventKey = Object.keys(existingEvent.toObject()).find((eventKey)=> eventKey.includes(key))

        if(matchingEventKey !== undefined){

            existingEvent[matchingEventKey] = req.body[key]
        }



    })

    const existingAllShifts  = existingEvent.shifts


    await Promise.all(shifts.map(async (returnedShift) => {

        const existingShift =existingAllShifts.find(shift => shift._id.toString() === returnedShift?.shiftId)

        console.log('existingShift: ', existingShift);
        if(existingShift){

            console.log('retunredShiftObj: ',returnedShift);
            console.log('returnedShiftObj shiftStart into Date: ',new Date(returnedShift.shiftStart))
            // existingShift = {...existingShift,
            //     shiftStart: returnedShift.shiftStart,
            //     shiftEnd: returnedShift.shiftEnd,
            //     shiftPositions: returnedShift.shiftPositions
            // }

            // existingEvent.shifts

        
           const res = await Event.updateOne(
                {   _id: existingEvent._id,
                    "shifts._id": existingShift._id },

                { $set: { "shifts.$.shiftStart": new Date(returnedShift.shiftStart),
                            "shifts.$.shiftEnd": new Date(returnedShift.shiftEnd),
                            "shifts.$.shiftPositions": returnedShift.shiftPositions
                    } },

                
            )

            console.log('res: ', res);

           
        }

        else{
            existingEvent.shifts.push(returnedShift)

            await existingEvent.save()
        }
    }))

    
    

    const udpatedEvent =existingEvent

    console.log('udpatedEvent: ', udpatedEvent);
    res.json({existingEvent})
  

})

const addShiftToEvent = asyncHandler(async(req,res)=> {

    const {eventId, shiftStart, shiftEnd, shiftPositions}= req.body

    const existingEvent = await Event.findById(eventId).exec()

    if(!existingEvent){
        return res.status(400).json({message: "event DNE to add shift"})
    }

    existingEvent.shifts.push({shiftStart, shiftEnd, shiftPositions})

    const eventWithAddedShifts =await existingEvent.save()

    
    res.json({eventWithAddedShifts})

})

const getSignedUpVolunteers = asyncHandler(async(req,res)=>{

    const {eventId} = req.body
    if(requiredInputChecker(req.body)){
        return res.status(400).json({message: "All fields required"})
    }

    const currentEvent = await Event.findById(eventId).lean().exec()

    
    if(!currentEvent){
        return res.status(400).json({message: "event DNE to get the signedUP voluns"})
    }

    const shiftVolunteers = currentEvent.shifts.map(shift => {

        return {shiftId: shift._id,
                volunteerIds: shift.signedUpVolunteers
            }
    })


    const allVolunIds = currentEvent.shifts.flatMap(shift => (shift.signedUpVolunteers))
                                         .map(volunId =>  volunId.toString())

    console.log('all volun ids with flatMap, including duplicates: ', allVolunIds);

    const totalUniqueVolunteers = {
        
        uniqueVolunteersIds: filterNonDuplicate(allVolunIds),

    }

    totalUniqueVolunteers.count = totalUniqueVolunteers.uniqueVolunteersIds.length

    res.json({shiftVolunteers, totalUniqueVolunteers})
    
})

const filterEvents = 
[   //venue filter
        asyncHandler(async(req,res,next)=> {


            // if(!Object.keys(req.body).includes(FILTER_OPTIONS.VENUE)){
            if(!objKeysIncludes(req.body,FILTER_OPTIONS.VENUE ) 
                ){

                return next()
            }

            const {venue} = req.body
            res.locals.filteredVenue = await filterEventsByVenue(venue)

            next()
        }),


        //date filter
        asyncHandler(async(req,res, next)=>{

            if(!objKeysIncludes(req.body,FILTER_OPTIONS.DATE) 
                 
                ){
                return next()
            }

            
            const {date} = req.body
            console.log('filterDate: ', date);
            res.locals.filteredDate = await filterEventsByDate(date)

            next()
        }),

        //isOpen filter
        asyncHandler(async(req,res, next)=>{

            if(!objKeysIncludes(req.body, FILTER_OPTIONS.IS_OPEN) 
            ){

                return next()
            }

            const {isOpen} = req.body
            res.locals.filteredIsOpen= await filterEventsOpen(isOpen)

            next()
        }),

        //isUpcomingShifts filter
        asyncHandler(async(req,res, next)=>{

             if(!objKeysIncludes(req.body, FILTER_OPTIONS.IS_UPCOMING) 
            ){

            return next()
             }

            const {isUpcoming} = req.body
            res.locals.filteredIsUpcoming= await filterEventsUpcomingShifts(isUpcoming)

            next()

        }),

        //sorted filter
        asyncHandler(async(req,res)=>{


            //any of thses could be [] OR undefined
            const filteredVenue = res.locals.filteredVenue
            const filteredDate = res.locals.filteredDate
            const filteredIsOpen = res.locals.filteredIsOpen 
            const filteredIsUpcoming = res.locals.filteredIsUpcoming

            let filteredResultsByKey = {}
            let idsWithTags= []

            console.log("value of req.body for filterEvent: ", {...req.body});
            Object.keys(req.body).map(((filterKey) => {

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

                    case FILTER_OPTIONS.IS_UPCOMING:
                        filteredResultsByKey = {...filteredResultsByKey, [filterKey]: filteredIsUpcoming}

                    default:
                        break;
                }

            }))


            const filteredAllIds = filterArrSortLoose(Object.values(filteredResultsByKey))

            filteredAllIds.forEach( (id) => {

            Object.entries(filteredResultsByKey).forEach(([filterKey, result]) => {

                    if(result.includes(id) ) {

                    

                        const isEventIdAlrExists = elemObjIncludes(idsWithTags, id)
                    
                
                        if(isEventIdAlrExists){


                            const bufferArr = idsWithTags.map(event => {

                                if(event.eventId === id){

                                    event = {...event, filterTags: [...event.filterTags, filterKey]}
                                //return event DNR(return) every event
                                }

                                return event
                            })

                            idsWithTags = bufferArr
                        }
                        else{

                            //for better normalization in front
                            //   idsWithTags = [...idsWithTags, {  eventId: id,  
                            //     filterTags: [filterKey]}]

                            idsWithTags.push({eventId: id, filterTags: [filterKey]})
                        }
                    }
                })
            
            })

            const sortedIdsWithTags = filteredTagsSort(idsWithTags)

            console.log('idsWIthTags: ',idsWithTags);
            console.log('sortedIdsWithTags: ',sortedIdsWithTags);
            // console.log"arr idsWithTags: ", idsWithTags);

            res.status(200).json({filteredResultsByKey, 
                filteredAllIds,
                idsWithTags,
                sortedIdsWithTags
} )

})]


module.exports = {
    createNewEvent,
    getAllEvents,
    updateEventInfo,

    searchEvents,

    getAllEventsDates,

    sortEvents,

    addShiftToEvent,


    getSignedUpVolunteers,

    filterEvents       
};
