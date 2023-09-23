const convertLocalDateString = require("./convertLocalDateString")
const Event = require("../models/Event")
const { VENUES } = require("../config/eventVenues")
const hourMinFormat = require("./hourMinFormat")


//filter by date
const filterEventsByDate = async(date)=>{



    // console.log('Input str -> Date: ', new Date(date + "T05:00"))
    // console.log('utc input date: ',new Date(date))

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
    // res.json({matchingEvents})
    return matchingEvents
}




//filter by venue
const filterEventsByVenue = async(venue)=> {

    // const {venue}= venue

    // if(!Object.values(VENUES).includes(venue)){

    //     // return res.status(400).json({message: "Venue DNE"})
    //     throw new Error('venue not found')
    // }
    const eventsByVenuesIds = await Event.find({eventVenue: {$eq:venue }})
        .then(events => (
            events.map(event => (
                event._id.toString()
            ))
        ))
    // console.log(eventsByVenues);
    // res.json({eventsByVenues})
    // return new Promise(eventsByVenues)
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


//filteredIdsWTags Obj as param

const filteredTagsSort = (obj)=> {

    if(!(obj instanceof Object)){

        throw new Error('Must be an obj for sorting filtered tags')
    }


   const sortedEntries = [...Object.entries(obj)].sort((a,b) => {

        //[1] = value, [0] = key
        if (a[1].length < b[1].length ) {
            return 1;
          } else if (a[1].length > b[1].length ) {
            return -1;
          }
          return 0;
        
   })

   const sortedObj = Object.fromEntries(sortedEntries)

    return sortedObj
}


module.exports = {
    filterEventsByDate, 
    filterEventsByVenue,
    filterEventsOpen,

    filteredTagsSort
};
