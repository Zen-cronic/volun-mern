import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchedEvents } from '../eventsSlice'
import EventListLayout from '../EventListLayout'
import SearchedEventExcerpt from './SearchedEventExcerpt'
import { useSearchParams } from 'react-router-dom'

const SearchedEventsList = () => {

    const searchedEvents = useSelector(selectSearchedEvents)

    const [searchParams, _] = useSearchParams()
    const searchTerm = searchParams.get('q') || ""

    console.log("searchTerm from SearchedEventsList: ", searchTerm);

   const content = searchedEvents.map((event) => {

        
        const eventId = event.eventId 
       return ( <tr key={eventId}>
        {/* <EventExcerpt key={eventId} eventId={eventId}/> */}
        <SearchedEventExcerpt key={eventId} eventId={eventId} searchTerm={searchTerm}/>
           </tr>)
    
})

  return <EventListLayout tableBodyContent={content}/>
}

export default SearchedEventsList