import React from 'react'
// import EventFilter from './filter/EventFilter'
import {  Outlet, useNavigate } from 'react-router'
import { Link } from 'react-router-dom';
import EventFilter from './filter/EventFilter';
import EventSort from './sort/EventSort';
import EventSearchBar from './search/EventSearchBar';

const EventHeader = () => {

  // const navigate = useNavigate()
  // const onBackToEventsClick = ()=> {

  //   navigate('/events', {replace: true})
  // }

  return (
    
    <>{<EventFilter/>}
      {<EventSort/>}
      {<EventSearchBar/>}
     <div>
           <Link to={'/dash/events'}>Back to Events List</Link>
           {/* <Navigate to={'/events'}>Back to Events List</Navigate> */}

            {/* <button type='button' onClick={onBackToEventsClick}>Back to Events List</button> */}
        </div>

       
        <Outlet/>
       
      
    </>
  )
}

export default EventHeader