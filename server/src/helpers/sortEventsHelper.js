
const { SORT_OBJECT} = require("../config/sortOptions")
const Event = require("../models/Event")
const sortOrder = require("./sortOrder")

// const sortEventsAlphabetically = async(orderBool)=> {

//     const allSortedEvents = await Event.find().lean()
   
//     .then(events => (

//         sortOrder(events, 'eventName', orderBool)
//     ))
    
//     return allSortedEvents




// }

// //sort events by soonest date
// const sortEventsBySoonest = async(orderBool)=> {

//     const allSortedEvents = await Event.find().lean()

//     .then(events => (

//         sortOrder(events, 'eventDate', orderBool)
      
//     ))
    
//    return allSortedEvents




// }

// const sortEventsByOpen = async(orderBool)=> {

//     const allSortedEvents = await Event.find().lean()

//     .then(events => (

//         sortOrder(events, 'openPositions', orderBool)
//     ))
    
//     return allSortedEvents




// }

const sortEventsHelper = async(sortOption,orderBool) => {

    // let sortIndex = Object.values(SORT_INDEX).find(sortIndex => (Object.values(SORT_OPTIONS) === sortOption))

   const {sortIndex} = Object.values(SORT_OBJECT).find(opt => (opt.sortOption === sortOption))
  
    const allSortedEvents = await Event.find().lean()

    .then(events => (


        sortOrder(events, sortIndex, orderBool)
    ))
    
    return allSortedEvents

}
module.exports = {
    // sortEventsAlphabetically,
    // sortEventsByOpen,
    // sortEventsBySoonest,

    sortEventsHelper
};
