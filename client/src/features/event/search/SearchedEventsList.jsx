import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchedEvents } from '../eventsSlice'
import EventExcerpt from '../EventExcerpt'
import EventListLayout from '../EventListLayout'

const SearchedEventsList = () => {

    const sortedEvents = useSelector(selectSearchedEvents)

   const content = sortedEvents.map((event) => {

        
        const eventId = event.eventId 
       return ( <tr key={eventId}>
        <EventExcerpt key={eventId} eventId={eventId}/>
           </tr>)
    
})

  return <EventListLayout tableBodyContent={content}/>
}

export default SearchedEventsList