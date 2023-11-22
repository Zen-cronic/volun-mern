import React from 'react'
import EventHeader from '../features/event/EventHeader'
import EventList from '../features/event/EventList'
import useAuth from '../hooks/useAuth'

const PublicEvents = () => {

    const authData = useAuth()
    const content = (

        <>
            {/* <EventHeader/> */}
            <EventList/>
        </>
    )

    console.log("guest info: ", authData);
  return content
}

export default PublicEvents