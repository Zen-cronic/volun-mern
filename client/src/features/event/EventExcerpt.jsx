
import { Link } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { selectEventById } from './eventsApiSlice';


//chges aft createEA 
//send only the id, and look for each Event using the id and render it 

const EventExcerpt = ({ eventId }) => {

    const event = useSelector(state => (selectEventById(state, eventId)))
    
    // console.log('each event entity for eventExcerpt: ', event);

    let content 

    if(!event){

        content = <p>Event NOT found</p>
    }

    else{

        content = (
            <article>
                <h2>{event.eventName}</h2>
                <p className="excerpt">{event.eventDescription}</p>
                <p>Event VEnue: {event.eventVenue}</p>
                <Link to={`/dash/events/${event.id}`}>View Event</Link>
                  
              
              
            </article>
        )
    }
    return content
}

//memoize
// EventsExcerpt = React.memo(EventsExcerpt)
export default EventExcerpt