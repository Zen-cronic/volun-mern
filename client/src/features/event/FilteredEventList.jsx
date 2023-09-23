import React from 'react'
// import { useLazyPostFilteredEventsQuery } from './eventsApiSlice'
import EventExcerpt from './EventExcerpt'
import { useSelector } from 'react-redux'
import { selectFilteredEvents } from './eventsSlice'

//rmove async!
const FilteredEventList = () => {

    // const [filterEvents, {data: filteredEventsData, isSuccess, isLoading, isUninitialized}] = useLazyPostFilteredEventsQuery()

    // await filterEvents({venue, isOpen}, true)

    
    const filteredEvents = useSelector(selectFilteredEvents)

    console.log("filteredEvents from eventSlice w selector: ", filteredEvents);
    let content

    // if(!filteredEvents){
    //     return null
    // }

    content = filteredEvents.map((event) => {

        
            const eventId = event.eventId

        //    return <EventExcerpt key={event.eventId} eventId={event.eventId}/>
           return <EventExcerpt key={eventId} eventId={eventId}/>
        
    })

    

    // if(isUninitialized){

    //     results = (<p>query has not be initialized yet</p>)
    // }
  return content
}

export default FilteredEventList