const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const requiredInputChecker = require("../helpers/requiredInputChecker");
const User = require("../models/User");
const includesSearchTerm = require('../helpers/includesSearchTerm')
const convertLocalDateString = require("../helpers/convertLocalDateString");

const {VENUES} = require('../config/eventVenues');
const { filterEventsByVenue, filterEventsByDate, filterEventsOpen, filteredTagsSort } = require("../helpers/filterEventsHelper");
const { FILTER_OPTIONS } = require("../config/filterOptions");
const filterArrSortLoose = require("../helpers/filterArrSortLoose");
const { SORT_OPTIONS, SORT_OBJECT } = require("../config/sortOptions");
const { sortEventsHelper } = require("../helpers/sortEventsHelper");
const objKeysIncludes = require("../helpers/objKeysIncludes");
const filterNonDuplicate = require("../helpers/filterNonDuplicate");
const { closestTo, isAfter,  isEqual, compareAsc } = require("date-fns");

const serializer = require('express-serialize');
const serialize = require("express-serialize/lib/express-serialize");



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




//update Event info 

//update Event VOlunteer count - auto prefetch PATCH
// const updateEventVolunteersCount = asyncHandler(async(req,res)=>{

//     const {eventId} = req.body

//     if(requiredInputChecker(req.body)){
//         return res.status(400).json({message: "All fields required"})
//     }

//     const existingEvent = await Event.findById(eventId).exec()

//     if(!existingEvent){
//         return res.status(400).json({message: "Event DNE for PATCH event volun update"})
//     }

//     const volunteersForThisEvent = await User.find({signedUpEvents: {$eq: existingEvent._id}})

//     volunteersForThisEvent.map((volun)=> {

//         if(!existingEvent.eventVolunteers.includes(volun._id)){

//             existingEvent.eventVolunteers.push(volun._id)

//         } 
//     })


//     await existingEvent.save()

//     res.json({volunteersForThisEvent, existingEvent})
// })

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



//combine filter
// const filterEvents = asyncHandler(async(req, res)=> {

//     let filterArrObj = {}

//     let filteredIds = []
//     let filteredIdsWTags = {}

//     // let filteredSortedIdsWTags = filteredTagsSort(filteredIdsWTags)

//     //this map is async
//     const result = await Promise.all(Object.entries(req.body).map((async([key, val]) => {

       

//         console.log([key, val]);

//         let propArr 

//         switch (key) {
//             case FILTER_OPTIONS.VENUE:

//                 propArr = await filterEventsByVenue(val)
//                 break;

//             case FILTER_OPTIONS.DATE:

//                 propArr = await filterEventsByDate(val)

//                 break;

//             case FILTER_OPTIONS.IS_OPEN:

//                 propArr = await filterEventsOpen(val)

//                 break;
            
//             default:
//                 break;
//         }

//         filterArrObj[key] = propArr
//     }))
//     )
    

//     if(Object.keys(filterArrObj).length > 1){

//         // filteredIds = filterTwoDArrSort(Object.values(filterArrObj))

//         filteredIds = filterArrSortLoose(Object.values(filterArrObj))

//              //throws arg not arr Error from filterArrSort helper
//         // finalFilterArr = filterArrSort(filterArrObj)

//     //    filterArr = filterArrSort(filterArr)

//     }
//     else{

//         filteredIds = Object.values(filterArrObj)

//     }

 
//     const tagsArr = Object.keys(filterArrObj)
//     const idsArr = Object.values(filterArrObj)

//     console.log(idsArr);
//     for(let i = 0; i<filteredIds.length; i++){

       
//         for(let j=0; j<idsArr.length; j++){

//             const currentId = filteredIds[i]
//             console.log(currentId);

//             const isPropAlrExists = objKeysIncludes(filteredIdsWTags, currentId)
//             const isInIdsArr =  idsArr[j]?.includes(currentId)
//             if(
//                 // !Object.keys(filteredIdsWTags)?.includes(currentId) 
//                  !isPropAlrExists 
//                 && isInIdsArr
//                ){

//                 // filteredIdsWTags[filteredIds[i]] = Object.values(filterArrObj)[j]

//                 //prop for tags obj - key id : val tags
//                 filteredIdsWTags[currentId] =[ tagsArr[j]]
//             }

//             //is id alr exist and is included in tag
//             else if(
//                 // Object.keys(filteredIdsWTags)?.includes(currentId) 
//                  isPropAlrExists
//                  && isInIdsArr
//                 // && Array.isArray( filteredIdsWTags[currentId])

//             ){

//         //curruenId prop should be used as an expression
//                  filteredIdsWTags =  {...filteredIdsWTags, [currentId] : [...filteredIdsWTags[currentId],tagsArr[j]] }


//         //the remainnig tags appear correctly
//         // console.log('another elem to be added to prop val arr', tagsArr[j]);
            
//             }

   

         
//         }

//     }

//     const filteredSortedIdsWTags = filteredTagsSort(filteredIdsWTags)

//     console.log("Final filter: ", filteredIds);

//      res.json({
//         filterArrObj, 
//         filteredIds,
//         filteredIdsWTags, 
//         filteredSortedIdsWTags
//        })
// })



//sort events alphabetically
// const sortEventsAlphabetically = asyncHandler(async(req,res)=> {

//     const allSortedEvents = await Event.find().lean()
//     // .select(['eventName', 'eventDate', '_id'])
//     // .then(events => (

//     //     events.map(event => (
//     //         event.eventName
//     //     ))
//     // ))
//     .then(events => (

//        events.sort((a,b) => {

//             if (a.eventName< b.eventName) {
//                 return -1;
//               } else if (a.eventName > b.eventName ) {
//                 return 1;
//               }
//               return 0;
            
//        })
//     ))
    
//     res.json({allSortedEvents})




// })

// //sort events by soonest date
// const sortEventsBySoonest = asyncHandler(async(req,res)=> {

//     const allSortedEvents = await Event.find().lean()

//     .then(events => (

//        events.sort((a,b) => {

//             if (a.eventDate< b.eventDate) {
//                 return -1;
//               } else if (a.eventDate > b.eventDate ) {
//                 return 1;
//               }
//               return 0;
            
//        })
//     ))
    
//     res.json({allSortedEvents})




// })

// const sortEventsByOpen = asyncHandler(async(req,res)=> {

//     const allSortedEvents = await Event.find().lean()

//     .then(events => (

//        events.sort((a,b) => {

//             if (a.openPositions< b.openPositions) {
//                 return -1;
//               } else if (a.openPositions > b.openPositions ) {
//                 return 1;
//               }
//               return 0;
            
//        })
//     ))
    
//     res.json({allSortedEvents})




// })

//combine event sort 
const sortEvents = [
    asyncHandler(async(req,res, next) => {

    //only 1 sort option at a time
    const [[sortOption, orderBool]] = Object.entries(req.body)

    if(typeof orderBool !== 'boolean'){

        throw new Error('Sort val must be a boolean for either ascending or descending')
    }

    if(sortOption === SORT_OBJECT.SOONEST.sortOption){
        console.log('next() to handle sort event dates');
        return next()
    }
    const sortedEvents = await sortEventsHelper(sortOption, orderBool)

    //serizlisation
            .then(events => (events.map(event =>( {eventId: event._id, eventName: event.eventName}))))

    // sortedEvents = sortedEvents.map(event =>( {eventId: event._id, eventName: event.eventName}))
    res.json({sortedEvents})
}),

    asyncHandler(async(req,res)=> {



        const allEvents = await Event.find().lean().exec()

        //w recursion

        const sortEventDatesFx = (event, datesArr, invalidArr =[]) => {

        const currentDate =new Date(Date.now())

        // const cmpDatesArray = datesArr.filter(date => invalidArr.includes(date)? false : true)
        const cmpDatesArray = datesArr.filter(date => (

            invalidArr.some(invalidDate => isEqual(invalidDate, date))
            ?
            false
            :
            true
        ))

        console.log('cmpDatesArray: ', cmpDatesArray);
        const closestToCurrentDate = closestTo(currentDate, cmpDatesArray)

        console.log("clossestToCurrentDate: ", closestToCurrentDate);

        //ether condi alone works
        if(
            closestToCurrentDate ===  undefined 
            ||
            !cmpDatesArray?.length 
            ){

            return []
        }

        if(isAfter(closestToCurrentDate, currentDate)){

                    console.log(closestToCurrentDate, " is after ", currentDate);
                //  return [{eventDate: closestToCurrentDate, eventName: event?.eventName, eventId: event?._id
                // //  return [{eventDate: closestToCurrentDate

                //     // eventId: event._id, eventName: event.eventName
                // }]

            return [{eventDate: closestToCurrentDate, eventName: event?.eventName,eventId: event?._id}]

        }


        // return undefined

        console.log('reched HERE');


        invalidArr.push(closestToCurrentDate)
        return sortEventDatesFx(event, datesArr, invalidArr)

        // console.log('reched to here');
        // return []

        }

        const sortedEventsDates = allEvents.flatMap(event => {

        const result = sortEventDatesFx(event, event.eventDates)

        console.log("result: ", result);

        return result
        } )

        const sortedEvents = [...sortedEventsDates].sort((a,b) => compareAsc(a?.eventDate, b?.eventDate))

        //when sortedEventsDates return [] empty
        // const emptySortedEvents = [].sort((a,b) => compareAsc(a.eventDate, b.eventDate))
        res.json({sortedEventsDates, 
        // sortedEvents, 
        // emptySortedEvents
        sortedEvents
        })



})
]


//combine normal sorts with sortEventsDates abv as arr
const sortEventsDates = asyncHandler(async(req,res)=> {

            //canNOt tell what sort options will be passed - but here can tell
    // const [[sortOption, orderBool]] = Object.entries(req.body)

    // const {soonest} = req.body

    const allEvents = await Event.find().lean().exec()


    // const sortedEventsDates = allEvents.map(event => {
    // const sortedEventsDates = allEvents.flatMap(event => {

    //     const closestToCurrentDate = closestTo(currentDate, event.eventDates)
    //     if( isAfter(closestToCurrentDate, currentDate)){
    //     // if( isBefore(closestToCurrentDate, currentDate)){

    //         return [{eventDate: closestToCurrentDate, eventId: event._id, eventName: event.eventName}]
    //     }



    //     // return []

    //     else{

    //         invalidArr.push(closestToCurrentDate)

    //             //only works if only 1 invalid date
    //         // const anotherClosest = closestTo(currentDate, [...event.eventDates.splice(event.eventDates.indexOf(closestToCurrentDate), 1)])

    //             //DNW - need to remove invalid date(s) from params
    //         // const anotherClosest = closestTo(currentDate, [...event.eventDates])

    //         const anotherClosest = closestTo(currentDate, event.eventDates.filter(date => invalidArr.includes(date)? false: true))
    //         if( isAfter(anotherClosest, currentDate)){
    //             // if( isBefore(closestToCurrentDate, currentDate)){
        
    //                 return [{eventDate: closestToCurrentDate, eventId: event._id, eventName: event.eventName}]
    //             }

    //         else 
    //             return []
    //     }

    // })

        //w recursion
    
    const sortEventDatesFx = (event, datesArr, invalidArr =[]) => {

        const currentDate =new Date(Date.now())
    
        // const cmpDatesArray = datesArr.filter(date => invalidArr.includes(date)? false : true)
        const cmpDatesArray = datesArr.filter(date => (

            invalidArr.some(invalidDate => isEqual(invalidDate, date))
            ?
            false
            :
            true
        ))
        
        console.log('cmpDatesArray: ', cmpDatesArray);
        const closestToCurrentDate = closestTo(currentDate, cmpDatesArray)

        console.log("clossestToCurrentDate: ", closestToCurrentDate);

        //ether condi alone works
        if(
            closestToCurrentDate ===  undefined 
            ||
            !cmpDatesArray?.length 
            ){

            return []
        }
        
        if(isAfter(closestToCurrentDate, currentDate)){

                    console.log(closestToCurrentDate, " is after ", currentDate);
                //  return [{eventDate: closestToCurrentDate, eventName: event?.eventName, eventId: event?._id
                // //  return [{eventDate: closestToCurrentDate

                //     // eventId: event._id, eventName: event.eventName
                // }]

            return [{eventDate: closestToCurrentDate, eventName: event?.eventName,eventId: event?._id}]

        }

        
        // return undefined

        console.log('reched HERE');


        invalidArr.push(closestToCurrentDate)
        return sortEventDatesFx(event, datesArr, invalidArr)

        // console.log('reched to here');
        // return []
        
    }

    const sortedEventsDates = allEvents.flatMap(event => {

        const result = sortEventDatesFx(event, event.eventDates)

        console.log("result: ", result);

        return result
    } )

    const ascendingEvents = [...sortedEventsDates].sort((a,b) => compareAsc(a?.eventDate, b?.eventDate))

        //when sortedEventsDates return [] empty
    // const emptySortedEvents = [].sort((a,b) => compareAsc(a.eventDate, b.eventDate))
    res.json({sortedEventsDates, 
        // sortedEvents, 
        // emptySortedEvents
        ascendingEvents
    })



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

    const volunteersOfShiftObj = currentEvent.shifts.map(shift => {

        return {shiftId: shift._id,
                volunteerIds: shift.signedUpVolunteers
            }
    })


    const allVolunIds = currentEvent.shifts.flatMap(shift => (shift.signedUpVolunteers))
                                         .map(volunId =>  volunId.toString())

    console.log('all volun ids with flatMap, including duplicates: ', allVolunIds);

    const totalUniqueVolunteers = {
        
        uniqueVolunteers: filterNonDuplicate(allVolunIds),

    }

    totalUniqueVolunteers.count = totalUniqueVolunteers.uniqueVolunteers.length

    res.json({volunteersOfShiftObj, totalUniqueVolunteers})
    
})

module.exports = {
    createNewEvent,
    getAllEvents,
    // getOpenEvents,

    // updateEventVolunteersCount,
    searchEvents,

    getAllEventsDates,

    // filterEventsByDate,
    // filterEventsByVenue, 
    // filterEvents,

    // sortEventsAlphabetically,
    // sortEventsBySoonest,
    // sortEventsByOpen,

    sortEvents,

    addShiftToEvent,

    getSignedUpVolunteers,

    // sortEventsDates         
};
