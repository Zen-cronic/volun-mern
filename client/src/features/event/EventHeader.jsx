import React from 'react'
import EventFilter from './EventFilter'
import { Outlet } from 'react-router'

const EventHeader = () => {
  return (
    <>{<EventFilter/>}
        <Outlet/>
    </>
  )
}

export default EventHeader