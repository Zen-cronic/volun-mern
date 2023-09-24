import React from 'react'
import { useGetEventsQuery } from './eventsApiSlice'
import EventExcerpt from './EventExcerpt'
import { Link } from 'react-router-dom'

const EventList = () => {

    const {data: events, isSuccess: isEventsSuccess, isLoading, isError, error } = useGetEventsQuery('eventsList', {

        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if(isEventsSuccess){

        const {ids} = events
        console.log('all Events ids from useQUery:', ids);
        content = ids.map((eventId) => (

            <EventExcerpt key={eventId} eventId={eventId}/>
        ))
    }

  return (
    <>
         <div>
          <Link to={'/dash/events/new'}>Add new event</Link>
        </div>
        {content}
    </>
  )
}

export default EventList