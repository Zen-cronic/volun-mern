import React from 'react'
import { useSelector } from 'react-redux'
import { selectSortedEvents } from '../eventsSlice'
import EventExcerpt from '../EventExcerpt'

const SortedEventsList = () => {

    const sortedEvents = useSelector(selectSortedEvents)

   const content = sortedEvents.map((event) => {

        
        // const eventId = event.eventId ? event.eventId : event._id
        const eventId = event.eventId 

    //    return <EventExcerpt key={event.eventId} eventId={event.eventId}/>
       return <EventExcerpt key={eventId} eventId={eventId}/>
    
})

  return content
}

export default SortedEventsList