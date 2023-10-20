import React from 'react'
import { useSelector } from 'react-redux'
import { selectSortedEvents } from '../eventsSlice'
import EventExcerpt from '../EventExcerpt'
import EventListLayout from '../EventListLayout'

const SortedEventsList = () => {

    const sortedEvents = useSelector(selectSortedEvents)

   const content = sortedEvents.map((event) => {

        
        // const eventId = event.eventId ? event.eventId : event._id
        const eventId = event.eventId 

    //    return <EventExcerpt key={event.eventId} eventId={event.eventId}/>
       return ( <tr key={eventId}>
        <EventExcerpt key={eventId} eventId={eventId}/>
           </tr>)
    
})

  return <EventListLayout tableBodyContent={content}/>
}

export default SortedEventsList