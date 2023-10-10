const convertLocalDateString = require("./convertLocalDateString")
const Event = require("../models/Event")
const hourMinFormat = require("./hourMinFormat")
const { closestTo, isAfter,  isEqual, compareAsc } = require("date-fns");
const sortUpcomingEventsDates = require("./sortUpcomingEventsDates");


//filter by date
const filterEventsByDate = async(date)=>{


    const matchingEvents = await Event.find().lean().exec()
        .then((events) => (

            events.filter(event => {

              
                const convertedDateWithTime =  new Date(date + hourMinFormat())

                const currentlocalDateStr= convertLocalDateString(convertedDateWithTime)
                // const localDateStr= convertLocalDateString(new Date(date + convertedTime))
              
                const localEventDatesArrSplit = event.localEventDates.map(dateStr => (dateStr.split(' ')[0]))

                console.table('localEventDatesArrSplit from filterEventsHelper: ', localEventDatesArrSplit);
                //if currentLocalDateStr is included in event.localEventDates[].split()
                // if(currentlocalDateStr.split(' ')[0] === localEventDateStr.split(' ')[0]){
                if(localEventDatesArrSplit.includes(currentlocalDateStr.split(' ')[0])){

                    
                    return true
                }

                return false
            })

            
        ))
        .then(events => (
            events.map(event => (
                event._id.toString()
            ))
        ))

    return matchingEvents
}




//filter by venue
const filterEventsByVenue = async(venue)=> {

   
    const eventsByVenuesIds = await Event.find({eventVenue: {$eq:venue }})
        .then(events => (
            events.map(event => (
                event._id.toString()
            ))
        ))
    
    return eventsByVenuesIds
}

//filter open 
const filterEventsOpen = async(isOpen) => {


    // if(!isOpen){
    //     throw new Error('isOPen must be true')

    // }

    if(!isOpen){
        return Promise.resolve([])
    }

  //{ age: { $gt: 50 } }
  const events = await Event.find({openPositions: {$gt: 0}}).lean()
  .then(events => (
      events.map(event => (
          event._id.toString()
      ))
  ))
  

// if(!events?.length){

//     throw new Error('No open events')

// }



return events
}

//filter upcoming (+ auto sorted)
const filterEventsUpcomingShifts = async(isUpcoming) => {


    //must be true
    if(!isUpcoming){
        return Promise.resolve([])
    }

    const allEvents = await Event.find().lean().exec()

    //with recursion

    // const sortedUpcomingEventDatesFx = (event, datesArr, invalidArr =[]) => {

    //     const currentDate =new Date(Date.now())


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

    //     //ethier condi alone works
    //     if(
    //         closestToCurrentDate ===  undefined 
    //         ||
    //         !cmpDatesArray?.length 
    //         ){

    //         return []
    //     }

    //     if(isAfter(closestToCurrentDate, currentDate)){

    //         console.log(closestToCurrentDate, " is after ", currentDate);
                
    //         return [{eventDate: closestToCurrentDate, eventName: event?.eventName,eventId: event?._id}]

    //     }



    //     // console.log('reched HERE - b4 next fx call');


    //     invalidArr.push(closestToCurrentDate)
    //     return sortedUpcomingEventDatesFx(event, datesArr, invalidArr)

    // // console.log('reched HERE - after fx called');

    // }

    // const sortedUpcomingEventsDates = allEvents.flatMap(event => {

    //     const result = sortedUpcomingEventDatesFx(event, event.eventDates)

    //     console.log("recursed result: ", result);

    //     return result
    // } )

    const sortedUpcomingEventsDates = sortUpcomingEventsDates(allEvents)

    const filteredEventIds =  sortedUpcomingEventsDates.map(event => (
            event?.eventId.toString()
    ))


    console.log('filtereedEventIds: ', filteredEventIds );
    console.log('sortedUpcomingEventsDates from filterEventsHelper ', sortedUpcomingEventsDates);

    return filteredEventIds
}


//similar to sortOrder - except .length property on the value found by index
//@Param shape: arr = [{eventId:... , filterTags: ...}]

const filteredTagsSort = (arr)=> {

    if(!Array.isArray(arr)){

        throw new Error('Must be an array for sorting filtered tags')
    }

    const sortIndex= 'filterTags'
   const sortedArr = [...arr].sort((a,b) => {


        if(a[sortIndex].length < b[sortIndex].length){
        

            return 1;

         }else if(a[sortIndex].length > b[sortIndex].length){
                return -1;
          }
          return 0;
        
   })

   console.log('sortedEntries from filterTagsSort: ');
   sortedArr.map(entry => {
       console.log(entry);
   })
    return sortedArr
}


module.exports = {
    filterEventsByDate, 
    filterEventsByVenue,
    filterEventsOpen,
    filterEventsUpcomingShifts,
    filteredTagsSort
};
