import React from 'react'
// import EventFilter from './filter/EventFilter'
import {  Outlet, useNavigate } from 'react-router'
import { Link } from 'react-router-dom';
import EventFilter from './filter/EventFilter';
import EventSort from './sort/EventSort';
import EventSearchBar from './search/EventSearchBar';

const EventHeader = () => {


  return (
    
    <>{<EventFilter/>}
      {<EventSort/>}
      {<EventSearchBar/>}
     <div>
           <Link to={'/dash/events'}>Back to Events List</Link>
      </div>

       
        <Outlet/>
       
      
    </>
  )
}

export default EventHeader