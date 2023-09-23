import React from 'react'
import EventFilter from './EventFilter'
import { Navigate, Outlet, useNavigate } from 'react-router'
import { Link } from 'react-router-dom';

const EventHeader = () => {

  const navigate = useNavigate()
  const onBackToEventsClick = ()=> {

    navigate('/events', {replace: true})
  }

  return (
    
    <>{<EventFilter/>}
     <div>
           {/* <Link to={'/events'}>Back to Events List</Link> */}
           {/* <Navigate to={'/events'}>Back to Events List</Navigate> */}

            <button type='button' onClick={onBackToEventsClick}>Back to Events List</button>
        </div>

       
        <Outlet/>
       
      
    </>
  )
}

export default EventHeader