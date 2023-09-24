import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchedEvents } from '../eventsSlice'
import EventExcerpt from '../EventExcerpt'

const SearchedEventsList = () => {

    const sortedEvents = useSelector(selectSearchedEvents)

   const content = sortedEvents.map((event) => {

        
        const eventId = event.eventId 
       return <EventExcerpt key={eventId} eventId={eventId}/>
    
})

  return content
}

export default SearchedEventsList